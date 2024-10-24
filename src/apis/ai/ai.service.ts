import { Injectable } from '@nestjs/common';
import { EmbedService } from 'src/packages/embedding/embed.service';
import { QdrantService } from 'src/packages/qdrant/qdrant.service';
import { TypeInputEmbed } from './constant';

@Injectable()
export class AIService {
    constructor(
        private readonly embedService: EmbedService,
        private readonly qdrantService: QdrantService,
    ) {}

    async embedding(text: string, type: TypeInputEmbed) {
        return await this.embedService.getEmbedding(text, type);
    }

    async add(vector: number[], payload: any) {
        return this.qdrantService.addData(vector, payload);
    }
}
