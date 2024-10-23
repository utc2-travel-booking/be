import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { EmbeddingCreateParams } from 'openai/resources';
import { appSettings } from 'src/configs/app-settings';

@Injectable()
export class EmbedService {
    private readonly logger = new Logger('EmbedService');
    private readonly clientOpenAI: OpenAI;

    constructor() {
        this.clientOpenAI = new OpenAI({
            baseURL: appSettings.openai.host,
            apiKey: 'simple_key',
        });
    }

    async getEmbedding(text: string) {
        try {
            const body: EmbeddingCreateParams = {
                input: text,
                model: 'laion/larger_clap_general',
                encoding_format: 'float',
            };
            const response = await this.clientOpenAI.embeddings.create(body);
            return response.data[0].embedding;
        } catch (error) {
            this.logger.error(`Error getting embedding: ${error.message}`);
            throw new BadRequestException(
                `Could not get embedding: ${error.message}`,
            );
        }
    }
}
