import { Body, Delete, Get, HttpCode, JsonController, Param, Post, Put, Req, Res, UseBefore } from 'routing-controllers';
import { Response } from 'express';
import { FeedbackModel } from '../models/feedback-model';
import { FeedbackRepository } from '../repositories/feedback-repository';
import { StatusCodes } from 'http-status-codes';
import { Authorize } from '../middleware/authorize';
import { FeedbackQueryModel } from '../models/paging-model';
import { NotFoundEntityError } from '../errors/not-found-entity-error';

@UseBefore(Authorize)
@JsonController('/api/feedback')
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
    @HttpCode(StatusCodes.CREATED)
    async postAsync(@Body() feedback: FeedbackModel, @Res() response: Response): Promise<any> {

        try {
            const newFeedback = await this.feedbackRepository.createAsync(feedback as FeedbackModel);

            return newFeedback;
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
            if (error instanceof NotFoundEntityError) {
                return response.status(StatusCodes.NOT_FOUND).json({ message: error.message });
            }

            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    };

    @Delete('/:id')
    @HttpCode(StatusCodes.NO_CONTENT)
    async deleteAsync(@Param('id') id: number, @Res() response: any): Promise<any> {
        try {
            const deletedFeedback = this.feedbackRepository.deleteAsync(id);

            return deletedFeedback;
        }
        catch (error) {
            if (error instanceof NotFoundEntityError) {
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

    @Get('/:page/:limit/:sortField/:ascending/:filterField/:filterValue')
    async getAllSuggestionsAsync(
        @Param('page') page: number,
        @Param('limit') limit: number,
        @Param('sortField') sortField: string,
        @Param('ascending') ascending: boolean,
        @Param('filterField') filterField: string,
        @Param('filterValue') filterValue: number,
        @Res() response: Response
    ): Promise<any> {
        const pagingInfo: FeedbackQueryModel = {
            page,
            limit,
            sortField,
            ascending,
            filterField,
            filterValue,
        };

        try {
            const pagedFeeedbackVotes = await this.feedbackRepository.getPagedAsync(pagingInfo);

            return pagedFeeedbackVotes;
        }
        catch (error) {
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve feedbacks' });
        }
    }
}