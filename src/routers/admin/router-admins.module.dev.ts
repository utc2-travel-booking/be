import { Module } from '@nestjs/common';
import { UserControllerAdminDev } from 'src/apis-dev/users/user.controller.admin.dev';
import { UserModuleDev } from 'src/apis-dev/users/user.module.dev';

@Module({
    imports: [UserModuleDev],
    controllers: [UserControllerAdminDev],
    providers: [],
})
export class RouterAdminsModuleDev {}
