import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { validate, parse } from '@tma.js/init-data-node';
import _ from 'lodash';
import { UserService } from 'src/apis/users/user.service';
import { UserPayload } from 'src/base/models/user-payload.model';
import { appSettings } from 'src/configs/appsettings';
import { UserLoginTelegramDto } from 'src/apis/auth/dto/user-login-telegram.dto';

@Injectable()
export class LoginTelegramMiniAppStrategy extends PassportStrategy(
    Strategy,
    'login-telegram-mini-app',
) {
    constructor(private readonly userService: UserService) {
        super();
    }

    async validate(req: Request): Promise<any> {
        const [authType, authData = ''] = (
            req.header('authorization') || ''
        ).split(' ');

        if (authType !== 'tma') {
            throw new UnauthorizedException();
        }

        try {
            const token = appSettings.provider.telegram.botToken;
            validate(authData, token, {});

            const initData = parse(authData);
            const { user } = initData;

            const userLoginTelegramDto = {
                ...user,
            } as UserLoginTelegramDto;

            const createUserTelegram =
                await this.userService.createUserTelegram(userLoginTelegramDto);

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
