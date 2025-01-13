import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // await prisma.$executeRaw`select f.*, v.count from  feedback f left join (select v.feedback_id, count(*) count from vote v group by v.feedback_id) v on f.id = v.feedback_id`
    // Delete existing records
    await prisma.feedbackStatus.deleteMany({});
    await prisma.feedbackCategory.deleteMany({});

    // Reset the sequences
    await prisma.$executeRaw`ALTER SEQUENCE "feedback_status_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "feedback_category_id_seq" RESTART WITH 1;`;


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
