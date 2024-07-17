import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UserLoginDto {
    @ApiProperty({ default: 'admin@gmail.com' })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ default: '0934551744' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    readonly password: string;
}
