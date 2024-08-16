import { MongooseModule } from '@nestjs/mongoose';
import { ContactUsService } from './contact-us.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { ContactUsSchema } from './entities/contact-us.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.CONTACT_US,
                schema: ContactUsSchema,
            },
        ]),
    ],
    controllers: [],
    providers: [ContactUsService],
    exports: [ContactUsService],
})
export class ContactUsModule {}
