import { CategoriesService } from './categories.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { Category, CategorySchema } from './entities/categories.entity';
import { ExtendedMongooseModule } from '@libs/super-core/modules/mongoose/extended-mongoose.module';

@Module({
    imports: [
        ExtendedMongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.CATEGORIES,
                schema: CategorySchema,
                entity: Category,
            },
        ]),
    ],
    controllers: [],
    providers: [CategoriesService],
    exports: [CategoriesService],
})
export class CategoriesModule {}
