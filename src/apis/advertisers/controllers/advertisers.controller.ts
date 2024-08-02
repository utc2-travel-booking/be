import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdvertisersService } from '../advertisers.service';
import { Advertiser } from '../entities/advertisers.entity';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';

@Controller('advertisers')
@ApiTags('Front: Advertisers')
export class AdvertisersController {
    constructor(private readonly advertisersService: AdvertisersService) {}

    @Get()
    async getAll(
        @Query(new PagingDtoPipe<Advertiser>())
        queryParams: ExtendedPagingDto<Advertiser>,
    ) {
        const result = await this.advertisersService.getAll(queryParams);
        return result;
    }
}
