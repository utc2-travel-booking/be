import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';
import { FormBuilderType } from '../constants';

export class CreateFormBuildersDto {
    @ApiProperty({
        description:
            ' Type for this form builder. Available values: BUSINESS_INQUIRIES | LOOKING_FOR_SUPPORT | PARTNERSHIP',
        example: FormBuilderType.Business_Inquiries,
    })
    @IsNotEmpty()
    @IsEnum(FormBuilderType)
    type: FormBuilderType;

    @ApiProperty({
        type: String,
        description: 'Name of user fill in the form',
        example: 'Alex',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @ApiProperty({
        description: 'Email of user fill in the form',
        example: 'alex@gmail.com',
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Subject of user fill in the form',
        example: 'Feedback',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    subject: string;

    @ApiProperty({
        description: 'Message of user fill in the form',
        example: 'I really like your website.',
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    content: string;
}
