import { SuperApiProperty } from '@libs/super-core';
import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ExcludeDto } from 'src/base/dto/exclude.dto';

export class EmbedTextDto extends PartialType(ExcludeDto) {
    @SuperApiProperty({
        type: String,
        description: 'Text to be embedded',
        required: true,
        title: 'Name Of Category',
    })
    @IsString()
    @IsNotEmpty({ message: 'The text field is required and cannot be empty' })
    text: string;
}
