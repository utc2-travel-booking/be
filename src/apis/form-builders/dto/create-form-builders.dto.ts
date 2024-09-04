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
    })
    @IsNotEmpty()
    @IsEnum(FormBuilderType)
    type: FormBuilderType;

    @SuperApiProperty({
        type: String,
        description: 'Name of user fill in the form',
        example: 'Alex',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @SuperApiProperty({
        description: 'Email of user fill in the form',
        example: 'alex@gmail.com',
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @SuperApiProperty({
        description: 'Subject of user fill in the form',
        example: 'Feedback',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    subject: string;

    @SuperApiProperty({
        description: 'Message of user fill in the form',
        example: 'I really like your website.',
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    content: string;
}
