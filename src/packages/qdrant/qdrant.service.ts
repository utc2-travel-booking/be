import {
    BadRequestException,
    Inject,
    Injectable,
    Logger,
    Provider,
} from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';
import { appSettings } from 'src/configs/app-settings';

@Injectable()
export class QdrantService {
    private readonly logger = new Logger('QdrantService');
    private readonly clientQdrant: QdrantClient;
    private readonly collectionName = appSettings.qdrant.collectionName;

    constructor() {
        this.clientQdrant = new QdrantClient({
            url: appSettings.qdrant.host,
        });
    }
    async onModuleInit() {
        await this.checkAndCreateCollection();
    }
    private generateUniqueId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    private async checkAndCreateCollection() {
        try {
            const collectionInfo = await this.clientQdrant.getCollection(
                this.collectionName,
            );

            if (collectionInfo) {
                return;
            }
        } catch (error) {
            if (error.message.includes('Not Found')) {
                this.logger.debug(
                    `Collection '${this.collectionName}' does not exist. Creating it...`,
                );

                await this.clientQdrant.createCollection(this.collectionName, {
                    vectors: {
                        size: 384,
                        distance: 'Cosine',
                    },
                });

                this.logger.debug(
                    `Collection '${this.collectionName}' created successfully.`,
                );
            } else {
                this.logger.error(
                    `Error checking collection: ${error.message}`,
                );
                throw new BadRequestException(
                    `Could not check collection: ${error.message}`,
                );
            }
        }
    }
    async addData(vector: number[], payload: any) {
        try {
            const id = this.generateUniqueId();
            const response = await this.clientQdrant.upsert(
                this.collectionName,
                {
                    points: [
                        {
                            id,
                            payload,
                            vector,
                        },
                    ],
                },
            );

            this.logger.debug(`Data added successfully: ${response}`);
        } catch (error) {
            this.logger.error(`Error adding data: ${error.message}`);
            throw new BadRequestException(
                `Could not add data: ${error.message}`,
            );
        }
    }

    async searchData(vector: number[], limit: number = 10) {
        try {
            const response = await this.clientQdrant.search(
                this.collectionName,
                {
                    vector,
                    limit,
                },
            );

            this.logger.debug(`Search results: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            this.logger.error(`Error searching data: ${error.message}`);
            throw new BadRequestException(
                `Could not search data: ${error.message}`,
            );
        }
    }
}
