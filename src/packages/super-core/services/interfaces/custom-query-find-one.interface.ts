import { Document, Expression } from 'mongoose';

export interface ICustomQueryFindOne<T extends Document> {
    select(fields: Record<string, number>): this;
    sort(sort: Record<string, 1 | -1 | Expression.Meta>): this;
    exec(): Promise<T>;
}
