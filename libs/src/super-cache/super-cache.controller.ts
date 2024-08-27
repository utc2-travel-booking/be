import { ApiTags } from '@nestjs/swagger';
import { SuperCacheService } from './super-cache.service';
import { ExtendedDelete } from '@libs/super-core/decorators/extended-delete.decorator';
import { SuperController } from '@libs/super-core';
import { SuperAuthorize } from '@libs/super-authorize/decorators/authorize.decorator';

@SuperController('admin/super-cache')
@ApiTags('Admin: Super Cache')
export class SuperCacheController {
    constructor(private readonly superCacheService: SuperCacheService) {}

    @ExtendedDelete({ route: 'reset' })
    @SuperAuthorize()
    async reset() {
        return this.superCacheService.resetCache();
    }
}
