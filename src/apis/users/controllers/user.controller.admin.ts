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
import { UserPayload } from 'src/base/models/user-payload.model';
import { Authorize } from 'src/decorators/authorize.decorator';
import { COLLECTION_NAMES, PERMISSIONS } from 'src/constants';
import { UpdateMeDto } from 'src/apis/users/dto/update-me.dto';
import { UserService } from 'src/apis/users/user.service';
import { User } from 'aws-sdk/clients/appstream';
import { Types } from 'mongoose';
import {
    PagingDtoPipe,
    ExtendedPagingDto,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { SuperCache } from 'src/packages/super-cache/decorators/super-cache.decorator';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { appSettings } from 'src/configs/appsettings';

@Controller('users')
@ApiTags('Admin: User')
@SuperCache({
    mainCollectionName: COLLECTION_NAMES.USER,
    relationCollectionNames: [COLLECTION_NAMES.FILE, COLLECTION_NAMES.ROLE],
})
@AuditLog({
    events: [
        AUDIT_EVENT.GET,
        AUDIT_EVENT.POST,
        AUDIT_EVENT.PUT,
        AUDIT_EVENT.DELETE,
    ],
    refSource: COLLECTION_NAMES.USER,
})
export class UserControllerAdmin {
    constructor(private readonly userService: UserService) {}

    @Put('ban')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.USER.edit)
    @ApiQuery({ name: 'ids', type: [String] })
    async ban(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.userService.ban(_ids, user);
        return result;
    }

    @Put('un-ban')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.USER.edit)
    @ApiQuery({ name: 'ids', type: [String] })
    async unBan(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        const result = await this.userService.unBan(_ids, user);
        return result;
    }

    @Get('me')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.USER.index)
    async getMe(@Req() req: { user: UserPayload }) {
        const { user } = req;

        const result = await this.userService.getMe(user);
        return result;
    }

    @Put('me')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.USER.edit)
    async updateMe(
        @Body() updateMeDto: UpdateMeDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        return this.userService.updateMe(user, updateMeDto);
    }

    @Get()
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.USER.index)
    async getAll(
        @Query(new PagingDtoPipe<User>())
        queryParams: ExtendedPagingDto<User>,
    ) {
        const result = await this.userService.getAll(queryParams);
        return result;
    }

    @Get(':id')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.USER.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.userService.getOne(_id);
        return result;
    }

    @Post()
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.USER.create)
    async create(
        @Body() createRoleDto: CreateUserDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.userService.createOne(createRoleDto, user);
        return result;
    }

    @Put(':id')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.USER.edit)
    @ApiParam({ name: 'id', type: String })
    async update(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Body() updateUserDto: UpdateUserDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.userService.updateOneById(
            _id,
            updateUserDto,
            user,
        );

        return result;
    }

    @Delete()
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.USER.destroy)
    @ApiQuery({ name: 'ids', type: [String] })
    async deletes(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.userService.deletes(_ids, user);
        return result;
    }
}
