import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expression, SortOrder } from 'mongoose';
import { SearchType } from 'src/constants/enums';

export class PagingDto {
    @ApiProperty({
        name: 'limit',
        description: 'Limit of this query',
        required: false,
        default: 10,
        type: Number,
    })
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    limit: number;

    @ApiProperty({
        name: 'page',
        description: 'Page for this query',
        default: 1,
        required: false,
    })
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    page: number;

    @ApiProperty({
        name: 'sortBy',
        description:
            'Fields wants to sort for this query, if many fields write it with command Example: name,email',
        default: 'createdAt',
        required: false,
    })
    @IsOptional()
    @IsString()
    sortBy: string;

    @ApiProperty({
        name: 'sortDirection',
        description:
            'What direction you want to sort contains 1 or -1 with 1 is ascending, -1 is descending Example: -1,1',
        default: -1,
        required: false,
    })
    @IsOptional()
    sortDirection: 1 | -1 | Expression.Meta;

    @ApiProperty({
        name: 'search',
        description:
            'Search for this query. Example: [name:like]=test. Name is field, like is operator, test is value',
        required: false,
        type: 'object',
        default: {
            'search[name:like]': 'name',
        },
        additionalProperties: { type: 'string' },
    })
    @IsOptional()
    search: string;

    @ApiProperty({
        name: 'searchType',
        description: 'Search type for this query. Available values: AND & OR',
        default: 'and',
        required: false,
    })
    @IsEnum(SearchType, {
        message: `status must be a valid enum ${SearchType.AND} | ${SearchType.OR}`,
    })
    @IsOptional()
    searchType: string;

    @ApiProperty({
        name: 'isAll',
        description:
            'Get all data without pagination. Available values: false & true',
        default: 'false',
        required: false,
    })
    @Transform(({ value }) => {
        if (value === 'true') {
            return true;
        }
        return false;
    })
    @IsOptional()
    isAll: boolean;
}
