import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserPayload } from 'src/base/models/user-payload.model';
import { UpdateMeDto } from './dto/update-me.dto';
import { Authorize } from 'src/decorators/authorize.decorator';
import { PERMISSIONS_FRONT } from 'src/constants';

@Controller('users')
@ApiTags('Front: User')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('me')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS_FRONT.USER.index)
    async getMe(@Req() req: { user: UserPayload }) {
        const { user } = req;

        const result = await this.userService.getMe(user);
        return result;
    }

    @Put('me')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS_FRONT.USER.edit)
    async updateMe(
        @Body() updateMeDto: UpdateMeDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        return this.userService.updateMe(user, updateMeDto);
    }
}
