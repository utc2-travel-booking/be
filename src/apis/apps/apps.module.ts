import { MongooseModule } from '@nestjs/mongoose';
import { AppsService } from './apps.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { AppSchema } from './entities/apps.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.APP, schema: AppSchema },
        ]),
    ],
    controllers: [],
    providers: [AppsService],
    exports: [AppsService],
})
export class AppsModule {}
