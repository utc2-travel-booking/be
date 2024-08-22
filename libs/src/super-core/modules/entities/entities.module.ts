import { EntitiesService } from './entities.service';
import { EntitiesController } from './entities.controller';
import { Module } from '@nestjs/common';
import { MetadataScanner } from '@nestjs/core';
import { SuperCacheModule } from '@libs/super-cache/super-cache.module';

@Module({
    imports: [SuperCacheModule],
    controllers: [EntitiesController],
    providers: [EntitiesService, MetadataScanner],
})
export class EntitiesModule {}
