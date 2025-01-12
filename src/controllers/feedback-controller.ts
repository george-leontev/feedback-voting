import { Body, Delete, Get, JsonController, Param, Post, Put, Res } from 'routing-controllers';
import { Response } from 'express';
import { FeedbackModel } from '../models/feedback-model';
import { FeedbackStatuses } from '../models/enums/feedback-statuses';
import { FeedbackCategories } from '../models/enums/feedback-categories';
import { FeedbackRepository } from '../repositories/feedback-repository';

@JsonController('/feedback')
export class FeedbackController {

    private feedbackRepository: FeedbackRepository;

    constructor() {
        this.feedbackRepository = new FeedbackRepository();
    }

    @Get()
    async getAllAsync(@Res() response: Response): Promise<any> {
        try {
            const feedbacks = this.feedbackRepository.getAllAsync();

            return feedbacks;
        }
        catch (error) {
            response.status(500).json({ error: 'Failed to retrieve feedbacks' });
        }
    }

    @Post()
    async postAsync(@Body() feedback: FeedbackModel, @Res() response: Response): Promise<any> {

        try {
            const newFeedback = await this.feedbackRepository.createAsync(feedback as FeedbackModel);

            return response.status(201).json(newFeedback);
        }
        catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal server error' });
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
            if (error.message === 'Feedback not found') {

                return response.status(404).json({ message: 'Feedback not found' });
            }

            return response.status(500).json({ message: 'Internal server error' });
        }
    };

    @Delete('/:id')
    async deleteAsync(@Param('id') id: number, @Res() response: any): Promise<any> {
        try {
            const deletedFeedback = this.feedbackRepository.deleteAsync(id);

            return response.status(204).json(deletedFeedback);
        }
        catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    };

    @Get('/statuses')
    async getAvailableStatusesAsync() {
        return FeedbackStatuses;
    };

    @Get('/categories')
    async getAvailableCategoriesAsync() {
        return FeedbackCategories;
    };
}

function postFeedbackService(arg0: FeedbackModel) {
    throw new Error('Function not implemented.');
}
