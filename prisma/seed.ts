import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Create default user for testing
    const hashedPassword = await bcrypt.hash('1234567890', 10);
    const email = 'user@example.com';
    const avatar = '/avatar.png';

    await prisma.$executeRaw`truncate table admin.user cascade`;
    await prisma.$executeRaw`insert into admin.user (email, password, avatar) VALUES (${email}, ${hashedPassword}, ${avatar})`;

    // Create view with count of votes to current feedback for sorting
    await prisma.$executeRaw`
        drop view if exists business.feedback_vote;
    `;
    await prisma.$executeRaw`
        create view business.feedback_vote
            as
        select
            f.*,
            case when v.count is null then 0 ELSE v.count END AS count
            from business.feedback f
            left join (select v.feedback_id, count(*) count from business.vote v group by v.feedback_id) v on f.id = v.feedback_id
    `;

    // Delete existing records
    await prisma.feedbackStatus.deleteMany({});
    await prisma.feedbackCategory.deleteMany({});

    // Reset the sequences
    await prisma.$executeRaw`ALTER SEQUENCE dictionary.feedback_status_id_seq RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE dictionary.feedback_category_id_seq RESTART WITH 1;`;


    await prisma.feedbackCategory.createMany({
        data: [
            { name: 'Функциональность' },
            { name: 'Баг' },
            { name: 'UI' },
            { name: 'Производительность' },
        ],
    });

    await prisma.feedbackStatus.createMany({
        data: [
            { name: 'Идея' },
            { name: 'Запланировано' },
            { name: 'В работе' },
            { name: 'Выполнено' },
        ],
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
