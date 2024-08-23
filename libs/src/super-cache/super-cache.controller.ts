import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Authorize } from 'src/decorators/authorize.decorator';
import { PERMISSIONS } from 'src/constants';
import { SuperCacheService } from './super-cache.service';
import { ExtendedDelete } from '@libs/super-core/decorators/extended-delete.decorator';

@Controller('admin/super-cache')
@ApiTags('Admin: Super Cache')
export class SuperCacheController {
    constructor(private readonly superCacheService: SuperCacheService) {}

    @ExtendedDelete({ route: 'reset' })
    @Authorize(PERMISSIONS.CATEGORIES.destroy)
    async reset() {
        return this.superCacheService.resetCache();
    }
}
