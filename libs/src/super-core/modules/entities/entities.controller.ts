import { Controller, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntitiesService } from './entities.service';

import { ExtendedGet } from '@libs/super-core/decorators/extended-get.decorator';

@Controller('admin/entities')
@ApiTags('Admin: Entities')
export class EntitiesController {
    constructor(private readonly entitiesService: EntitiesService) {}

    @ExtendedGet()
    async getAll() {
        return await this.entitiesService.getAll();
    }

    @ExtendedGet({ route: ':collectionName' })
    async getOne(@Param('collectionName') collectionName: string) {
        return await this.entitiesService.getOne(collectionName);
    }
}
