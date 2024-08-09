import { Body, Controller, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
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
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
    DefaultDelete,
    DefaultGet,
    DefaultPost,
    DefaultPut,
} from 'src/base/controllers/base.controller';

@Controller('users')
@ApiTags('Admin: User')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.USER,
})
export class UserControllerAdmin {
    constructor(private readonly userService: UserService) {}

    @DefaultPut('ban')
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

    @DefaultPut('un-ban')
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

    @DefaultGet('me')
    @Authorize(PERMISSIONS.USER.index)
    async getMe(@Req() req: { user: UserPayload }) {
        const { user } = req;

        const result = await this.userService.getMe(user);
        return result;
    }

    @DefaultPut('me')
    @Authorize(PERMISSIONS.USER.edit)
    async updateMe(
        @Body() updateMeDto: UpdateMeDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        return this.userService.updateMe(user, updateMeDto);
    }

    @DefaultGet('')
    @Authorize(PERMISSIONS.USER.index)
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.userService.getAll(queryParams);
        return result;
    }

    @DefaultGet(':id')
    @Authorize(PERMISSIONS.USER.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.userService.getOne(_id);
        return result;
    }

    @DefaultPost()
    @Authorize(PERMISSIONS.USER.create)
    async create(
        @Body() createRoleDto: CreateUserDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.userService.createOne(createRoleDto, user);
        return result;
    }

    @DefaultPut(':id')
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

    @DefaultDelete()
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
