import { Body, Controller, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { COLLECTION_NAMES } from 'src/constants';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { Resource } from '@libs/super-authorize';
import { SuperPost } from '@libs/super-core';
import { CreateUserReferralDto } from '../dto/create-referral.dto';
import { UserReferralsService } from '../user-referrals.service';

@Controller('user-referral')
@Resource('user-referral')
@ApiTags('Front: User Referrals')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.FILE,
})
export class UserReferralController {
    constructor(private readonly userReferralService: UserReferralsService) {}

    @SuperPost()
    async createReferral(@Body() Referral: CreateUserReferralDto) {
        return this.userReferralService.createReferral(Referral);
    }
}
