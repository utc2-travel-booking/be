import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserPayload } from 'src/base/models/user-payload.model';
import { Authorize } from 'src/decorators/authorize.decorator';
import { PERMISSIONS } from 'src/constants';
import { UpdateMeDto } from 'src/apis/users/dto/update-me.dto';
import { UserService } from 'src/apis/users/user.service';

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
}
