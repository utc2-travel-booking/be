import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import _ from 'lodash';
import { subtle } from 'crypto';
import { Strategy } from 'passport-custom';
import { UserLoginTelegramProviderDto } from 'src/apis/auth/dto/user-login-telegram-provider.dto';
import { appSettings } from 'src/configs/appsettings';
import { UserService } from 'src/apis/users/user.service';
import { UserPayload } from 'src/base/models/user-payload.model';

@Injectable()
export class LoginTelegramStrategy extends PassportStrategy(
    Strategy,
    'login-telegram-provider',
) {
    constructor(private readonly userService: UserService) {
        super();
    }

    async validate(req: Request) {
        try {
            const body = req.body as Partial<UserLoginTelegramProviderDto>;
            const encoder = new TextEncoder();
            const { hash } = body;

            const checkString = await Object.keys(body)
                .filter((key) => key !== 'hash')
                .map((key) => `${key}=${body[key]}`)
                .sort()
                .join('\n');

            const tokenKey = await subtle.digest(
                'SHA-256',
                encoder.encode(appSettings.provider.telegram.botToken),
            );

            const secretKey = await subtle.importKey(
                'raw',
                tokenKey,
                { name: 'HMAC', hash: 'SHA-256' },
                true,
                ['sign'],
            );

            const signature = await subtle.sign(
                'HMAC',
                secretKey,
                encoder.encode(checkString),
            );

            const hex = [...new Uint8Array(signature)]
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('');

            if (hex !== hash) {
                throw new UnauthorizedException('Unauthorized');
            }

            const user = await this.userService.createUserTelegramProvider(
                body,
            );

            const { _id, role, name } = user;
            const userPayload: UserPayload = {
                _id,
                roleId: role._id,
                name,
            };

            return userPayload;
        } catch (error) {
            throw new UnauthorizedException('Unauthorized');
        }
    }
}
