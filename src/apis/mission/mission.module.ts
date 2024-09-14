import { forwardRef, Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { UserModule } from '../users/user.module';
import { UserAppHistoriesModule } from '../user-app-histories/user-app-histories.module';
import { AppsModule } from '../apps/apps.module';
import { UserTransactionModule } from '../user-transaction/user-transaction.module';
import { WebsocketModule } from 'src/packages/websocket/websocket.module';

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => AppsModule),
        UserAppHistoriesModule,
        WebsocketModule,
        UserTransactionModule,
    ],
    controllers: [],
    providers: [MissionService],
    exports: [MissionService],
})
export class MissionModule {}
