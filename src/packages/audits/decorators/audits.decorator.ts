import { SetMetadata } from '@nestjs/common';
import { AUDIT_LOG_DATA } from '../constants';

export interface AuditDecoratorOptions {
    event: string;
    targetType: string;
}

export const AuditDecorator = (option: AuditDecoratorOptions) =>
    SetMetadata(AUDIT_LOG_DATA, option);
