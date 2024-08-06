import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { COLLECTION_NAMES } from 'src/constants';
import { AuthService } from '../auth.service';
import { LoginTelegramProviderGuard } from 'src/guards/login-telegram-provider.guard';
import { UserLoginTelegramDto } from '../dto/user-login-telegram.dto';
import { UserPayload } from 'src/base/models/user-payload.model';
import { DefaultPost } from 'src/base/controllers/base.controller';
import { LoginTelegramMiniAppGuard } from 'src/guards/login-telegram-mini-app.guard';

@Controller()
@ApiTags('Front: Auth')
@AuditLog({
    events: [
        AUDIT_EVENT.GET,
        AUDIT_EVENT.POST,
        AUDIT_EVENT.PUT,
        AUDIT_EVENT.DELETE,
    ],
    refSource: COLLECTION_NAMES.NONCE,
})
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @DefaultPost('login-telegram-provider')
    @UseGuards(LoginTelegramProviderGuard)
    async loginTelegramProvider(
        @Body() userLoginTelegramDto: UserLoginTelegramDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        return this.authService.login(user);
    }

    @Post('login-telegram-mini-app')
    @UseGuards(LoginTelegramMiniAppGuard)
    @ApiHeader({
        name: 'authorization',
        description: 'tma {token}',
    })
    async loginTelegramMiniApp(@Req() req: { user: UserPayload }) {
        const { user } = req;
        return this.authService.login(user);
    }
}
