import { Module } from '@nestjs/common';
import { RequestContextModule } from 'nestjs-request-context';

@Module({
    imports: [RequestContextModule],
    controllers: [],
    providers: [],
})
export class LocaleModule {}
