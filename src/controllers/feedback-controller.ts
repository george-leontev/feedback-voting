import { Body, Delete, Get, HttpCode, JsonController, Param, Post, Put, Req, Res, UseBefore } from 'routing-controllers';
import { Response } from 'express';
import { FeedbackModel } from '../models/feedback-model';
import { FeedbackRepository } from '../repositories/feedback-repository';
import { StatusCodes } from 'http-status-codes';
import { Authorize } from '../middleware/authorize';
import { FeedbackQueryModel } from '../models/paging-model';
import { NotFoundEntityError } from '../errors/not-found-entity-error';

/**
 * FeedbackController handles HTTP requests related to feedback operations.
 * It provides endpoints for creating, updating, deleting, and retrieving feedback,
 * as well as retrieving statuses and categories
 */
@UseBefore(Authorize) // Do unable to use this controller endpoints until authorized
@JsonController('/api/feedback') // Define the base path for all routes in feedback controller
export class FeedbackController {

    /**
     * Creates a new FeedbackRepository instance for handling feedback operations.
     */
    constructor(private feedbackRepository: FeedbackRepository) {
        this.feedbackRepository = new FeedbackRepository();
    }


    @Get()
    async getAllAsync(@Res() response: Response): Promise<any> {
        try {
            const feedbacks = this.feedbackRepository.getAllAsync(); // Retrieve all feedback from the repository.

            return feedbacks;
        }
        catch (error) {
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve feedbacks' });
        }
    }

    @Post()
    @HttpCode(StatusCodes.CREATED) // HTTP response code to 201 (Created) for successful creation
    async postAsync(@Body() feedback: FeedbackModel, @Res() response: Response): Promise<any> {

        try {
            const newFeedback = await this.feedbackRepository.createAsync(feedback as FeedbackModel); // Create a new feedback item.

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
    @HttpCode(StatusCodes.NO_CONTENT) // HTTP response code to 204 (No Content) for successful deletion
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

    /**
     * Retrieves feedback items with pagination, sorting, and filtering
     * @param {number} page - The page number for pagination.
     * @param {number} limit - The number of items per page.
     * @param {string} sortField - The field to sort by.
     * @param {boolean} ascending - Specifies the order in which to sort.
     * @param {string} filterField - The field to filter by.
     * @param {number} filterValue - The value to filter by.
     * @param {Response} response - The Express response object.
     * @returns {Promise<any>} Paged feedback items.
     */
    // Here I implement pagination with sorting and filtering at the same time.
    // In the production case it is necessary to implement the ability to perform these actions separately.
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