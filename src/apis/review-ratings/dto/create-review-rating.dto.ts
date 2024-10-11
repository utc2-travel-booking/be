import { SuperApiProperty } from '@libs/super-core/decorators/super-api-property.decorator';
import { PartialType } from '@nestjs/swagger';
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
    @SuperApiProperty({
        type: String,
        description: 'Content of the review',
        default: 'Content',
        maxLength: 1000,
    })
    @MaxLength(1000)
    @IsString()
    @IsOptional()
    content: string;

    @SuperApiProperty({
        type: Number,
        description: 'Star of the review',
        default: 0,
        maximum: 5,
        minimum: 0,
    })
    @IsOptional()
    @Max(5)
    @Min(0)
    @IsNumber()
    star: number;

    @SuperApiProperty({
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
