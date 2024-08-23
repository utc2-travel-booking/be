import { Controller, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdvertisersService } from '../advertisers.service';
import { Advertiser } from '../entities/advertisers.entity';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';

import { populateGroupBannerImageAggregate } from '../common/populate-group-banner-image.aggregate';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { COLLECTION_NAMES } from 'src/constants';
import { ExtendedGet } from '@libs/super-core/decorators/extended-get.decorator';

@Controller('advertisers')
@ApiTags('Front: Advertisers')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.ADVERTISER,
})
export class AdvertisersController {
    constructor(private readonly advertisersService: AdvertisersService) {}

    @ExtendedGet()
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.advertisersService.getAll(queryParams);
        return result;
    }

    @ExtendedGet({ route: ':slug' })
    async getOneBySlug(@Param('slug') slug: string) {
        const result = await this.advertisersService
            .findOne({ slug }, populateGroupBannerImageAggregate)
            .exec();
        return result;
    }
}
