import { Body, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdvertisersService } from '../advertisers.service';
import { Types } from 'mongoose';
import { UserPayload } from 'src/base/models/user-payload.model';
import { COLLECTION_NAMES } from 'src/constants';
import {
    PagingDtoPipe,
    ExtendedPagingDto,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';
import { CreateAdvertiserDto } from '../dto/create-advertisers.dto';
import { UpdateAdvertiserDto } from '../dto/update-advertisers.dto';
import _ from 'lodash';
import { removeDiacritics } from 'src/utils/helper';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { SuperPost } from '@libs/super-core/decorators/super-post.decorator';
import { SuperPut } from '@libs/super-core/decorators/super-put.decorator';
import { SuperGet } from '@libs/super-core/decorators/super-get.decorator';
import { SuperDelete } from '@libs/super-core/decorators/super-delete.decorator';
import { SuperController } from '@libs/super-core';
import { SuperAuthorize } from '@libs/super-authorize/decorators/authorize.decorator';

@SuperController('advertisers')
@ApiTags('Admin: Advertisers')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.ADVERTISER,
})
export class AdvertisersControllerAdmin {
    constructor(private readonly advertisersService: AdvertisersService) {}

    @SuperGet()
    @SuperAuthorize()
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.advertisersService.getAll(queryParams);
        return result;
    }

    @SuperGet({ route: ':id' })
    @SuperAuthorize()
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.advertisersService.getOne(_id);
        return result;
    }

    @SuperPost({
        dto: CreateAdvertiserDto,
    })
    @SuperAuthorize()
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

    @SuperPut({ route: ':id', dto: UpdateAdvertiserDto })
    @SuperAuthorize()
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

    @SuperDelete()
    @SuperAuthorize()
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
