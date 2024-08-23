import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';
import { FormBuilderType } from '../constants';
import { ExtendedApiProperty } from '@libs/super-core/decorators/extended-api-property.decorator';

export class CreateFormBuildersDto {
    @ExtendedApiProperty({
        description:
            ' Type for this form builder. Available values: BUSINESS_INQUIRIES | LOOKING_FOR_SUPPORT | PARTNERSHIP',
        example: FormBuilderType.BUSINESS_INQUIRIES,
    })
    @IsNotEmpty()
    @IsEnum(FormBuilderType)
    type: FormBuilderType;

    @ExtendedApiProperty({
        type: String,
        description: 'Name of user fill in the form',
        example: 'Alex',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @ExtendedApiProperty({
        description: 'Email of user fill in the form',
        example: 'alex@gmail.com',
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ExtendedApiProperty({
        description: 'Subject of user fill in the form',
        example: 'Feedback',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    subject: string;

    @ExtendedApiProperty({
        description: 'Message of user fill in the form',
        example: 'I really like your website.',
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    content: string;
}
