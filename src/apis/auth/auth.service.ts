import { Injectable } from '@nestjs/common';
import { UserPayload } from 'src/base/models/user-payload.model';
import { JwtService } from '@nestjs/jwt';
import { appSettings } from 'src/configs/app-settings';
import { MissionService } from '../mission/mission.service';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly missionService: MissionService,
        private readonly userService: UserService,
    ) {}

    async login(user: UserPayload) {
        const tokens = await this.getTokens(user);
        const { telegramUserId } = await this.userService.getMe(user);
        if (telegramUserId) {
            await this.missionService.updateMissionProcess(
                [appSettings.mission.missionId.dailyLoginId],
                telegramUserId.toString(),
            );
        }

        return tokens;
    }

    private async getTokens(user: UserPayload) {
        const { _id } = user;

        const refreshToken = await this.jwtService.signAsync(
            { _id },
            {
                expiresIn: appSettings.jwt.refreshExpireIn,
                secret: appSettings.jwt.refreshSecret,
            },
        );

        const accessToken = await this.jwtService.signAsync(user);

        return {
            accessToken,
            refreshToken,
        };
    }
}
