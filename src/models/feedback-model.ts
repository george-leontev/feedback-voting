export type FeedbackModel = {
    id: number;
    title: string;
    description: string;
    category: "Функциональность" | "Баг" | "UI" | "Производительность";
    status: 'Идея' | 'Запланировано' | 'В_работе' | 'Выполнено';
    createdAt: Date;
    updatedAt: Date;
    authorId: number;
}