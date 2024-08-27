import { Body, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserPayload } from 'src/base/models/user-payload.model';
import { COLLECTION_NAMES } from 'src/constants';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { UpdateMeDto } from '../dto/update-me.dto';
import { UserService } from '../user.service';
import { MetadataType } from 'src/apis/metadata/constants';
import { SuperPut } from '@libs/super-core/decorators/super-put.decorator';
import { SuperGet } from '@libs/super-core/decorators/super-get.decorator';
import { SuperController } from '@libs/super-core';
import { SuperAuthorize } from '@libs/super-authorize/decorators/authorize.decorator';

@SuperController('users')
@ApiTags('Front: User')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.FILE,
})
export class UserController {
    constructor(private readonly userService: UserService) {}

    @SuperGet({ route: 'me' })
    @SuperAuthorize()
    async getMe(@Req() req: { user: UserPayload }) {
        const { user } = req;

        const result = await this.userService.getMeForFront(user);
        return result;
    }

    @SuperPut({ route: 'me', dto: UpdateMeDto })
    @SuperAuthorize()
    async updateMe(
        @Body() updateMeDto: UpdateMeDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        return this.userService.updateMe(user, updateMeDto);
    }

    @SuperGet({ route: 'history-reward/:type' })
    @SuperAuthorize()
    async getHistoryReward(
        @Param('type') type: MetadataType,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        return this.userService.getHistoryReward(user, type);
    }
}
