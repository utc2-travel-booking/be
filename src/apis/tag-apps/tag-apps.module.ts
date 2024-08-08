import { TagAppsController } from './tag-apps.controller';
import { TagAppsService } from './tag-apps.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [TagAppsController],
    providers: [TagAppsService],
})
export class TagAppsModule {}
