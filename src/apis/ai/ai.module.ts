import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { EmbeddingModule } from 'src/packages/embedding/embed.module';
import { EmbedService } from 'src/packages/embedding/embed.service';

@Module({
    imports: [EmbeddingModule],
    controllers: [],
    providers: [AIService, EmbedService],
    exports: [AIService],
})
export class AIModule {}
