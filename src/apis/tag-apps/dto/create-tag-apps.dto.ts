import { ExtendedApiProperty } from '@libs/super-core/decorators/extended-api-property.decorator';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Types } from 'mongoose';
import { ExcludeDto } from 'src/base/dto/exclude.dto';
import { IsExist } from 'src/common/services/is-exist-constraint.service';
import { COLLECTION_NAMES } from 'src/constants';
import { convertStringToObjectId } from 'src/utils/helper';

export class CreateTagAppDto extends PartialType(ExcludeDto) {
    @ExtendedApiProperty({
        type: String,
        title: 'Tag Id Of Tag In App',
        description: 'Tag id of the tag',
        default: '60f3b3b3b3b3b3b3b3b3b3',
        required: true,
        cms: {
            ref: COLLECTION_NAMES.TAG,
        },
    })
    @IsNotEmpty()
    @Transform(({ value }) => convertStringToObjectId(value))
    @IsExist({
        collectionName: COLLECTION_NAMES.TAG,
        message: 'Tag does not exist',
    })
    tag: Types.ObjectId;

    @ExtendedApiProperty({
        type: String,
        title: 'App Id Of Tag In App',
        description: 'App id of the tag',
        default: '60f3b3b3b3b3b3b3b3b3b3',
        required: true,
        cms: {
            ref: COLLECTION_NAMES.APP,
        },
    })
    @IsNotEmpty()
    @Transform(({ value }) => convertStringToObjectId(value))
    @IsExist({
        collectionName: COLLECTION_NAMES.APP,
        message: 'App does not exist',
    })
    app: Types.ObjectId;

    @ExtendedApiProperty({
        type: Number,
        title: 'Position Of Tag In App',
        description: 'Position of the tag in the app',
        default: 0,
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    position: number;
}
