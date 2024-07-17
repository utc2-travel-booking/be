import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesService } from './categories.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { CategorySchema } from './entities/categories.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.CATEGORIES, schema: CategorySchema },
        ]),
    ],
    controllers: [],
    providers: [CategoriesService],
    exports: [CategoriesService],
})
export class CategoriesModule {}
