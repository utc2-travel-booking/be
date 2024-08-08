import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Expression, FilterQuery, PipelineStage, SortOrder } from 'mongoose';
import { PagingDto } from 'src/base/dto/paging.dto';
import { SearchType } from 'src/constants/enums';
import { createSearchPipeline } from 'src/packages/super-search/common/search.utils';

export class ExtendedPagingDto extends PagingDto {
    skip: number;
    filterPipeline: PipelineStage[];
}

@Injectable()
export class PagingDtoPipe implements PipeTransform {
    transform(value: PagingDto, metadata: ArgumentMetadata): ExtendedPagingDto {
        const {
            page = 1,
            search,
            sortBy = 'createdAt',
            sortDirection = -1,
            searchType = SearchType.AND,
            isAll,
        } = value;

        if (isAll) {
            value.limit = 999999999;
        }

        const limit = value.limit || 10;

        const pagingDto = {
            page: Number(page),
            limit: Number(limit),
            skip: (Number(page) - 1) * Number(limit),
            sortBy,
            sortDirection: Number(sortDirection) as 1 | -1 | Expression.Meta,
            searchType,
            search,
            isAll,
            filterPipeline: createSearchPipeline(search, searchType),
        };

        return pagingDto;
    }
}
