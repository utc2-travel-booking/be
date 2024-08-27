import { Body, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserPayload } from 'src/base/models/user-payload.model';
import { COLLECTION_NAMES } from 'src/constants';
import { UpdateMeDto } from 'src/apis/users/dto/update-me.dto';
import { UserService } from 'src/apis/users/user.service';
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
import { ExtendedPost } from '@libs/super-core/decorators/extended-post.decorator';
import { ExtendedPut } from '@libs/super-core/decorators/extended-put.decorator';
import { ExtendedGet } from '@libs/super-core/decorators/extended-get.decorator';
import { ExtendedDelete } from '@libs/super-core/decorators/extended-delete.decorator';
import { SuperController } from '@libs/super-core';
import { SuperAuthorize } from '@libs/super-authorize/decorators/authorize.decorator';

@SuperController('users')
@ApiTags('Admin: User')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.USER,
})
export class UserControllerAdmin {
    constructor(private readonly userService: UserService) {}

    @ExtendedPut({ route: 'ban', dto: CreateUserDto })
    @SuperAuthorize()
    @ApiQuery({ name: 'ids', type: [String] })
    async ban(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.userService.ban(_ids, user);
        return result;
    }

    @ExtendedPut({ route: 'un-ban', dto: CreateUserDto })
    @SuperAuthorize()
    @ApiQuery({ name: 'ids', type: [String] })
    async unBan(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        const result = await this.userService.unBan(_ids, user);
        return result;
    }

    @ExtendedGet({ route: 'me' })
    @SuperAuthorize()
    async getMe(@Req() req: { user: UserPayload }) {
        const { user } = req;

        const result = await this.userService.getMe(user);
        return result;
    }

    @ExtendedPut({ route: 'me', dto: UpdateMeDto })
    @SuperAuthorize()
    async updateMe(
        @Body() updateMeDto: UpdateMeDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        return this.userService.updateMe(user, updateMeDto);
    }

    @ExtendedGet()
    @SuperAuthorize()
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.userService.getAll(queryParams);
        return result;
    }

    @ExtendedGet({ route: ':id' })
    @SuperAuthorize()
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.userService.getOne(_id);
        return result;
    }

    @ExtendedPost({
        dto: CreateUserDto,
    })
    @SuperAuthorize()
    async create(
        @Body() createRoleDto: CreateUserDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.userService.createOne(createRoleDto, user);
        return result;
    }

    @ExtendedPut({ route: ':id', dto: UpdateUserDto })
    @SuperAuthorize()
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

    @ExtendedDelete()
    @SuperAuthorize()
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
