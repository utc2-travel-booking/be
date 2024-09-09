import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { validate, parse } from '@tma.js/init-data-node';
import _ from 'lodash';
import { UserService } from 'src/apis/users/user.service';
import { UserPayload } from 'src/base/models/user-payload.model';
import { UserLoginTelegramDto } from 'src/apis/auth/dto/user-login-telegram.dto';
import { TelegramBotService } from 'src/apis/telegram-bot/telegram-bot.service';

@Injectable()
export class LoginTelegramMiniAppStrategy extends PassportStrategy(
    Strategy,
    'login-telegram-mini-app',
) {
    constructor(
        private readonly userService: UserService,
        private readonly telegramBotService: TelegramBotService,
    ) {
        super();
    }

    async validate(req: Request): Promise<any> {
        const inviteCode = req.header('code') || '';

        const [authType, authData = ''] = (
            req.header('authorization') || ''
        ).split(' ');

        if (authType !== 'tma') {
            throw new UnauthorizedException();
        }
        try {
            const domain = req.get('origin');
            const bot = await this.telegramBotService.findByDomain(domain);
            const { token } = bot || {};
            validate(authData, token, {});
            const initData = parse(authData);
            const { user } = initData;
            const {
                username,
                id,
                firstName: first_name,
                lastName: last_name,
                photoUrl: photo_url,
            } = user;
            const userLoginTelegramDto = {
                username,
                id,
                first_name,
                last_name,
                photo_url,
            } as UserLoginTelegramDto;
            const createUserTelegram =
                await this.userService.createUserTelegram(
                    userLoginTelegramDto,
                    inviteCode,
                );
            const { _id, role, name } = createUserTelegram;
            const userPayload: UserPayload = {
                _id,
                roleId: role._id,
                name,
            };
            return userPayload;
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
}
