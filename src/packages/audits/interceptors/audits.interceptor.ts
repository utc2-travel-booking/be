import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import _ from 'lodash';
import { AuditDecoratorOptions } from '../decorators/audits.decorator';
import { AUDIT_EVENT, AUDIT_LOG, AUDIT_LOG_DATA } from '../constants';
import { Audit } from '../entity/audits.entity';
import { Types } from 'mongoose';

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
        const target = context.getClass();
        const audit: AuditDecoratorOptions =
            this.reflector.get<AuditDecoratorOptions>(AUDIT_LOG_DATA, target);

        if (!audit) {
            return next.handle();
        }

        try {
            const { events, refSource } = audit;
            const request = context.switchToHttp().getRequest();

            const { user, originalUrl, method } = request;

            const ip =
                request.headers['x-forwarded-for'] ||
                request.connection.remoteAddress;
            const userAgent = request.headers['user-agent'] || '';

            const auditData: Partial<Audit> = {
                url: request.get('host') + originalUrl,
                ipAddress: ip,
                userAgent: userAgent,
                createdBy: user ? user?._id : null,
                oldValues: {},
                newValues: {},
                refId: null,
                refSource: refSource,
            };

            return next.handle().pipe(
                tap((response) => {
                    const data = response?.data ? response?.data : response;

                    const handleAuditEvent = (
                        events: string[],
                        oldValues: any,
                        newValues: any,
                    ) => {
                        if (events.includes(method)) {
                            auditData.oldValues = oldValues;
                            auditData.newValues = newValues;
                            auditData.event = method;
                            if (newValues['_id']) {
                                auditData.refId = new Types.ObjectId(
                                    newValues['_id'].toString(),
                                );
                            }
                            this.eventEmitter.emit(AUDIT_LOG, auditData);
                        }
                    };

                    if ([AUDIT_EVENT.GET].includes(method)) {
                        handleAuditEvent(events, data, {});
                    }

                    if ([AUDIT_EVENT.POST, AUDIT_EVENT.PUT].includes(method)) {
                        handleAuditEvent(events, {}, data);
                    }

                    // if ([AUDIT_ EVENT.DELETE].includes(method)) {
                    //     if (Array.isArray(data)) {
                    //         for (const item of data) {
                    //             handleAuditEvent(events, item, {});
                    //         }
                    //     } else {
                    //         handleAuditEvent(events, data, {});
                    //     }
                    // }
                }),
            );
        } catch (error) {
            return next.handle();
        }
    }
}
