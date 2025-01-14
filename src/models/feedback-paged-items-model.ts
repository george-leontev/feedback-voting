import { FeedbackVoteModel } from "./feedback-vote-model";
import { FeedbackQueryModel } from "./paging-model";

export type FeedbackPagedItemsModel = FeedbackQueryModel & {
    items: FeedbackVoteModel[];
}