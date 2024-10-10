import { PagesService } from './pages.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { Page, PageSchema } from './entities/pages.entity';
import { ExtendedMongooseModule } from '@libs/super-core/modules/mongoose/extended-mongoose.module';

@Module({
    imports: [
        ExtendedMongooseModule.forFeature([
            { name: COLLECTION_NAMES.PAGE, schema: PageSchema, entity: Page },
        ]),
    ],
    controllers: [],
    providers: [PagesService],
    exports: [PagesService],
})
export class PagesModule {}
