import { AdvertisersService } from './advertisers.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { Advertiser, AdvertiserSchema } from './entities/advertisers.entity';
import { ExtendedMongooseModule } from '@libs/super-core/modules/mongoose/extended-mongoose.module';

@Module({
    imports: [
        ExtendedMongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.ADVERTISER,
                schema: AdvertiserSchema,
                entity: Advertiser,
            },
        ]),
    ],
    controllers: [],
    providers: [AdvertisersService],
    exports: [AdvertisersService],
})
export class AdvertisersModule {}
