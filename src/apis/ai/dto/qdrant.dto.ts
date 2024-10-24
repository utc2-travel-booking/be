import { SuperApiProperty } from '@libs/super-core/decorators/super-api-property.decorator';
import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ExcludeDto } from 'src/base/dto/exclude.dto';

export class QdrantDto extends PartialType(ExcludeDto) {
    @SuperApiProperty({
        type: String,
        required: true,
        title: 'Name Of User',
    })
    @IsNotEmpty()
    @IsOptional()
    urlImg: string;

    @SuperApiProperty({
        type: String,
        required: true,
        title: 'Email Of User',
    })
    @IsNotEmpty()
    @IsOptional()
    textImg: string;

    @SuperApiProperty({
        type: Number,
        required: true,
        title: 'Array vector',
    })
    @IsNotEmpty()
    @IsOptional()
    vectors: number[];
}
