import { Expression } from 'mongoose';

export interface ICustomQueryCountDocuments {
    select(fields: Record<string, number>): this;
    skip(value: number): this;
    limit(value: number): this;
    sort(sort: Record<string, 1 | -1 | Expression.Meta>): this;
    exec(): Promise<number>;
}
