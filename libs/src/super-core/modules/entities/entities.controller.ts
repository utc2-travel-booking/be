import { Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntitiesService } from './entities.service';

import { SuperGet } from '@libs/super-core/decorators/super-get.decorator';
import { SuperController } from '@libs/super-core/decorators';

@SuperController('admin/entities')
@ApiTags('Admin: Entities')
export class EntitiesController {
    constructor(private readonly entitiesService: EntitiesService) {}

    @SuperGet()
    async getAll() {
        return await this.entitiesService.getAll();
    }

    @SuperGet({ route: ':collectionName' })
    async getOne(@Param('collectionName') collectionName: string) {
        return await this.entitiesService.getOne(collectionName);
    }
}
