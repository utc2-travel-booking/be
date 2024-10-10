import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AUDIT_LOG } from '../constants';
import { AuditsService } from '../audits.service';
import { Audit } from '../entities/audits.entity';

@Injectable()
export class AuditLogEvent {
    private readonly logger = new Logger(AuditLogEvent.name);
    constructor(private auditsService: AuditsService) {}

    @OnEvent(AUDIT_LOG)
    async handleSendMailEvent(event: Audit) {
        this.logger.debug(`Created audit...`);
        await this.auditsService.createAudit(event);
        this.logger.debug(`Created audit...done`);
    }
}
