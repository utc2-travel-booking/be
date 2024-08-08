import { ApiProperty, PartialType } from '@nestjs/swagger';
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

export class CreateTagDto extends PartialType(ExcludeDto) {
    @ApiProperty({
        type: String,
        description: 'Name of the tag',
        default: 'Tag',
    })
    @MaxLength(50)
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: String,
        description: 'Short description of the tag',
        default: 'Short description',
    })
    @MaxLength(1000)
    @IsString()
    @IsOptional()
    shortDescription: string;

    @ApiProperty({
        type: String,
        description: 'Featured image id of the tag',
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
        type: Number,
        description: 'Position of the tag',
        default: 0,
    })
    @IsOptional()
    @IsNumber()
    position: number;
}
