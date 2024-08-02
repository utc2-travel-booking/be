import { MongooseModule } from '@nestjs/mongoose';
import { AdvertisersService } from './advertisers.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { AdvertiserSchema } from './entities/advertisers.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.ADVERTISER, schema: AdvertiserSchema },
        ]),
    ],
    controllers: [],
    providers: [AdvertisersService],
    exports: [AdvertisersService],
})
export class AdvertisersModule {}
