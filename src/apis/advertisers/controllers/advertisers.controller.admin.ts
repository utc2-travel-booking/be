import { Body, Controller, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdvertisersService } from '../advertisers.service';
import { Types } from 'mongoose';
import { UserPayload } from 'src/base/models/user-payload.model';
import { PERMISSIONS } from 'src/constants';
import { Authorize } from 'src/decorators/authorize.decorator';
import {
    PagingDtoPipe,
    ExtendedPagingDto,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';
import { CreateAdvertiserDto } from '../dto/create-advertisers.dto';
import { UpdateAdvertiserDto } from '../dto/update-advertisers.dto';
import { Advertiser } from '../entities/advertisers.entity';
import {
    DefaultDelete,
    DefaultGet,
    DefaultPost,
    DefaultPut,
} from 'src/base/controllers/base.controller';

@Controller('advertisers')
@ApiTags('Admin: Advertisers')
export class AdvertisersControllerAdmin {
    constructor(private readonly advertisersService: AdvertisersService) {}

    @DefaultGet()
    @Authorize(PERMISSIONS.ADVERTISER.index)
    async getAll(
        @Query(new PagingDtoPipe<Advertiser>())
        queryParams: ExtendedPagingDto<Advertiser>,
    ) {
        const result = await this.advertisersService.getAll(queryParams);
        return result;
    }

    @DefaultGet(':id')
    @Authorize(PERMISSIONS.ADVERTISER.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.advertisersService.getOne(_id);
        return result;
    }

    @DefaultPost()
    @Authorize(PERMISSIONS.ADVERTISER.create)
    async create(
        @Body() createAdvertiserDto: CreateAdvertiserDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.advertisersService.createOne(
            createAdvertiserDto,
            user,
        );
        return result;
    }

    @DefaultPut(':id')
    @Authorize(PERMISSIONS.ADVERTISER.edit)
    @ApiParam({ name: 'id', type: String })
    async update(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Body() updateAdvertiserDto: UpdateAdvertiserDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.advertisersService.updateOneById(
            _id,
            updateAdvertiserDto,
            user,
        );

        return result;
    }

    @DefaultDelete()
    @Authorize(PERMISSIONS.ADVERTISER.destroy)
    @ApiQuery({ name: 'ids', type: [String] })
    async deletes(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.advertisersService.deletes(_ids, user);
        return result;
    }
}
