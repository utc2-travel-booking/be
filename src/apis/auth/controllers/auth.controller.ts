import { Body, Req, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { COLLECTION_NAMES } from 'src/constants';
import { AuthService } from '../auth.service';
import { LoginTelegramProviderGuard } from 'src/guards/login-telegram-provider.guard';
import { UserLoginTelegramDto } from '../dto/user-login-telegram.dto';
import { UserPayload } from 'src/base/models/user-payload.model';
import { LoginTelegramMiniAppGuard } from 'src/guards/login-telegram-mini-app.guard';
import { ExtendedPost } from '@libs/super-core/decorators/extended-post.decorator';
import { SuperController } from '@libs/super-core';

@SuperController()
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

    @ExtendedPost({
        route: 'login-telegram-provider',
        dto: UserLoginTelegramDto,
    })
    @UseGuards(LoginTelegramProviderGuard)
    async loginTelegramProvider(
        @Body() userLoginTelegramDto: UserLoginTelegramDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        return this.authService.login(user);
    }

    @ExtendedPost({ route: 'login-telegram-mini-app' })
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
