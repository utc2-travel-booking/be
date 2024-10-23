import { Module } from '@nestjs/common';
import { EmbedService } from './embed.service';

@Module({
    imports: [],
    controllers: [],
    providers: [EmbedService],
    exports: [EmbedService],
})
export class EmbeddingModule {}
