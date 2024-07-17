import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MaxLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { ExcludeDto } from 'src/base/dto/exclude.dto';
import { IsExist } from 'src/common/services/is-exist-constraint.service';
import { COLLECTION_NAMES } from 'src/constants';
import { convertStringToObjectId } from 'src/utils/helper';

export class UpdateMeDto extends PartialType(ExcludeDto) {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(50)
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @IsPhoneNumber('VN')
    phone: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    phoneCode: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    country: string;

    @ApiProperty()
    @IsOptional()
    @IsExist({
        collectionName: COLLECTION_NAMES.FILE,
        message: 'Avatar does not exist',
    })
    @Transform(({ value }) => convertStringToObjectId(value))
    avatar: Types.ObjectId;
}
