import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { randomUUID } from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import _ from 'lodash';
import { AuditDecoratorOptions } from '../decorators/audits.decorator';
import { AUDIT_EVENT, AUDIT_LOG, AUDIT_LOG_DATA } from '../constants';

@Injectable()
export class AuditsInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const audit: AuditDecoratorOptions =
            this.reflector.get<AuditDecoratorOptions>(
                AUDIT_LOG_DATA,
                context.getHandler(),
            );

        if (!audit) {
            return next.handle();
        }

        const { event, targetType } = audit;
        const req = context.switchToHttp().getRequest();

        try {
            const { user, originalUrl } = req;

            const ip =
                req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const userAgent = req.headers['user-agent'] || '';

            const auditData = {
                id: randomUUID(),
                event,
                url: req.get('host') + '://' + originalUrl,
                target_type: targetType,
                ip_address: ip,
                user_agent: userAgent,
                created_by: user,
                old_values: {},
                new_values: {},
                target_id: '',
                locale: '',
            };

            return next.handle().pipe(
                tap((response) => {
                    const data = response?.data ? response?.data : response;

                    if (
                        event === AUDIT_EVENT.CREATED ||
                        event === AUDIT_EVENT.UPLOAD_FILE_FRONT
                    ) {
                        auditData['old_values'] = {};
                        auditData['new_values'] = data;
                        auditData['target_id'] = data['id'];
                        auditData['locale'] = data['locale'];
                        this.eventEmitter.emit(AUDIT_LOG, auditData);
                    }

                    if (event === AUDIT_EVENT.UPDATED) {
                        auditData['old_values'] = {};
                        auditData['new_values'] = data;
                        auditData['target_id'] = data['id'];
                        auditData['locale'] = data['locale'];
                        this.eventEmitter.emit(AUDIT_LOG, auditData);
                    }

                    if (event === AUDIT_EVENT.DELETED) {
                        if (_.isArray(data)) {
                            for (const item of data) {
                                auditData['old_values'] = item;
                                auditData['new_values'] = {};
                                auditData['target_id'] = item['id'];
                                auditData['locale'] = item['locale'];
                                this.eventEmitter.emit(AUDIT_LOG, auditData);
                            }
                        } else {
                            auditData['old_values'] = data;
                            auditData['new_values'] = {};
                            auditData['target_id'] = data['id'];
                            auditData['locale'] = data['locale'];
                            this.eventEmitter.emit(AUDIT_LOG, auditData);
                        }
                    }
                }),
            );
        } catch (error) {
            return next.handle();
        }
    }
}
