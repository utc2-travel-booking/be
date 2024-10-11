import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';
import { FormBuilderType } from '../constants';
import { SuperApiProperty } from '@libs/super-core/decorators/super-api-property.decorator';

export class CreateFormBuildersDto {
    @SuperApiProperty({
        description:
            ' Type for this form builder. Available values: BUSINESS_INQUIRIES | LOOKING_FOR_SUPPORT | PARTNERSHIP',
        example: FormBuilderType.BUSINESS_INQUIRIES,
        required: true,
    })
    @IsNotEmpty()
    @IsEnum(FormBuilderType)
    type: FormBuilderType;

    @SuperApiProperty({
        type: String,
        description: 'Name of user fill in the form',
        example: 'Alex',
        maxLength: 50,
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @SuperApiProperty({
        description: 'Email of user fill in the form',
        example: 'alex@gmail.com',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @SuperApiProperty({
        description: 'Subject of user fill in the form',
        example: 'Feedback',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    subject: string;

    @SuperApiProperty({
        description: 'Message of user fill in the form',
        example: 'I really like your website.',
        maxLength: 1000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    content: string;
}
