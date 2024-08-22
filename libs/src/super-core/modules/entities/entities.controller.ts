import { Controller, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntitiesService } from './entities.service';
import { DefaultGet } from 'src/base/controllers/base.controller';

@Controller('admin/entities')
@ApiTags('Admin: Entities')
export class EntitiesController {
    constructor(private readonly entitiesService: EntitiesService) {}

    @DefaultGet()
    async getAll() {
        return await this.entitiesService.getAll();
    }

    @DefaultGet(':collectionName')
    async getOne(@Param('collectionName') collectionName: string) {
        return await this.entitiesService.getOne(collectionName);
    }
}
