import { Document } from 'mongoose';
import { ICustomQueryBase } from './custom-query-base.interface';

export interface ICustomQueryFindAll<T extends Document>
    extends ICustomQueryBase<T> {
    skip(value: number): this;
    limit(value: number): this;
    exec(): Promise<T[]>;
}
