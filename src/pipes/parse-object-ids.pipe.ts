import { BadGatewayException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdArrayPipe
    implements PipeTransform<string, Types.ObjectId[]>
{
    transform(value: string): Types.ObjectId[] {
        const values = value.split(',');
        if (!Array.isArray(values)) {
            throw new BadGatewayException('Expected an array of ObjectIds');
        }

        const objectIds = values.map((val) => {
            const trimmedVal = val.trim();
            if (!Types.ObjectId.isValid(trimmedVal)) {
                throw new BadGatewayException(
                    `Invalid ObjectId: ${trimmedVal}`,
                );
            }
            return new Types.ObjectId(trimmedVal);
        });
        return objectIds;
    }
}
