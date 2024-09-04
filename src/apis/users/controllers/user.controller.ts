import { Body, Controller, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserPayload } from 'src/base/models/user-payload.model';
import { Authorize } from 'src/decorators/authorize.decorator';
import { COLLECTION_NAMES, PERMISSIONS_FRONT } from 'src/constants';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { UpdateMeDto } from '../dto/update-me.dto';
import { UserService } from '../user.service';

import { MetadataType } from 'src/apis/metadata/constants';
import { ExtendedPut } from '@libs/super-core/decorators/extended-put.decorator';
import { ExtendedGet } from '@libs/super-core/decorators/extended-get.decorator';
import { ExtendedPost } from '@libs/super-core/decorators/extended-post.decorator';

@Controller('users')
@ApiTags('Front: User')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.FILE,
})
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ExtendedGet({ route: 'me' })
    @Authorize(PERMISSIONS_FRONT.USER.index)
    async getMe(@Req() req: { user: UserPayload }) {
        const { user } = req;

        const result = await this.userService.getMeForFront(user);
        return result;
    }

    @ExtendedPut({ route: 'me', dto: UpdateMeDto })
    @Authorize(PERMISSIONS_FRONT.USER.edit)
    async updateMe(
        @Body() updateMeDto: UpdateMeDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        return this.userService.updateMe(user, updateMeDto);
    }

    @ExtendedGet({ route: 'history-reward/:type' })
    @Authorize(PERMISSIONS_FRONT.USER.index)
    async getHistoryReward(
        @Param('type') type: MetadataType,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        return this.userService.getHistoryReward(user, type);
    }

    @ExtendedPost({ route: 'referral/:inviteCode' })
    @Authorize(PERMISSIONS_FRONT.USER_REFERRAL.create)
    async createReferral(
        @Param('inviteCode') inviteCode: string,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        return this.userService.createReferral(inviteCode, user);
    }
}
