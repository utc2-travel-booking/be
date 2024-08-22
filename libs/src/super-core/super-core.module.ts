import { Module } from '@nestjs/common';
import { EntitiesModule } from './modules/entities/entities.module';

@Module({
    imports: [EntitiesModule],
    controllers: [],
    providers: [],
})
export class SuperCoreModule {}
