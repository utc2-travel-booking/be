import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SuperCacheService } from '../super-cache.service';
import { DefaultDelete } from 'src/base/controllers/base.controller';
import { Authorize } from 'src/decorators/authorize.decorator';
import { PERMISSIONS } from 'src/constants';

@Controller('admin/super-cache')
@ApiTags('Admin: Super Cache')
export class SuperCacheController {
    constructor(private readonly superCacheService: SuperCacheService) {}

    @DefaultDelete('reset')
    @Authorize(PERMISSIONS.CATEGORIES.destroy)
    async reset() {
        return this.superCacheService.resetCache();
    }
}
