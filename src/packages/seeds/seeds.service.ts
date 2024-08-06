import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PermissionsService } from 'src/apis/permissions/permissions.service';
import { RolesService } from 'src/apis/roles/roles.service';
import fs from 'fs';
import { Types } from 'mongoose';
import { UserService } from 'src/apis/users/user.service';
import { appSettings } from 'src/configs/appsettings';
import { MetadataType } from 'src/apis/metadata/constants';
import { MetadataService } from 'src/apis/metadata/metadata.service';

@Injectable()
export class SeedsService implements OnModuleInit {
    public readonly logger = new Logger(SeedsService.name);
    constructor(
        private readonly permissionService: PermissionsService,
        private readonly roleService: RolesService,
        private readonly userService: UserService,
        private readonly metadataService: MetadataService,
    ) {}

    async onModuleInit() {
        if (!appSettings.development) {
            return;
        }

        await this.seedPermissions();
        await this.seedRoles();
        await this.seedUsers();
        this.logger.debug('Seeding completed');
    }

    async seedPermissions() {
        const permissions = JSON.parse(
            fs.readFileSync(
                process.cwd() + '/public/data/permissions.json',
                'utf8',
            ),
        );

        this.logger.debug('Seeding permissions');
        await this.permissionService.deleteMany({});

        const result = permissions.map((permission) => {
            delete permission.createdAt;
            delete permission.updatedAt;
            return {
                ...permission,
                _id: new Types.ObjectId(permission._id.$oid),
            };
        });

        await this.permissionService.insertMany(result);
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
}
