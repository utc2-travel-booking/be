import { Controller, Param } from '@nestjs/common';
import { DataTransferObjectsService } from './data-transfer-objects.service';
import { ApiTags } from '@nestjs/swagger';

import { ExtendedGet } from '@libs/super-core/decorators/extended-get.decorator';

@Controller('admin/data-transfer-objects')
@ApiTags('Admin: Data Transfer Objects')
export class DataTransferObjectsController {
    constructor(
        private readonly dataTransferObjectsService: DataTransferObjectsService,
    ) {}

    @ExtendedGet({ route: ':name' })
    async getOne(@Param('name') name: string) {
        const result = await this.dataTransferObjectsService.getOne(name);
        return result;
    }
}
