import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
export declare const updateDocumentMultipleLanguage: (model: Model<any>, entity: any, filter: FilterQuery<any> | Types.ObjectId, update: UpdateQuery<any>, locale: string) => Promise<void>;
