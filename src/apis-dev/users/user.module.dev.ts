import { Module } from '@nestjs/common';
import { UserServiceDev } from './user.service.dev';
import { SuperCacheModule } from '@libs/super-cache/super-cache.module';

@Module({
    imports: [SuperCacheModule],
    controllers: [],
    providers: [UserServiceDev],
    exports: [UserServiceDev],
})
export class UserModuleDev {}
