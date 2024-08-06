import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsNumber,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator';
import { Types } from 'mongoose';
import { ExcludeDto } from 'src/base/dto/exclude.dto';
import { IsExist } from 'src/common/services/is-exist-constraint.service';
import { COLLECTION_NAMES } from 'src/constants';
import { convertStringToObjectId } from 'src/utils/helper';

export class CreateReviewRatingDto extends PartialType(ExcludeDto) {
    @ApiProperty({
        type: String,
        description: 'Content of the review',
        default: 'Content',
    })
    @MaxLength(1000)
    @IsString()
    @IsOptional()
    content: string;

    @ApiProperty({
        type: Number,
        description: 'Star of the review',
        default: 0,
    })
    @IsOptional()
    @Max(5)
    @Min(0)
    @IsNumber()
    star: number;

    @ApiProperty({
        type: String,
        description: 'App id',
        default: '60f3b3b3b3b3b3b3b3b3b3',
    })
    @IsOptional()
    @Transform(({ value }) => convertStringToObjectId(value))
    @IsExist({
        collectionName: COLLECTION_NAMES.APP,
        message: 'App not found',
    })
    app: Types.ObjectId;
}
