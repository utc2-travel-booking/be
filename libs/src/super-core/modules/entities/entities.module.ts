import { EntitiesService } from './entities.service';
import { EntitiesController } from './entities.controller';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [EntitiesController],
    providers: [EntitiesService],
})
export class EntitiesModule {}
