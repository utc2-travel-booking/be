import { BadGatewayException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe
    implements PipeTransform<string, Types.ObjectId | string>
{
    transform(value: string): Types.ObjectId | string {
        if (!Types.ObjectId.isValid(value)) {
            throw new BadGatewayException('Invalid ObjectId');
        }
        return new Types.ObjectId(value);
    }
}
