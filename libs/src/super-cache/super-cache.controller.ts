import { ApiTags } from '@nestjs/swagger';
import { SuperCacheService } from './super-cache.service';
import { SuperDelete } from '@libs/super-core/decorators/super-delete.decorator';
import { SuperAuthorize } from '@libs/super-authorize/decorators/authorize.decorator';
import { Controller } from '@nestjs/common';
import { Resource } from '@libs/super-authorize';

@Controller('admin/super-cache')
@Resource('admin/super-cache')
@ApiTags('Admin: Super Cache')
export class SuperCacheController {
    constructor(private readonly superCacheService: SuperCacheService) {}

    @SuperDelete({ route: 'reset' })
    @SuperAuthorize()
    async reset() {
        return this.superCacheService.resetCache();
    }
}
