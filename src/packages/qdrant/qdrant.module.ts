import { HttpModule } from '@nestjs/axios';
import { QdrantService } from './qdrant.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [QdrantService],
    exports: [QdrantService],
})
export class QdrantModule {}
