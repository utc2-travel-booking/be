import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/base/service/base.service';
import { User, UserDocument } from './entities/user.entity';
import { Types } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { UserPayload } from 'src/base/models/user-payload.model';
import { UpdateMeDto } from './dto/update-me.dto';
import { RolesService } from '../roles/roles.service';
import { RoleType } from '../roles/entities/roles.entity';
import _ from 'lodash';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService extends BaseService<UserDocument, User> {
    constructor(
        @InjectModel(COLLECTION_NAMES.USER)
        private readonly userModel: Model<UserDocument>,
        private readonly roleService: RolesService,
    ) {
        super(userModel, User);
    }

    async validateUserSignature(signature: string, publicKey: string) {
        const user = await this.findOne({ walletAddress: publicKey });

        if (!user) {
            const rootRole = await this.roleService.findOne({
                type: RoleType.USER,
            });
            const newUser = new this.userModel({
                walletAddress: publicKey,
                role: _.get(rootRole, '_id'),
            });

            await this.create(newUser);

            return newUser;
        }

        return user;
    }

    async validateUserLocal(email: string, password: string) {
        if (!email || !password) {
            throw new UnprocessableEntityException(
                'email_password_incorrectly',
                'Email or password incorrectly',
            );
        }

        const user = await this.findOne({ email });

        const isMatch =
            user &&
            user.password &&
            (await bcrypt.compare(password, user.password));

        if (isMatch) {
            return user;
        }

        throw new UnprocessableEntityException(
            'email_password_incorrectly',
            'Email or password incorrectly',
        );
    }

    async updateMe(user: UserPayload, updateMeDto: UpdateMeDto) {
        await this.updateOne(
            { _id: user._id },
            {
                ...updateMeDto,
            },
        );

        const result = await this.getMe(user);
        return result;
    }

    async getMe(user: UserPayload) {
        return await this.findOne({ _id: user._id }, '-password');
    }
}
