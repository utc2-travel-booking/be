import { MongooseModule } from '@nestjs/mongoose';
import { AppsService } from './apps.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { AppSchema } from './entities/apps.entity';
import { AppEvent } from './event-handlers/apps.event';
import { UserAppHistoriesModule } from '../user-app-histories/user-app-histories.module';
import { UserModule } from '../users/user.module';
import { TagAppsModule } from '../tag-apps/tag-apps.module';
import { TagsModule } from '../tags/tags.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.APP, schema: AppSchema },
        ]),
        UserAppHistoriesModule,
        UserModule,
        TagAppsModule,
        TagsModule,
    ],
    controllers: [],
    providers: [AppsService, AppEvent],
    exports: [AppsService],
})
export class AppsModule {}
