import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserLoginSignatureDto {
    @ApiProperty({
        default:
            '3Hj1kULDRYRZqaucHFh8G2E1C6YZcX76QPMuaRzYJqQHoYqouf7rnW59v12iefu31Du9tGznT3T2UhkWPkmhDkiL',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    readonly signature: string;

    @ApiProperty({ default: '21JhswGzKHPkafY1ss5fqwrmEKvryCkvBDyrKwuhUDog' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    readonly publicKey: string;

    @ApiProperty({ default: '1719820411583' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    readonly timestamp: string;
}
