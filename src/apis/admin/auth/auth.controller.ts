import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../auth/auth.service';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { UserLoginDto } from '../../auth/dto/user-login.dto';
import { UserPayload } from 'src/base/models/user-payload.model';

@Controller()
@ApiTags('Admin: Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiBody({
        description: 'User credentials',
        type: UserLoginDto,
    })
    async login(@Req() req: { user: UserPayload }) {
        const { user } = req;

        if (!user) {
            return undefined;
        }
        return await this.authService.login(user);
    }
}
