import { ExtendedApiProperty } from '@libs/super-core/decorators/extended-api-property.decorator';
import { PartialType } from '@nestjs/swagger';
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
    @ExtendedApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(50)
    name: string;

    @ExtendedApiProperty()
    @IsOptional()
    @IsString()
    @IsEmail()
    email: string;

    @ExtendedApiProperty()
    @IsOptional()
    @IsString()
    @IsPhoneNumber('VN')
    phone: string;

    @ExtendedApiProperty()
    @IsOptional()
    @IsString()
    phoneCode: string;

    @ExtendedApiProperty()
    @IsOptional()
    @IsString()
    country: string;

    @ExtendedApiProperty()
    @IsOptional()
    @IsExist({
        collectionName: COLLECTION_NAMES.FILE,
        message: 'Avatar does not exist',
    })
    @Transform(({ value }) => convertStringToObjectId(value))
    avatar: Types.ObjectId;
}
