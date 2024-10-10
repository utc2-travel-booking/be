import { Injectable } from '@nestjs/common';
import { UserPayload } from 'src/base/models/user-payload.model';
import { JwtService } from '@nestjs/jwt';
import { appSettings } from 'src/configs/app-settings';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async login(user: UserPayload) {
        const tokens = this.getTokens(user);
        return tokens;
    }

    private async getTokens(user: UserPayload) {
        const { _id } = user;

        const [refreshToken, accessToken] = await Promise.all([
            this.jwtService.signAsync(
                { _id },
                {
                    expiresIn: appSettings.jwt.refreshExpireIn,
                    secret: appSettings.jwt.refreshSecret,
                },
            ),
            this.jwtService.signAsync(user),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}
