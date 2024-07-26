import { MongooseModule } from '@nestjs/mongoose';
import { AuditsService } from './audits.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { AuditSchema } from './entity/audits.entity';
import { AuditLogEvent } from './event-handlers/audit-logs.event';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditsInterceptor } from './interceptors/audits.interceptor';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.AUDIT, schema: AuditSchema },
        ]),
    ],
    controllers: [],
    providers: [
        AuditsService,
        AuditLogEvent,
        {
            provide: APP_INTERCEPTOR,
            useClass: AuditsInterceptor,
        },
    ],
    exports: [AuditsService],
})
export class AuditsModule {}
