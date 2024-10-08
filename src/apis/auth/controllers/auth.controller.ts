import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { COLLECTION_NAMES } from 'src/constants';
import { AuthService } from '../auth.service';
import { Resource } from '@libs/super-authorize';

@Controller()
@Resource()
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
}
