import { SuperApiProperty } from '@libs/super-core/decorators/super-api-property.decorator';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserLoginTelegramDto {
    @SuperApiProperty({
        description: 'Telegram user id',
        example: 653520423,
    })
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @SuperApiProperty({
        description: 'Telegram user first name',
        example: 'John',
    })
    @IsOptional()
    @IsString()
    first_name: string;

    @SuperApiProperty({
        description: 'Telegram user last name',
        example: 'Doe',
    })
    @IsOptional()
    @IsString()
    last_name: string;

    @SuperApiProperty({
        description: 'Telegram user username',
        example: 'john doe',
    })
    @IsOptional()
    @IsString()
    username: string;

    @SuperApiProperty({
        description: 'Telegram user photo url',
        example: 'https://t.me/i/userpic/320/johndoe.jpg',
    })
    @IsOptional()
    @IsString()
    photo_url: string;

    @SuperApiProperty({
        description: 'Telegram user auth date',
        example: 1720496880,
    })
    @IsNotEmpty()
    @IsNumber()
    auth_date: number;

    @SuperApiProperty({
        description: 'Telegram user hash',
        example: 'd41d8cd98f00b204e9800998ecf8427e',
    })
    @IsNotEmpty()
    @IsString()
    hash: string;
}
