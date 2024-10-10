import { Expression } from 'mongoose';

export interface ICustomQueryBase<T> {
    select(fields: Record<string, number>): this;
    sort(sort: Record<string, 1 | -1 | Expression.Meta>): this;
}
