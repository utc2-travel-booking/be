import { Type } from '@aws-sdk/client-s3';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { EmbeddingCreateParams } from 'openai/resources';
import { TypeInputEmbed } from 'src/apis/ai/constant';
import { appSettings } from 'src/configs/app-settings';

@Injectable()
export class EmbedService {
    private readonly logger = new Logger('EmbedService');
    private readonly clientOpenAI: OpenAI;

    constructor() {
        this.clientOpenAI = new OpenAI({
            baseURL: appSettings.openai.host,
            apiKey: '',
        });
    }

    async getEmbedding(input: string, type: TypeInputEmbed) {
        try {
            let body: EmbeddingCreateParams;
            if (type === TypeInputEmbed.IMAGE) {
                body = {
                    input,
                    model: 'laion/larger_clap_general',
                    encoding_format: 'float',
                };
            } else {
                body = {
                    input,
                    model: 'laion/larger_clap_general',
                    encoding_format: 'float',
                };
            }

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
