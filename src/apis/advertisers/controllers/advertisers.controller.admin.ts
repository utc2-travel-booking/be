import { Body, Controller, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdvertisersService } from '../advertisers.service';
import { Types } from 'mongoose';
import { UserPayload } from 'src/base/models/user-payload.model';
import { COLLECTION_NAMES, PERMISSIONS } from 'src/constants';
import { Authorize } from 'src/decorators/authorize.decorator';
import {
    PagingDtoPipe,
    ExtendedPagingDto,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';
import { CreateAdvertiserDto } from '../dto/create-advertisers.dto';
import { UpdateAdvertiserDto } from '../dto/update-advertisers.dto';
import {
    DefaultDelete,
    DefaultGet,
    DefaultPost,
    DefaultPut,
} from 'src/base/controllers/base.controller';
import _ from 'lodash';
import { removeDiacritics } from 'src/utils/helper';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';

@Controller('advertisers')
@ApiTags('Admin: Advertisers')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.ADVERTISER,
})
export class AdvertisersControllerAdmin {
    constructor(private readonly advertisersService: AdvertisersService) {}

    @DefaultGet()
    @Authorize(PERMISSIONS.ADVERTISER.index)
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
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
            {
                ...createAdvertiserDto,
                slug: _.kebabCase(removeDiacritics(createAdvertiserDto.name)),
            },
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
