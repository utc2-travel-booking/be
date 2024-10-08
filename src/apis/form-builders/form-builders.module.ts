import { FormBuilderService } from './form-builders.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import {
    FormBuilder,
    FormBuilderSchema,
} from './entities/form-builders.entity';
import { ExtendedMongooseModule } from '@libs/super-core/modules/mongoose/extended-mongoose.module';

@Module({
    imports: [
        ExtendedMongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.FORM_BUILDER,
                schema: FormBuilderSchema,
                entity: FormBuilder,
            },
        ]),
    ],
    controllers: [],
    providers: [FormBuilderService],
    exports: [FormBuilderService],
})
export class FormBuilderModule {}
