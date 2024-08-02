import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
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
import { CreateAppDto } from 'src/apis/apps/dto/create-app.dto';
import { UpdateAppDto } from 'src/apis/apps/dto/update-app.dto';
import { App } from 'src/apis/apps/entities/apps.entity';
import { SuperCache } from 'src/packages/super-cache/decorators/super-cache.decorator';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { AppsService } from '../apps.service';
import { appSettings } from 'src/configs/appsettings';

@Controller('apps')
@ApiTags('Admin: Apps')
@AuditLog({
    events: [
        AUDIT_EVENT.GET,
        AUDIT_EVENT.POST,
        AUDIT_EVENT.PUT,
        AUDIT_EVENT.DELETE,
    ],
    refSource: COLLECTION_NAMES.APP,
})
// @SuperCache({
//     mainCollectionName: COLLECTION_NAMES.APP,
//     relationCollectionNames: [COLLECTION_NAMES.USER],
// })
export class AppsControllerAdmin {
    constructor(private readonly appsService: AppsService) {}

    @Get()
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.APP.index)
    async getAll(
        @Query(new PagingDtoPipe<App>())
        queryParams: ExtendedPagingDto<App>,
    ) {
        const result = await this.appsService.getAll(queryParams);
        return result;
    }

    @Get(':id')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.APP.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.appsService.getOne(_id);
        return result;
    }

    @Post()
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.APP.create)
    async create(
        @Body() createAppDto: CreateAppDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.appsService.createOne(createAppDto, user);
        return result;
    }

    @Put(':id')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.APP.edit)
    @ApiParam({ name: 'id', type: String })
    async update(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Body() updateAppDto: UpdateAppDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.appsService.updateOneById(
            _id,
            updateAppDto,
            user,
        );

        return result;
    }

    @Delete()
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.APP.destroy)
    @ApiQuery({ name: 'ids', type: [String] })
    async deletes(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.appsService.deletes(_ids, user);
        return result;
    }
}
