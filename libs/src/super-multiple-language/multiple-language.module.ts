import { Module } from '@nestjs/common';
import { RequestContextModule } from '../super-request-context';

@Module({
    imports: [RequestContextModule],
    controllers: [],
    providers: [],
})
export class MultipleLanguageModule {}
