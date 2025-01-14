import { prisma } from "../app";
import { DuplicateEntityError } from "../errors/duplicate-entity-error";
import { VoteModel } from "../models/vote-model";

/**
 * VoteRepository is responsible for interacting with the votes data in the database.
 * It provides method only to creat a vote for now.
 */
export class VoteRepository {

    /**
     * Creates a new vote for a feedback item
     * @param {VoteModel} vote - The vote object containing userId and feedbackId.
     * @throws {DuplicateEntityError} - Throws an error if the user has already voted on the feedback.
     * @returns {Promise<VoteModel>} Returns the newly created vote object.
     */
    async createAsync(vote: VoteModel) {
        // Check if the user has already voted on this feedback
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