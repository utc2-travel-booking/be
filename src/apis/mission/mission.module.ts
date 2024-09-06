import { Module } from "@nestjs/common";
import { MissionService } from "./mission.service";
import { UserModule } from "../users/user.module";
import { UserAppHistoriesModule } from "../user-app-histories/user-app-histories.module";
import { AppsModule } from "../apps/apps.module";

@Module({
    imports: [
        UserModule,
        UserAppHistoriesModule,
        AppsModule
    ],
    controllers: [],
    providers: [MissionService],
    exports: [MissionService]
})
export class MissionModule { }