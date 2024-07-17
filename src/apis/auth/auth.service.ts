import { BadRequestException, Injectable } from '@nestjs/common';
import { UserPayload } from 'src/base/models/user-payload.model';
import { JwtService } from '@nestjs/jwt';
import { appSettings } from 'src/configs/appsettings';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async login(user: UserPayload) {
        const tokens = await this.getTokens(user);
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
