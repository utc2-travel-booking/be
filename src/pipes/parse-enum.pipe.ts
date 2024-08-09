import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import { TYPE_ADD_POINT_FOR_USER } from 'src/apis/apps/constants';

@Injectable()
export class ParseEnumPipe
    implements PipeTransform<string, TYPE_ADD_POINT_FOR_USER>
{
    transform(
        value: string,
        metadata: ArgumentMetadata,
    ): TYPE_ADD_POINT_FOR_USER {
        if (!(value in TYPE_ADD_POINT_FOR_USER)) {
            throw new BadRequestException(`${value} is not a valid type`);
        }
        return TYPE_ADD_POINT_FOR_USER[
            value as keyof typeof TYPE_ADD_POINT_FOR_USER
        ];
    }
}
