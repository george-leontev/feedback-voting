import { prisma } from "../app";
import { VoteModel } from "../models/vote-model";

export class VoteRepository {
    async createAsync(vote: VoteModel) {
        const newVote: VoteModel = await prisma.vote.create({
            data: {
                userId: vote.userId,
                feedbackId: vote.feedbackId,
            }
        });

        return newVote;
    }
}