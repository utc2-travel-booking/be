import { MongooseModule } from '@nestjs/mongoose';
import { FormBuilderService } from './form-builders.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { FormBuilderSchema } from './entities/form-builders.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.FORM_BUILDER,
                schema: FormBuilderSchema,
            },
        ]),
    ],
    controllers: [],
    providers: [FormBuilderService],
    exports: [FormBuilderService],
})
export class ContactUsModule {}
