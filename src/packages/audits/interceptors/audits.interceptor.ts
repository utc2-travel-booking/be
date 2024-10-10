import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import _ from 'lodash';
import { AuditDecoratorOptions } from '../decorators/audits.decorator';
import {
    AUDIT_EVENT,
    AUDIT_LOG,
    AUDIT_LOG_DATA,
    AuditStatus,
} from '../constants';
import { Audit } from '../entities/audits.entity';
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
            const response = context.switchToHttp().getResponse();

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
                statusCode: response.statusCode,
                statusMessage: response.statusMessage || '',
            };

            const handleAuditEvent = (
                events: string[],
                oldValues: any,
                newValues: any,
                body?: any,
            ) => {
                if (events.includes(method)) {
                    auditData.oldValues = oldValues;
                    auditData.newValues = newValues;
                    auditData.event = method;
                    auditData.body = body;
                    if (newValues['_id']) {
                        auditData.refId = new Types.ObjectId(
                            _.get(newValues, '_id'),
                        );
                    }
                    this.eventEmitter.emit(AUDIT_LOG, auditData);
                }
            };

            return next.handle().pipe(
                tap((response) => {
                    const data = response?.data ? response?.data : response;

                    if ([AUDIT_EVENT.GET].includes(method)) {
                        handleAuditEvent(events, data, {});
                    }

                    if ([AUDIT_EVENT.POST, AUDIT_EVENT.PUT].includes(method)) {
                        const body = _.isEmpty(request.body)
                            ? {}
                            : request.body;
                        handleAuditEvent(events, {}, data, body);
                    }

                    if ([AUDIT_EVENT.DELETE].includes(method)) {
                        handleAuditEvent(events, data, {});
                    }
                }),
                catchError((err) => {
                    auditData.status = AuditStatus.BAD_REQUEST;
                    auditData.statusCode = err.status || 500;
                    auditData.statusMessage =
                        err.message || 'Internal server error';
                    handleAuditEvent(events, {}, { error: err.message });
                    throw err;
                }),
            );
        } catch (error) {
            return next.handle();
        }
    }
}
