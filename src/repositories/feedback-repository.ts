import { prisma } from '../app';
import { NotFoundEntityError } from '../errors/not-found-entity-error';
import { FeedbackModel } from '../models/feedback-model';
import { FeedbackPagedItemsModel } from '../models/feedback-paged-items-model';
import { DynamicObjectModel } from '../models/order-by-model';
import { FeedbackQueryModel } from '../models/paging-model';

/**
 * FeedbackRepository is responsible for interacting with the feedback data in the database.
 * It provides methods to create, read, update, and delete feedback entries, as well as retrieve
 * statuses and categories related to feedback.
 */
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
                ...feedback
            },
        });

        return newFeedback;
    };

    async updateAsync(id: number, feedback: FeedbackModel) {
        const existingFeedback = await prisma.feedback.findUnique({
            where: { id: id },
        });

        if (!existingFeedback) {
            throw new NotFoundEntityError('Feedback not found'); // Throw my own error if not found
        }

        const updatedFeedback = await prisma.feedback.update({
            where: { id: id },
            data: {
                ...feedback,
                updatedAt: new Date(), // Update the timestamp
            },
        });

        return updatedFeedback;
    };

    async deleteAsync(id: number) {
        const feedback = await prisma.feedback.delete({
            where: { id: id },
        });

        if (!feedback) {
            throw new NotFoundEntityError('Feedback not found'); // Also throw my own error if not found
        }

        return feedback
    }

    /**
     * Retrieves a paginated list of feedback votes based on the provided paging information
     * @param {FeedbackQueryModel} pagingInfo - The paging information including page, limit, sort field, and filter.
     * @returns {Promise<FeedbackPagedItemsModel>} Returns a paginated list of feedback votes.
     */
    async getPagedAsync(pagingInfo: FeedbackQueryModel) {
        const offset = (pagingInfo.page - 1) * pagingInfo.limit; // Calculate the offset for pagination

        const orderBy: DynamicObjectModel = {};
        orderBy[pagingInfo.sortField] = pagingInfo.ascending ? 'asc' : 'desc'; // Determine sort order

        const where: DynamicObjectModel = {};
        where[pagingInfo.filterField] = pagingInfo.filterValue; // Set the filter condition

        const feedbackVotes = await prisma.feedbackVote.findMany({
            skip: offset, // Skip the number of entries based on the current page
            take: pagingInfo.limit, // Limit the number of entries returned
            orderBy: orderBy, // Apply sorting
            where: where // Apply filtering
        });

        return {
            ...pagingInfo,
            items: feedbackVotes // Include retrieved reviews with their votes
        } as FeedbackPagedItemsModel;
    }
}
