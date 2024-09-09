import { SuperApiProperty } from '@libs/super-core/decorators/super-api-property.decorator';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ExcludeDto } from 'src/base/dto/exclude.dto';

export class CreateUserReferralDto extends PartialType(ExcludeDto) {
    @SuperApiProperty({
        type: Number,
        required: true,
        title: 'Telegram ID',
    })
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    telegramUserId: number;

    @SuperApiProperty({
        type: String,
        required: true,
        title: 'Invite Code',
    })
    @IsNotEmpty()
    @IsString()
    inviteCode: string;
}
