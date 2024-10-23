import { Injectable } from '@nestjs/common';
import { EmbedService } from 'src/packages/embedding/embed.service';

@Injectable()
export class AIService {
    constructor(private readonly embedService: EmbedService) {}

    async embedding(text: string) {
        return await this.embedService.getEmbedding(text);
    }
}
