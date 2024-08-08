import { Controller, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdvertisersService } from '../advertisers.service';
import { Advertiser } from '../entities/advertisers.entity';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { DefaultGet } from 'src/base/controllers/base.controller';
import { populateGroupBannerImageAggregate } from '../common/populate-group-banner-image.aggregate';

@Controller('advertisers')
@ApiTags('Front: Advertisers')
export class AdvertisersController {
    constructor(private readonly advertisersService: AdvertisersService) {}

    @DefaultGet()
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.advertisersService.getAll(queryParams);
        return result;
    }

    @DefaultGet(':slug')
    async getOneBySlug(@Param('slug') slug: string) {
        const result = await this.advertisersService
            .findOne({ slug }, populateGroupBannerImageAggregate)
            .exec();
        return result;
    }
}
