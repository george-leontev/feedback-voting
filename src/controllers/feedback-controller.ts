import { Body, Delete, Get, JsonController, Param, Post, Put, Res } from 'routing-controllers';
import { Response } from 'express';
import { FeedbackModel } from '../models/feedback-model';
import { FeedbackRepository } from '../repositories/feedback-repository';
import { StatusCodes } from 'http-status-codes';
import { NonexistentError } from '../errors/nonexistent-error';

@JsonController('/feedback')
export class FeedbackController {

    constructor(private feedbackRepository: FeedbackRepository) {
        this.feedbackRepository = new FeedbackRepository();
    }

    @Get()
    async getAllAsync(@Res() response: Response): Promise<any> {
        try {
            const feedbacks = this.feedbackRepository.getAllAsync();

            return feedbacks;
        }
        catch (error) {
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve feedbacks' });
        }
    }

    @Post()
    async postAsync(@Body() feedback: FeedbackModel, @Res() response: Response): Promise<any> {

        try {
            const newFeedback = await this.feedbackRepository.createAsync(feedback as FeedbackModel);

            return response.status(StatusCodes.CREATED).json(newFeedback);
        }
        catch (error) {
            console.error(error);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    };

    @Put('/:id')
    async updateAsync(@Param('id') id: number, @Body() feedback: FeedbackModel, @Res() response: any): Promise<any> {
        try {
            const updatedFeedback = await this.feedbackRepository.updateAsync(id, feedback);

            return updatedFeedback;
        }
        catch (error: any) {
            console.error(error);
            if (error instanceof NonexistentError) {
                return response.status(StatusCodes.NOT_FOUND).json({ message: error.message });
            }

            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    };

    @Delete('/:id')
    async deleteAsync(@Param('id') id: number, @Res() response: any): Promise<any> {
        try {
            const deletedFeedback = this.feedbackRepository.deleteAsync(id);

            return response.status(StatusCodes.NO_CONTENT).json(deletedFeedback);
        }
        catch (error) {
            if (error instanceof NonexistentError) {
                return response.status(StatusCodes.NOT_FOUND).json({ message: error.message });
            }
            console.error(error);
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    };

    @Get('/statuses')
    async getAvailableStatusesAsync(@Res() response: any) {
        try {
            const statuses = this.feedbackRepository.getAllStatusesAsync();

            return statuses;
        }
        catch (error) {
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve feedback statuses' });
        }
    };

    @Get('/categories')
    async getAvailableCategoriesAsync(@Res() response: any) {
        try {
            const categories = this.feedbackRepository.getAllCategoriesAsync();

            return categories;
        }
        catch (error) {
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve feedback categories' });
        }
    };
}
