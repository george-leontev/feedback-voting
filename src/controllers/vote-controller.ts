import { VoteModel } from '../models/vote-model';
import { Body, JsonController, Post, Res } from 'routing-controllers';
import { VoteRepository } from '../repositories/vote-repository';

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

            return response.status(201).json(newVote);
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    };
}