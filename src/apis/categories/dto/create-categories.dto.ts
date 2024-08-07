import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Types } from 'mongoose';
import { ExcludeDto } from 'src/base/dto/exclude.dto';
import { IsExist } from 'src/common/services/is-exist-constraint.service';
import { COLLECTION_NAMES } from 'src/constants';
import { convertStringToObjectId } from 'src/utils/helper';

export class CreateCategoryDto extends PartialType(ExcludeDto) {
    @ApiProperty({
        type: String,
        description: 'Name of the category',
        default: 'Category',
    })
    @MaxLength(50)
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: String,
        description: 'Parent of the category',
        default: '60f3b3b3b3b3b3b3b3b3b3',
    })
    @IsOptional()
    @Transform(({ value }) => convertStringToObjectId(value))
    @IsExist({
        collectionName: COLLECTION_NAMES.CATEGORIES,
        message: 'Parent category does not exist',
    })
    parent: Types.ObjectId;

    @ApiProperty({
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
}
