import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { ExcludeDto } from 'src/base/dto/exclude.dto';
import { IsExist } from 'src/common/services/is-exist-constraint.service';
import { COLLECTION_NAMES } from 'src/constants';
import { convertStringToObjectId } from 'src/utils/helper';
import { BannerImage } from '../entities/advertisers.entity';
import { File } from 'src/apis/media/entities/files.entity';

export class BannerImageDto extends BannerImage {
    @ApiProperty({
        type: String,
        description: 'Url redirect of the post',
        default: 'https://www.google.com',
    })
    @IsUrl()
    urlRedirect: string;

    @ApiProperty({
        type: String,
        description: 'File id of the post',
        default: '66ac363aca5ae70c449940f0',
    })
    @IsOptional()
    @Transform(({ value }) => convertStringToObjectId(value))
    @IsExist({
        collectionName: COLLECTION_NAMES.FILE,
        message: 'File  does not exist',
    })
    featuredImage: Types.ObjectId;
}

export class CreateAdvertiserDto extends PartialType(ExcludeDto) {
    @ApiProperty({
        type: String,
        description: 'Name of the advertiser',
        default: 'Advertiser',
    })
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: [BannerImageDto],
        description: 'bannerImages image of the post',
        default: [
            {
                urlRedirect: 'https://www.google.com',
                file: '66ac363aca5ae70c449940f0',
            },
        ],
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => BannerImageDto)
    bannerImages: BannerImageDto[];
}
