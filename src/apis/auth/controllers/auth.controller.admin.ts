import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserPayload } from 'src/base/models/user-payload.model';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { COLLECTION_NAMES } from 'src/constants';
import { DefaultPost } from 'src/base/controllers/base.controller';

@Controller()
@ApiTags('Admin: Auth')
@AuditLog({
    events: [
        AUDIT_EVENT.GET,
        AUDIT_EVENT.POST,
        AUDIT_EVENT.PUT,
        AUDIT_EVENT.DELETE,
    ],
    refSource: COLLECTION_NAMES.NONCE,
})
export class AuthControllerAdmin {
    constructor(private readonly authService: AuthService) {}

    @DefaultPost('login')
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
