import { Document } from 'mongoose';
import { ICustomQueryBase } from 'src/base/interface/base.interface';

export interface ICustomQueryFindOne<T extends Document>
    extends ICustomQueryBase<T> {
    exec(): Promise<T | null>;
}
