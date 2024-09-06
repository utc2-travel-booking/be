import { PERMISSION, Resource, SuperAuthorize } from "@libs/super-authorize";
import { Controller, Param, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { MissionService } from "../mission.service";
import { SuperGet, SuperPost, SuperPut } from "@libs/super-core";
import { UserPayload } from "src/base/models/user-payload.model";
import { ParseObjectIdPipe } from "src/pipes/parse-object-id.pipe";
import { Types } from "mongoose";

@Controller('mission')
@Resource('mission')
@ApiTags('Front: Mission')
export class MissionController {
    constructor(private readonly missionService: MissionService) { }

    @SuperGet()
    @ApiBearerAuth()
    @SuperAuthorize(PERMISSION.GET)
    async getMission(
        @Req() req: { user: UserPayload }
    ) {
        return await this.missionService.getMission();
    }

    @SuperPut({ route: 'verify-app/:id' })
    @SuperAuthorize(PERMISSION.PUT)
    @ApiParam({ name: 'id', type: String })
    async addPointForUser(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        const result = await this.missionService.verifyOpenApp(_id, user);
        return result;
    }

}
