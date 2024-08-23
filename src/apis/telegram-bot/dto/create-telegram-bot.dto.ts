import { ExtendedApiProperty } from '@libs/super-core/decorators/extended-api-property.decorator';
import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ExcludeDto } from 'src/base/dto/exclude.dto';

export class CreateTelegramBotDto extends PartialType(ExcludeDto) {
    @ExtendedApiProperty({
        type: String,
        required: true,
        title: 'Token Of Bot',
    })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ExtendedApiProperty({
        type: String,
        required: true,
        title: 'Bot Id Of Bot',
    })
    @IsString()
    @IsNotEmpty()
    botId: string;

    @ExtendedApiProperty({
        type: String,
        required: true,
        title: 'Name Of Bot',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ExtendedApiProperty({
        type: String,
        required: true,
        title: 'Domain Of Bot',
    })
    @IsString()
    @IsNotEmpty()
    domain: string;
}
