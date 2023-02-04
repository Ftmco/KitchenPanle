export interface UpsertNote {
    id?: string | null;
    title: string;
    description: string;
    importance: number;
}