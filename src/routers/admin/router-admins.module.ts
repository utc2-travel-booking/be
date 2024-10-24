import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from 'src/apis/auth/auth.module';
import { AuthControllerAdmin } from 'src/apis/auth/controllers/auth.controller.admin';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [ScheduleModule.forRoot(), CommonModule, AuthModule],
    controllers: [AuthControllerAdmin],
    providers: [],
})
export class RouterAdminsModule {}
