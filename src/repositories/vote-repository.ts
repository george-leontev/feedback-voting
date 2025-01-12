import { prisma } from "../app";
import { DuplicateEntityError } from "../errors/duplicate-entity-error";
import { VoteModel } from "../models/vote-model";

export class VoteRepository {
    async createAsync(vote: VoteModel) {
        const existingVote = await prisma.vote.findUnique({
            where: {
                userId_feedbackId: {
                    userId: vote.userId,
                    feedbackId: vote.feedbackId,
                },
            },
        });

        if (existingVote) {
            throw new DuplicateEntityError("User has already voted on this feedback.");
        }

        const newVote: VoteModel = await prisma.vote.create({
            data: {
                userId: vote.userId,
                feedbackId: vote.feedbackId,
            }
        });

        return newVote;
    }
}