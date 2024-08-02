import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { ExcludeDto } from 'src/base/dto/exclude.dto';
import { IsExist } from 'src/common/services/is-exist-constraint.service';
import { COLLECTION_NAMES } from 'src/constants';
import { convertStringToObjectId } from 'src/utils/helper';

export class CreateAppDto extends PartialType(ExcludeDto) {
    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(50)
    @IsString()
    name: string;

    @ApiProperty({
        default: 'https://example.com',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    url: string;

    @ApiProperty({
        type: [String],
        description: 'Categories of the app',
        default: [],
    })
    @IsOptional()
    @Transform(({ value }) => convertStringToObjectId(value, true))
    @IsExist({
        collectionName: COLLECTION_NAMES.CATEGORIES,
        message: 'Category does not exist',
    })
    @IsArray()
    categories: Types.ObjectId[];

    @ApiProperty({
        type: String,
        description: 'Featured image id of the app',
        default: '60f3b3b3b3b3b3b3b3b3b3',
    })
    @IsOptional()
    @Transform(({ value }) => convertStringToObjectId(value))
    @IsExist({
        collectionName: COLLECTION_NAMES.FILE,
        message: 'Featured image does not exist',
    })
    featuredImage: Types.ObjectId;

    @ApiProperty({
        type: [String],
        description: 'Preview images id of the app',
        default: ['60f3b3b3b3b3b3b3b3b3b3'],
    })
    @IsOptional()
    @Transform(({ value }) => convertStringToObjectId(value, true))
    @IsExist({
        collectionName: COLLECTION_NAMES.FILE,
        message: 'Featured image does not exist',
    })
    previewImages: Types.ObjectId[];

    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(1000)
    @IsString()
    shortDescription: string;

    @ApiProperty({
        type: Date,
        description: 'Published date of the app',
        default: new Date(),
    })
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => (value == null ? null : new Date(value)))
    publishedStart: Date;

    @ApiProperty({
        type: Date,
        default: new Date(),
        description: 'Published end date of the app',
    })
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => (value == null ? null : new Date(value)))
    publishedEnd: Date;
}
