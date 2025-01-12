export type FeedbackModel = {
    id: number;
    title: string;
    description: string;
    categoryId: number;
    statusId: number;
    createdAt: Date;
    updatedAt: Date;
    authorId: number;
}