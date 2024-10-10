import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as _ from 'lodash';
import { Strategy } from 'passport-local';
import { UserService } from 'src/apis/users/user.service';
import { UserPayload } from 'src/base/models/user-payload.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }
    async validate(email: string, password: string) {
        const user = await this.userService.validateUserLocal(email, password);

        if (!user) {
            return undefined;
        }

        const result: UserPayload = {
            _id: _.get(user, '_id'),
            name: _.get(user, 'name'),
            email: _.get(user, 'email'),
            roleId: _.get(user, 'role._id'),
        };
        return result;
    }
}
