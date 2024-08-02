import { Controller, Delete, Get, Param, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from '../reviews.service';
import { Authorize } from 'src/decorators/authorize.decorator';
import { PERMISSIONS } from 'src/constants';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { Review } from '../entities/reviews.entity';
import { Types } from 'mongoose';
import { UserPayload } from 'src/base/models/user-payload.model';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';

@Controller('reviews')
@ApiTags('Admin: Reviews')
export class ReviewsControllerAdmin {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get()
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.REVIEW.index)
    async getAll(
        @Query(new PagingDtoPipe<Review>())
        queryParams: ExtendedPagingDto<Review>,
    ) {
        const result = await this.reviewsService.getAll(queryParams);
        return result;
    }

    @Get(':id')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.REVIEW.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.reviewsService.getOne(_id);
        return result;
    }

    @Delete()
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.REVIEW.destroy)
    @ApiQuery({ name: 'ids', type: [String] })
    async deletes(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.reviewsService.deletes(_ids, user);
        return result;
    }
}
