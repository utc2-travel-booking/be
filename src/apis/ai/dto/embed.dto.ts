import { SuperApiProperty } from '@libs/super-core';
import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ExcludeDto } from 'src/base/dto/exclude.dto';
import { TypeInputEmbed } from '../constant';

export class EmbedTextDto extends PartialType(ExcludeDto) {
    @SuperApiProperty({
        type: String,
        description: 'Text  to be embedded',
        required: false,
        title: 'Text to be embedded',
    })
    @IsString()
    text?: string;

    @SuperApiProperty({
        type: String,
        description: 'Text  to be embedded',
        required: false,
        title: 'Text to be embedded',
    })
    @IsString()
    urlImg?: string;

    @SuperApiProperty({
        type: String,
        description: 'Type of input to be embedded',
        required: true,
        title: 'Type of input to be embedded',
    })
    @IsString()
    type: TypeInputEmbed.IMAGE | TypeInputEmbed.TEXT;
}
