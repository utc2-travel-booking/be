import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserPayload } from 'src/base/models/user-payload.model';
import { Types } from 'mongoose';
import _ from 'lodash';
import { SuperCacheService } from '@libs/super-cache/super-cache.service';
import { UserCacheKey } from 'src/apis/users/constants';
import { SuperAuthorizeOptions } from '../super-authorize.module';
import { RolesService } from '../modules/roles/roles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly rolesService: RolesService,
        private readonly superCacheService: SuperCacheService,
        @Inject('SUPER_AUTHORIZE_OPTIONS')
        private readonly superAuthorizeOptions: SuperAuthorizeOptions,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: superAuthorizeOptions.jwt.secret,
            issuer: superAuthorizeOptions.jwt.issuer,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, userPayload: UserPayload) {
        const { roleId, _id } = userPayload;

        const [permissions, usersBannedInCache] = await Promise.all([
            this.rolesService.findPermissionsByRole(roleId),
            this.superCacheService.get<{
                items: any[];
            }>(UserCacheKey.USER_BANNED),
        ]);

        if (usersBannedInCache?.items.some((item) => item === _id)) {
            throw new UnauthorizedException('User is banned');
        }

        return {
            ...userPayload,
            _id: new Types.ObjectId(_.get(userPayload, '_id')),
            permissions,
        };
    }
}
