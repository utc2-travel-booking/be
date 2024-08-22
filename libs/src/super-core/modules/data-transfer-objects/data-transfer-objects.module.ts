import { DataTransferObjectsService } from './data-transfer-objects.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [],
    providers: [DataTransferObjectsService],
    exports: [DataTransferObjectsService],
})
export class DataTransferObjectsModule {}
