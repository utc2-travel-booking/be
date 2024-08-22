import { DataTransferObjectsController } from './data-transfer-objects.controller';
import { DataTransferObjectsService } from './data-transfer-objects.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [DataTransferObjectsController],
    providers: [DataTransferObjectsService],
    exports: [DataTransferObjectsService],
})
export class DataTransferObjectsModule {}
