import { ExtendedApiProperty } from '@libs/super-core/decorators/extended-api-property.decorator';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UserLoginDto {
    @ExtendedApiProperty({ default: 'admin@gmail.com' })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ExtendedApiProperty({ default: '0934551744' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    readonly password: string;
}
