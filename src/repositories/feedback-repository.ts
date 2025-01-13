import { prisma } from '../app';
import { NotFoundEntityError } from '../errors/not-found-entity-error';
import { FeedbackModel } from '../models/feedback-model';
import { FeedbackPagedItemsModel } from '../models/feedback-paged-items-model';
import { DynamicObjectModel } from '../models/order-by-model';
import { FeedbackQueryModel } from '../models/paging-model';


export class FeedbackRepository {
    async getAllAsync() {
        const feedbacks = await prisma.feedback.findMany();

        return feedbacks
    }

    async getAllStatusesAsync() {
        const statuses = await prisma.feedbackStatus.findMany();

        return statuses
    }

    async getAllCategoriesAsync() {
        const categories = await prisma.feedbackCategory.findMany();

        return categories
    }

    async createAsync(feedback: FeedbackModel) {
        const newFeedback = await prisma.feedback.create({
            data: {
                title: feedback.title,
                description: feedback.description,
                categoryId: feedback.categoryId,
                statusId: feedback.statusId,
                authorId: feedback.authorId
            },
        });

        return newFeedback;
    };

    async updateAsync(id: number, feedback: FeedbackModel) {
        const existingFeedback = await prisma.feedback.findUnique({
            where: { id: id },
        });

        if (!existingFeedback) {
            throw new NotFoundEntityError('Feedback not found');
        }

        const updatedFeedback = await prisma.feedback.update({
            where: { id: id },
            data: {
                ...feedback,
                updatedAt: new Date(),
            },
        });

        return updatedFeedback;
    };

    async deleteAsync(id: number) {
        const feedback = await prisma.feedback.delete({
            where: { id: id },
        });

        if (!feedback) {
            throw new NotFoundEntityError('Feedback not found');
        }

        return feedback
    }

    async getPagedAsync(pagingInfo: FeedbackQueryModel) {
        const offset = (pagingInfo.page - 1) * pagingInfo.limit;

        const orderBy: DynamicObjectModel = {};
        orderBy[pagingInfo.sortField] = pagingInfo.ascending ? 'asc' : 'desc';

        const where: DynamicObjectModel = {};
        where[pagingInfo.filterField] = pagingInfo.filterValue;

        const feedbackVotes = await prisma.feedbackVote.findMany({
            skip: offset,
            take: pagingInfo.limit,
            orderBy: orderBy,
            where: where
        });

        return {
            ...pagingInfo,
            items: feedbackVotes
        } as FeedbackPagedItemsModel;
    }
}
