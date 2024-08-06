import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Types } from 'mongoose';
import { ExcludeDto } from 'src/base/dto/exclude.dto';
import { IsExist } from 'src/common/services/is-exist-constraint.service';
import { COLLECTION_NAMES } from 'src/constants';
import { convertStringToObjectId } from 'src/utils/helper';

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
        type: [String],
        description: 'bannerImages image id of the post',
        default: ['idMedia1', 'idMedia2'],
    })
    @IsOptional()
    @Transform(({ value }) => convertStringToObjectId(value, true))
    @IsExist({
        collectionName: COLLECTION_NAMES.FILE,
        message: 'bannerImages image does not exist',
        isArray: true,
    })
    bannerImages: Types.ObjectId;
}
