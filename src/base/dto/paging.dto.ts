import { SuperApiProperty } from '@libs/super-core/decorators/super-api-property.decorator';
import { SearchType } from '@libs/super-search/constants';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class PagingDto {
    @SuperApiProperty({
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

    @SuperApiProperty({
        name: 'page',
        description: 'Page for this query',
        default: 1,
        required: false,
    })
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    page: number;

    @SuperApiProperty({
        name: 'sortBy',
        description:
            'Fields wants to sort for this query, if many fields write it with command Example: name,email',
        default: 'createdAt',
        required: false,
    })
    @IsOptional()
    @IsString()
    sortBy: string;

    @SuperApiProperty({
        name: 'sortDirection',
        description:
            'What direction you want to sort contains 1 or -1 with 1 is ascending, -1 is descending Example: -1,1',
        default: -1,
        required: false,
    })
    @IsOptional()
    sortDirection: 1 | -1;

    @SuperApiProperty({
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

    @SuperApiProperty({
        name: 'searchType',
        description: 'Search type for this query. Available values: AND & OR',
        default: 'and',
        required: false,
    })
    @IsEnum(SearchType, {
        message: `SearchType must be a valid enum ${SearchType.AND} | ${
            SearchType.OR
        }  | ${SearchType.AND.toLocaleLowerCase()} | ${SearchType.OR.toLocaleLowerCase()}`,
    })
    @IsOptional()
    searchType: string;

    @SuperApiProperty({
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

    @SuperApiProperty({
        type: String,
        name: 'select',
        description: 'Select fields for this query. Example: _id,name',
        required: false,
    })
    @IsOptional()
    select: Record<string, number>;
}
