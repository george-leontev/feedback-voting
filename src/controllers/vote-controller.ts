import { VoteModel } from '../models/vote-model';
import { Body, JsonController, Post, Res } from 'routing-controllers';
import { VoteRepository } from '../repositories/vote-repository';
import { StatusCodes } from 'http-status-codes';
import { DuplicateEntityError } from '../errors/duplicate-entity-error';

@JsonController('/vote')
export class VoteController {

    private voteRepository: VoteRepository;

    constructor() {
        this.voteRepository = new VoteRepository();
    }

    @Post()
    async postAsync(@Body() vote: VoteModel, @Res() response: any): Promise<void> {
        try {

            const newVote = await this.voteRepository.createAsync(vote);

            return response.status(StatusCodes.CREATED).json(newVote);
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