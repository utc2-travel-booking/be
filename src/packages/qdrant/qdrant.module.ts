import { QdrantService } from './qdrant.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [],
    providers: [QdrantService],
    exports: [QdrantService],
})
export class QdrantModule {}
