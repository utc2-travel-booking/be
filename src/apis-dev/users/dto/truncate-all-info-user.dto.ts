import { SuperApiProperty } from '@libs/super-core';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { ExcludeDto } from 'src/base/dto/exclude.dto';
import { IsExist } from 'src/common/services/is-exist-constraint.service';
import { COLLECTION_NAMES } from 'src/constants';
import { convertStringToObjectId } from 'src/utils/helper';

export class TruncateAllInfoUserDto extends PartialType(ExcludeDto) {
    @SuperApiProperty({
        type: [String],
        description: 'User Id',
        default: ['60f3b3b3b3b3b3b3b3b3b3'],
        title: 'User Id',
        cms: {
            ref: COLLECTION_NAMES.USER,
        },
    })
    @IsOptional()
    @Transform(({ value }) => convertStringToObjectId(value, true))
    @IsExist({
        collectionName: COLLECTION_NAMES.USER,
        message: 'User does not exist',
        isArray: true,
    })
    @IsArray()
    users: Types.ObjectId[];

    @SuperApiProperty({
        type: [Number],
        description: 'User telegram id',
        default: [6612887782],
        title: 'Team Id',
    })
    @IsOptional()
    @IsArray()
    telegramUserIds: number[];
}
