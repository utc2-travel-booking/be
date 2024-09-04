import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
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
import { PostStatus } from '../constants';
import { convertStringToObjectId } from 'src/utils/helper';
import { SuperApiProperty } from '@libs/super-core/decorators/super-api-property.decorator';

export class CreatePostDto extends PartialType(ExcludeDto) {
    @SuperApiProperty({
        type: String,
        description: 'Name of the post',
        default: 'Post',
    })
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    name: string;

    @SuperApiProperty({
        type: String,
        description: 'Short description of the post',
        default: 'Short description',
    })
    @MaxLength(1000)
    @IsString()
    @IsOptional()
    shortDescription: string;

    @SuperApiProperty({
        type: String,
        description: 'Long description of the post',
        default: 'Long description',
    })
    @IsString()
    @IsOptional()
    longDescription: string;

    @SuperApiProperty({
        name: 'status',
        description:
            'Status for this post. Available values: PUBLISHED & DRAFT',
        default: PostStatus.PUBLISHED,
        required: true,
    })
    @IsString()
    @IsEnum(PostStatus, {
        message: `status must be a valid enum ${PostStatus.PUBLISHED} | ${PostStatus.DRAFT}`,
    })
    @IsNotEmpty()
    status: PostStatus;

    @SuperApiProperty({
        type: String,
        description: 'Featured image id of the post',
        default: '60f3b3b3b3b3b3b3b3b3b3',
    })
    @IsOptional()
    @Transform(({ value }) => convertStringToObjectId(value))
    @IsExist({
        collectionName: COLLECTION_NAMES.FILE,
        message: 'Featured image does not exist',
    })
    featuredImage: Types.ObjectId;

    @SuperApiProperty({
        type: String,
        description: 'Category of id the post',
        default: '60f3b3b3b3b3b3b3b3b3b3',
    })
    @IsOptional()
    @Transform(({ value }) => convertStringToObjectId(value))
    @IsExist({
        collectionName: COLLECTION_NAMES.CATEGORIES,
        message: 'Category does not exist',
    })
    category: Types.ObjectId;

    @SuperApiProperty({
        type: Date,
        description: 'Published date of the post',
        default: new Date(),
    })
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => (value == null ? null : new Date(value)))
    publishedStart: Date;

    @SuperApiProperty({
        type: Date,
        default: new Date(),
        description: 'Published end date of the post',
    })
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => (value == null ? null : new Date(value)))
    publishedEnd: Date;
}
