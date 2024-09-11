import { MongooseModule } from '@nestjs/mongoose';
import { PagesService } from './pages.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { PagesSchema } from './entities/pages.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.PAGE, schema: PagesSchema },
        ]),
    ],
    controllers: [],
    providers: [PagesService],
    exports: [PagesService],
})
export class PagesModule {}
