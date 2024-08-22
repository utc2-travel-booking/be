import { Module } from '@nestjs/common';
import { EntitiesModule } from './modules/entities/entities.module';
import { DataTransferObjectsModule } from './modules/data-transfer-objects/data-transfer-objects.module';

@Module({
    imports: [EntitiesModule, DataTransferObjectsModule],
    controllers: [],
    providers: [],
})
export class SuperCoreModule {}
