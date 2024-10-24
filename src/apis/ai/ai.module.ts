import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { EmbeddingModule } from 'src/packages/embedding/embed.module';
import { EmbedService } from 'src/packages/embedding/embed.service';
import { QdrantService } from 'src/packages/qdrant/qdrant.service';
import { QdrantModule } from 'src/packages/qdrant/qdrant.module';

@Module({
    imports: [EmbeddingModule, QdrantModule],
    controllers: [],
    providers: [AIService, EmbedService, QdrantService],
    exports: [AIService],
})
export class AIModule {}
