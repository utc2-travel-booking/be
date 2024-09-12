import { SuperApiProperty } from '@libs/super-core/decorators/super-api-property.decorator';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsEnum,
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
import { SubmitStatus } from '../entities/apps.entity';

export class CreateAppDto extends PartialType(ExcludeDto) {
    @SuperApiProperty({
        type: String,
        required: true,
        title: 'Name Of App',
    })
    @IsNotEmpty()
    @MaxLength(50)
    @IsString()
    name: string;

    @SuperApiProperty({
        type: String,
        default: 'https://example.com',
        required: true,
        title: 'Url Of App',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    url: string;

    @SuperApiProperty({
        type: String,
        default: 'Caption',
        required: true,
        title: 'Caption Of App',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    caption: string;

    @SuperApiProperty({
        type: String,
        required: false,
        description: 'Status for App',
        title: 'Status for App',
        enum: SubmitStatus,
        default: SubmitStatus.Approved,
    })
    @IsEnum(SubmitStatus)
    status: SubmitStatus;

    @SuperApiProperty({
        type: [String],
        description: 'Categories of the app',
        default: ['60f3b3b3b3b3b3b3b3b3b3'],
        title: 'Categories Of App',
        cms: {
            ref: COLLECTION_NAMES.CATEGORIES,
        },
    })
    @IsOptional()
    @Transform(({ value }) => convertStringToObjectId(value, true))
    @IsExist({
        collectionName: COLLECTION_NAMES.CATEGORIES,
        message: 'Category does not exist',
        isArray: true,
    })
    @IsArray()
    categories: Types.ObjectId[];

    @SuperApiProperty({
        type: String,
        description: 'Featured image id of the app',
        default: '60f3b3b3b3b3b3b3b3b3b3',
        title: 'Featured Image Of App',
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

    @SuperApiProperty({
        type: [String],
        description: 'Preview images id of the app',
        default: ['60f3b3b3b3b3b3b3b3b3b3'],
        title: 'Preview Images Of App',
        cms: {
            ref: COLLECTION_NAMES.FILE,
        },
    })
    @IsOptional()
    @Transform(({ value }) => convertStringToObjectId(value, true))
    @IsExist({
        collectionName: COLLECTION_NAMES.FILE,
        message: 'Featured image does not exist',
        isArray: true,
    })
    previewImages: Types.ObjectId[];

    @SuperApiProperty({
        type: String,
        description: 'Short description of the app',
        default: 'Short description',
        title: 'Short Description Of App',
        cms: {
            widget: 'textarea',
        },
    })
    @MaxLength(1000)
    @IsString()
    shortDescription: string;

    @SuperApiProperty({
        type: Date,
        description: 'Published date of the app',
        default: new Date(),
        title: 'Published Date Of App',
        cms: {
            isShow: false,
        },
    })
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => (value == null ? null : new Date(value)))
    publishedStart: Date;

    @SuperApiProperty({
        type: Date,
        default: new Date(),
        description: 'Published end date of the app',
        title: 'Published End Date Of App',
        cms: {
            isShow: false,
        },
    })
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => (value == null ? null : new Date(value)))
    publishedEnd: Date;
}
