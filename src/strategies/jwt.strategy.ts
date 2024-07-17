import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { RolesService } from 'src/apis/roles/roles.service';
import { UserPayload } from 'src/base/models/user-payload.model';
import { Types } from 'mongoose';
import _ from 'lodash';
import { appSettings } from 'src/configs/appsettings';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly rolesService: RolesService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: appSettings.jwt.secret,
            issuer: appSettings.jwt.issuer,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, userPayload: UserPayload, done: any) {
        const { roleId } = userPayload;
        const permissions = await this.rolesService.findPermissionsByRole(
            roleId,
        );

        return {
            ...userPayload,
            _id: new Types.ObjectId(_.get(userPayload, '_id')),
            permissions,
        };
    }
}
