import { PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { ExcludeDto } from 'src/base/dto/exclude.dto';
import { IsExist } from 'src/common/services/is-exist-constraint.service';
import { COLLECTION_NAMES } from 'src/constants';
import { convertStringToObjectId } from 'src/utils/helper';
import { BannerImage } from '../entities/advertisers.entity';
import { SuperApiProperty } from '@libs/super-core/decorators/super-api-property.decorator';

export class BannerImageDto extends BannerImage {
    @SuperApiProperty({
        type: String,
        description: 'Url redirect of the post',
        default: 'https://www.google.com',
        title: 'Url Redirect Of Banner Image',
    })
    urlRedirect: string;

    @SuperApiProperty({
        type: String,
        description: 'File id of the post',
        default: '66ac363aca5ae70c449940f0',
        title: 'File Of Banner Image',
        cms: {
            ref: COLLECTION_NAMES.FILE,
        },
    })
    @IsOptional()
    @Transform(({ value }) => convertStringToObjectId(value))
    @IsExist({
        collectionName: COLLECTION_NAMES.FILE,
        message: 'File  does not exist',
    })
    featuredImage: Types.ObjectId;

    @ExtendedApiProperty({
        type: String,
        description: 'Title of image',
        default: 'Millionaire',
        title: 'Title',
    })
    title: string;

    @ExtendedApiProperty({
        type: String,
        description: 'Sub description of the post',
        default: 'Lorem ipsum dolor sit',
        title: 'Short Description',
    })
    shortDescription: string;

    @ExtendedApiProperty({
        type: String,
        description: 'File id of the post',
        default: '66ac363aca5ae70c449940f0',
        title: 'Icon Of Banner Image',
        cms: {
            ref: COLLECTION_NAMES.FILE,
        },
    })
    @IsOptional()
    @Transform(({ value }) => convertStringToObjectId(value))
    @IsExist({
        collectionName: COLLECTION_NAMES.FILE,
        message: 'File  does not exist',
    })
    iconImage: Types.ObjectId;
}

export class CreateAdvertiserDto extends PartialType(ExcludeDto) {
    @SuperApiProperty({
        type: String,
        description: 'Name of the advertiser',
        default: 'Advertiser',
        title: 'Name Of Advertiser',
    })
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    name: string;

    @SuperApiProperty({
        type: [BannerImageDto],
        description: 'bannerImages image of the post',
        default: [
            {
                urlRedirect: 'https://www.google.com',
                file: '66ac363aca5ae70c449940f0',
            },
        ],
        title: 'Banner Images Of Advertiser',
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => BannerImageDto)
    bannerImages: BannerImageDto[];
}
