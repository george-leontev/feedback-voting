import { prisma } from '../app';
import { FeedbackModel } from '../models/feedback-model';

export class FeedbackRepository {
    async getAllAsync() {
        const feedbacks = await prisma.feedback.findMany({
            include: {
                author: true, // Include author information
            },
        });

        return feedbacks
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
        // Check if the feedback exists
        const existingFeedback = await prisma.feedback.findUnique({
            where: { id: id },
        });

        if (!existingFeedback) {
            // TODO: typed error
            throw new Error('Feedback not found');
        }

        // Update the feedback
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
            throw new Error('User not found');;
        }

        return feedback
    }
}
