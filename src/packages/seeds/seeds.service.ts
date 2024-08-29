import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import fs from 'fs';
import { Types } from 'mongoose';
import { UserService } from 'src/apis/users/user.service';
import { appSettings } from 'src/configs/appsettings';
import { MetadataService } from 'src/apis/metadata/metadata.service';
import { RolesService } from '@libs/super-authorize/modules/roles/roles.service';

@Injectable()
export class SeedsService implements OnModuleInit {
    public readonly logger = new Logger(SeedsService.name);
    constructor(
        private readonly roleService: RolesService,
        private readonly userService: UserService,
        private readonly metadataService: MetadataService,
    ) {}

    async onModuleInit() {
        if (!appSettings.development) {
            return;
        }

        await this.seedRoles();
        await this.seedUsers();
        // await this.seedMetadata();
        this.logger.debug('Seeding completed');
    }

    async seedRoles() {
        const roles = JSON.parse(
            fs.readFileSync(process.cwd() + '/public/data/roles.json', 'utf8'),
        );

        this.logger.debug('Seeding roles');
        await this.roleService.deleteMany({});

        for (const role of roles) {
            delete role.createdAt;
            delete role.updatedAt;
            await this.roleService.create({
                ...role,
                _id: new Types.ObjectId(role._id.$oid),
                permissions: role.permissions.map(
                    (p) => new Types.ObjectId(p.$oid),
                ),
            });
        }
    }

    async seedUsers() {
        const users = JSON.parse(
            fs.readFileSync(process.cwd() + '/public/data/users.json', 'utf8'),
        );

        this.logger.debug('Seeding users');

        if (appSettings.development) {
            await this.userService.updateMany({}, { deletedAt: null });
        }

        for (const user of users) {
            const { _id } = user;
            delete user.createdAt;
            delete user.updatedAt;
            const exit = await this.userService.findById(_id.$oid).exec();

            if (!exit) {
                await this.userService.create({
                    ...user,
                    _id: new Types.ObjectId(_id.$oid),
                    role: new Types.ObjectId(user.role.$oid),
                });
            }
        }
    }

    async seedMetadata() {
        const metadata = JSON.parse(
            fs.readFileSync(
                process.cwd() + '/public/data/metadata.json',
                'utf8',
            ),
        );

        this.logger.debug('Seeding metadata');
        await this.metadataService.deleteMany({});

        const result = metadata.map((item) => {
            delete item.createdAt;
            delete item.updatedAt;
            return {
                ...item,
                _id: new Types.ObjectId(item._id.$oid),
            };
        });

        await this.metadataService.insertMany(result);
    }
}
