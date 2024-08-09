import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { ExcludeDto } from 'src/base/dto/exclude.dto';
import { IsExist } from 'src/common/services/is-exist-constraint.service';
import { COLLECTION_NAMES } from 'src/constants';
import { convertStringToObjectId } from 'src/utils/helper';

export class CreateTagAppDto extends PartialType(ExcludeDto) {
    @ApiProperty({
        type: String,
        description: 'Tag id of the tag',
        default: '60f3b3b3b3b3b3b3b3b3b3',
    })
    @IsNotEmpty()
    @Transform(({ value }) => convertStringToObjectId(value))
    @IsExist({
        collectionName: COLLECTION_NAMES.TAG,
        message: 'Tag does not exist',
    })
    tag: Types.ObjectId;

    @ApiProperty({
        type: String,
        description: 'App id of the tag',
        default: '60f3b3b3b3b3b3b3b3b3b3',
    })
    @IsNotEmpty()
    @Transform(({ value }) => convertStringToObjectId(value))
    @IsExist({
        collectionName: COLLECTION_NAMES.APP,
        message: 'App does not exist',
    })
    app: Types.ObjectId;

    @ApiProperty({
        type: Number,
        description: 'Position of the tag in the app',
        default: 0,
    })
    @IsNotEmpty()
    @IsNumber()
    position: number;
}
