import { VoteModel } from '../models/vote-model';
import { Body, HttpCode, JsonController, Post, Res, UseBefore } from 'routing-controllers';
import { VoteRepository } from '../repositories/vote-repository';
import { StatusCodes } from 'http-status-codes';
import { DuplicateEntityError } from '../errors/duplicate-entity-error';
import { Authorize } from '../middleware/authorize';

/**
 * VoteController handles HTTP requests related to voting on feedback.
 * It provides an endpoint for users to submit their votes.
 */
@UseBefore(Authorize) // Do unable to use this controller endpoints until authorized
@JsonController('/api/vote')  // Define the base path for all routes in vote controller.
export class VoteController {

    /**
     * Creates a new VoteRepository instance for handling vote operations.
     */
    constructor(private voteRepository: VoteRepository) {
        this.voteRepository = new VoteRepository();
    }

    /**
     * Submits a new vote for a feedback item.
     *
     * @param {VoteModel} vote - The vote object containing userId and feedbackId.
     * @param {Response} response - The Express response object for sending responses.
     * @returns {Promise<VoteModel>} - Returns the newly created vote object.
     * @throws {StatusCodes} - Returns appropriate HTTP status codes based on the outcome.
     */
    @Post()
    @HttpCode(StatusCodes.CREATED) // HTTP response code to 201 (Created) for successful creation.
    async postAsync(@Body() vote: VoteModel, @Res() response: any): Promise<VoteModel> {
        try {
            const newVote = await this.voteRepository.createAsync(vote);

            return newVote;
        }
        catch (error) {
            console.error(error);
            if (error instanceof DuplicateEntityError) {
                return response.status(StatusCodes.NOT_FOUND).json({ message: error.message });
            }
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    };
}