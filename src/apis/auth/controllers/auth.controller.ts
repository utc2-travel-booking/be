import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { COLLECTION_NAMES } from 'src/constants';
import { AuthService } from '../auth.service';
import { LoginTelegramGuard } from 'src/guards/login-telegram.guard';
import { UserLoginTelegramProviderDto } from '../dto/user-login-telegram-provider.dto';
import { UserPayload } from 'src/base/models/user-payload.model';
import { DefaultPost } from 'src/base/controllers/base.controller';

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
    @UseGuards(LoginTelegramGuard)
    async loginTelegramProvider(
        @Body() userLoginTelegramProviderDto: UserLoginTelegramProviderDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        return this.authService.login(user);
    }
}
