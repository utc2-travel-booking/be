import { Controller, Param } from '@nestjs/common';
import { DataTransferObjectsService } from './data-transfer-objects.service';
import { ApiTags } from '@nestjs/swagger';
import { SuperGet } from '@libs/super-core/decorators/super-get.decorator';
import { Resource } from '@libs/super-authorize';

@Controller('admin/data-transfer-objects')
@Resource('data-transfer-objects')
@ApiTags('Admin: Data Transfer Objects')
export class DataTransferObjectsController {
    constructor(
        private readonly dataTransferObjectsService: DataTransferObjectsService,
    ) {}

    @SuperGet({ route: ':name' })
    async getOne(@Param('name') name: string) {
        const result = await this.dataTransferObjectsService.getOne(name);
        return result;
    }
}
