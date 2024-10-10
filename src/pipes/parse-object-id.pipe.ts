import { Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe
    implements PipeTransform<string, Types.ObjectId | string>
{
    transform(value: string): Types.ObjectId | string {
        if (!Types.ObjectId.isValid(value)) {
            return value;
        }
        return new Types.ObjectId(value);
    }
}
