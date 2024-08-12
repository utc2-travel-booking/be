import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import _ from 'lodash';
import { Strategy } from 'passport-custom';
import { appSettings } from 'src/configs/appsettings';
import { UserPayload } from 'src/base/models/user-payload.model';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

@Injectable()
export class UserPayloadExtractorStrategy extends PassportStrategy(
    Strategy,
    'user-payload-extractor',
) {
    constructor(private readonly jwtService: JwtService) {
        super();
    }

    async validate(req: Request): Promise<any> {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            try {
                const payload: UserPayload = this.jwtService.verify(token, {
                    secret: appSettings.jwt.secret,
                    issuer: appSettings.jwt.issuer,
                });
                return { ...payload, _id: new Types.ObjectId(payload?._id) };
            } catch (error) {}
        }

        return true;
    }
}
