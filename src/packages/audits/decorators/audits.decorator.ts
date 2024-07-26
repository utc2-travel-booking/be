import { SetMetadata } from '@nestjs/common';
import { AUDIT_EVENT, AUDIT_LOG_DATA } from '../constants';

export interface AuditDecoratorOptions {
    events: AUDIT_EVENT[];
    refSource: string;
}

export const AuditLog = (option: AuditDecoratorOptions) =>
    SetMetadata(AUDIT_LOG_DATA, option);
