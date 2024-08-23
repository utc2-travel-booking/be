import { ExtendedApiProperty } from '@libs/super-core/decorators/extended-api-property.decorator';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { ExcludeDto } from 'src/base/dto/exclude.dto';
import { IsExist } from 'src/common/services/is-exist-constraint.service';
import { COLLECTION_NAMES } from 'src/constants';
import { convertStringToObjectId } from 'src/utils/helper';

export class CreateCategoryDto extends PartialType(ExcludeDto) {
    @ExtendedApiProperty({
        type: String,
        description: 'Name of the category',
        default: 'Category',
        title: 'Name Of Category',
        required: true,
    })
    @MaxLength(50)
    @IsString()
    @IsNotEmpty()
    name: string;

    @ExtendedApiProperty({
        type: String,
        description: 'Parent of the category',
        default: '60f3b3b3b3b3b3b3b3b3b3',
        title: 'Parent Of Category',
        cms: {
            ref: COLLECTION_NAMES.CATEGORIES,
        },
    })
    @IsOptional()
    @Transform(({ value }) => convertStringToObjectId(value))
    @IsExist({
        collectionName: COLLECTION_NAMES.CATEGORIES,
        message: 'Parent category does not exist',
    })
    parent: Types.ObjectId;

    @ExtendedApiProperty({
        type: String,
        description: 'Featured image id of the post',
        default: '60f3b3b3b3b3b3b3b3b3b3',
        title: 'Featured Image Of Category',
        cms: {
            ref: COLLECTION_NAMES.FILE,
        },
    })
    @IsOptional()
    @Transform(({ value }) => convertStringToObjectId(value))
    @IsExist({
        collectionName: COLLECTION_NAMES.FILE,
        message: 'Featured image does not exist',
    })
    featuredImage: Types.ObjectId;

    @ExtendedApiProperty({
        type: Number,
        description: 'Position of the tag in the app',
        default: 0,
        title: 'Position Of Category',
    })
    @IsNumber()
    @IsOptional()
    position: number;
}
