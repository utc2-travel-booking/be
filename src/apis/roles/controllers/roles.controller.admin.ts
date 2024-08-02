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
import { Role } from 'src/apis/roles/entities/roles.entity';
import { RolesService } from 'src/apis/roles/roles.service';
import { UserPayload } from 'src/base/models/user-payload.model';
import { COLLECTION_NAMES, PERMISSIONS } from 'src/constants';
import { Authorize } from 'src/decorators/authorize.decorator';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { CreateRoleDto } from '../dto/create-role.dto';
import { SuperCache } from 'src/packages/super-cache/decorators/super-cache.decorator';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { appSettings } from 'src/configs/appsettings';

@Controller('roles')
@ApiTags('Admin: Roles')
@SuperCache({
    mainCollectionName: COLLECTION_NAMES.ROLE,
    relationCollectionNames: [
        COLLECTION_NAMES.USER,
        COLLECTION_NAMES.PERMISSION,
    ],
})
@AuditLog({
    events: [
        AUDIT_EVENT.GET,
        AUDIT_EVENT.POST,
        AUDIT_EVENT.PUT,
        AUDIT_EVENT.DELETE,
    ],
    refSource: COLLECTION_NAMES.ROLE,
})
export class RolesControllerAdmin {
    constructor(private readonly rolesService: RolesService) {}

    @Get()
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.ROLE.index)
    async getAll(
        @Query(new PagingDtoPipe<Role>())
        queryParams: ExtendedPagingDto<Role>,
    ) {
        const result = await this.rolesService.getAll(queryParams, {});
        return result;
    }

    @Get(':id')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.ROLE.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.rolesService.getOne(_id, {});
        return result;
    }

    @Post()
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.ROLE.create)
    async create(
        @Body() createRoleDto: CreateRoleDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.rolesService.createOne(
            createRoleDto,
            user,
            {},
        );
        return result;
    }

    @Put(':id')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.ROLE.edit)
    @ApiParam({ name: 'id', type: String })
    async update(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Body() updateRoleDto: UpdateRoleDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.rolesService.updateOneById(
            _id,
            updateRoleDto,
            user,
        );

        return result;
    }

    @Delete()
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.ROLE.destroy)
    @ApiQuery({ name: 'ids', type: [String] })
    async deletes(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.rolesService.deletes(_ids, user);
        return result;
    }
}
