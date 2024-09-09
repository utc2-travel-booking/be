import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import _ from 'lodash';
import { subtle } from 'crypto';
import { Strategy } from 'passport-custom';
import { UserService } from 'src/apis/users/user.service';
import { UserPayload } from 'src/base/models/user-payload.model';
import { UserLoginTelegramDto } from 'src/apis/auth/dto/user-login-telegram.dto';
import { TelegramBotService } from 'src/apis/telegram-bot/telegram-bot.service';
import { Request } from 'express';
import { Types } from 'mongoose';

@Injectable()
export class LoginTelegramProviderStrategy extends PassportStrategy(
    Strategy,
    'login-telegram-provider',
) {
    constructor(
        private readonly userService: UserService,
        private readonly telegramBotService: TelegramBotService,
    ) {
        super();
    }

    async validate(req: Request): Promise<any> {
        try {
            const domain = req.get('origin');
            const bot = await this.telegramBotService.findByDomain(domain);
            const { token } = bot || {};
            const body = req.body as Partial<UserLoginTelegramDto>;
            const encoder = new TextEncoder();
            const { hash } = body;

            const checkString = Object.keys(body)
                .filter((key) => key !== 'hash')
                .map((key) => `${key}=${body[key]}`)
                .sort()
                .join('\n');

            const tokenKey = await subtle.digest(
                'SHA-256',
                encoder.encode(token),
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

            const user = await this.userService.createUserTelegram(body);

            const { _id, role, name } = user;
            const userPayload: UserPayload = {
                _id,
                roleId: new Types.ObjectId(role._id),
                name,
            };

            return userPayload;
        } catch (error) {
            throw new UnauthorizedException('Unauthorized');
        }
    }
}
