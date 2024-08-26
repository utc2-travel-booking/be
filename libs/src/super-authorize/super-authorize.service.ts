import { Inject, Injectable } from '@nestjs/common';
import { PermissionsService } from './modules/permissions/permissions.service';

@Injectable()
export class SuperAuthorizeService {
    constructor(
        @Inject('PREFIXES') private readonly prefix: string,
        private readonly permissionsService: PermissionsService,
    ) {}
}
