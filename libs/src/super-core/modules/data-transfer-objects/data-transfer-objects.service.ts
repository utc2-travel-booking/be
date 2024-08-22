import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { DTOMetadataStorage } from './storages/data-transfer-objects.storage';

@Injectable()
export class DataTransferObjectsService {
    private readonly dTOMetadataStorage = DTOMetadataStorage;

    async getOne(name: string) {
        return this.dTOMetadataStorage.getDTOMetadata(name);
    }
}
