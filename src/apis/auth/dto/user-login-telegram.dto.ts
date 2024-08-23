import { ExtendedApiProperty } from '@libs/super-core/decorators/extended-api-property.decorator';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserLoginTelegramDto {
    @ExtendedApiProperty({
        description: 'Telegram user id',
        example: 653520423,
    })
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ExtendedApiProperty({
        description: 'Telegram user first name',
        example: 'John',
    })
    @IsOptional()
    @IsString()
    first_name: string;

    @ExtendedApiProperty({
        description: 'Telegram user last name',
        example: 'Doe',
    })
    @IsOptional()
    @IsString()
    last_name: string;

    @ExtendedApiProperty({
        description: 'Telegram user username',
        example: 'johndoe',
    })
    @IsOptional()
    @IsString()
    username: string;

    @ExtendedApiProperty({
        description: 'Telegram user photo url',
        example: 'https://t.me/i/userpic/320/johndoe.jpg',
    })
    @IsOptional()
    @IsString()
    photo_url: string;

    @ExtendedApiProperty({
        description: 'Telegram user auth date',
        example: 1720496880,
    })
    @IsNotEmpty()
    @IsNumber()
    auth_date: number;

    @ExtendedApiProperty({
        description: 'Telegram user hash',
        example: 'd41d8cd98f00b204e9800998ecf8427e',
    })
    @IsNotEmpty()
    @IsString()
    hash: string;
}
