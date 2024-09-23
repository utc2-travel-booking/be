import { SuperApiProperty } from '@libs/super-core';
import { PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { ExcludeDto } from 'src/base/dto/exclude.dto';
import { convertStringToObjectId } from 'src/utils/helper';
import { SEOTag } from '../entities/pages.entity';
import { IsExist } from 'src/common/services/is-exist-constraint.service';
import { COLLECTION_NAMES } from 'src/constants';
import { Types } from 'mongoose';

export class SEOTagDto extends SEOTag {
    @SuperApiProperty({
        type: String,
        description: 'Title of the seo tag',
        default: 'Post',
        title: 'Title',
        required: true,
    })
    @MaxLength(255)
    @IsString()
    @IsOptional()
    title: string;

    @SuperApiProperty({
        type: String,
        description: 'Description of the seo tag',
        default: 'Post',
        title: 'Description',
        required: true,
        cms: {
            widget: 'textarea',
        },
    })
    @IsString()
    @IsOptional()
    description: string;
}

export class CreatePagesDto extends PartialType(ExcludeDto) {
    @SuperApiProperty({
        type: String,
        description: 'Name of the page',
        default: 'Page',
        title: 'Name',
        required: true,
    })
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    name: string;

    @SuperApiProperty({
        type: String,
        description: 'Featured image id of the post',
        default: '60f3b3b3b3b3b3b3b3b3b3',
        title: 'Featured Image',
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
        type: SEOTagDto,
        description: 'SEO tag of the page',
        title: 'SEO Tag',
        required: true,
        default: {
            title: 'Post',
            description: 'Post',
        },
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => SEOTagDto)
    seoTag: SEOTagDto;
}
