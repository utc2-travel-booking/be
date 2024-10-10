import { Injectable, PipeTransform } from '@nestjs/common';
import { PipelineStage } from 'mongoose';
import { PagingDto } from 'src/base/dto/paging.dto';
import { createSearchPipeline } from '@libs/super-search/common/search.utils';
import { configSelect } from 'src/utils/select.utils';
import { SearchType } from '@libs/super-search/constants';

export class ExtendedPagingDto extends PagingDto {
    skip: number;
    filterPipeline: PipelineStage[];
}

@Injectable()
export class PagingDtoPipe implements PipeTransform {
    transform(value: PagingDto): ExtendedPagingDto {
        const {
            page = 1,
            search,
            sortBy = 'createdAt',
            sortDirection = -1,
            searchType = SearchType.AND,
            isAll,
            select,
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
            sortDirection: Number(sortDirection) as 1 | -1,
            searchType,
            search,
            isAll,
            filterPipeline: createSearchPipeline(search, searchType),
            select: configSelect(select),
        };

        return pagingDto;
    }
}
