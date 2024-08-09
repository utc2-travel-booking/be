import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { UserStatus } from 'src/apis/users/constants';
import { ExcludeDto } from 'src/base/dto/exclude.dto';
import { IsExist } from 'src/common/services/is-exist-constraint.service';
import { COLLECTION_NAMES } from 'src/constants';
import { convertStringToObjectId } from 'src/utils/helper';

export class CreateUserDto extends PartialType(ExcludeDto) {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsString()
    // @IsEnum(UserStatus, {
    //     message: `status must be a valid enum ${UserStatus.ACTIVE} | ${UserStatus.INACTIVE}`,
    // })
    // status: UserStatus;

    @ApiProperty()
    @Transform(({ value }) => convertStringToObjectId(value))
    @IsExist({
        collectionName: COLLECTION_NAMES.ROLE,
        message: 'Role does not exist',
    })
    @IsNotEmpty()
    role: Types.ObjectId;
}
