import { Body, Controller, Get, Param, Put, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserPayload } from 'src/base/models/user-payload.model';
import { Authorize } from 'src/decorators/authorize.decorator';
import { PERMISSIONS } from 'src/constants';
import { UpdateMeDto } from 'src/apis/users/dto/update-me.dto';
import { UserService } from 'src/apis/users/user.service';
import { User } from 'aws-sdk/clients/appstream';
import { Types } from 'mongoose';
import {
    PagingDtoPipe,
    ExtendedPagingDto,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@ApiTags('Admin: User')
export class UserController {
    constructor(private readonly userService: UserService) {}

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
}
