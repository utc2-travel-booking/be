import { AuditsService } from './audits.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { AuditSchema, Audit } from './entities/audits.entity';
import { AuditLogEvent } from './event-handlers/audit-logs.event';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditsInterceptor } from './interceptors/audits.interceptor';
import { AuditsControllerAdmin } from './controllers/audits.controller.admin';
import { ExtendedMongooseModule } from '@libs/super-core/modules/mongoose/extended-mongoose.module';

@Module({
    imports: [
        ExtendedMongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.AUDIT,
                schema: AuditSchema,
                entity: Audit,
            },
        ]),
    ],
    controllers: [AuditsControllerAdmin],
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
