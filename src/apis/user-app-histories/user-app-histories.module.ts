import { MongooseModule } from '@nestjs/mongoose';
import { UserAppHistoriesService } from './user-app-histories.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { UserAppHistorySchema } from './entities/user-app-histories.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.USER_APP_HISTORY,
                schema: UserAppHistorySchema,
            },
        ]),
    ],
    controllers: [],
    providers: [UserAppHistoriesService],
    exports: [UserAppHistoriesService],
})
export class UserAppHistoriesModule {}
