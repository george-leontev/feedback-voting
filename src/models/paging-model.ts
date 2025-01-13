export type FeedbackQueryModel = {
    page: number;
    limit: number;
    sortField: string;
    ascending: boolean;
    filterField: string;
    filterValue: number;
}