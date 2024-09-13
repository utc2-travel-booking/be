import { Module } from '@nestjs/common';
import { UserServiceDev } from './user.service.dev';

@Module({
    imports: [],
    controllers: [],
    providers: [UserServiceDev],
    exports: [UserServiceDev],
})
export class UserModuleDev {}
