import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { Audit, AuditDocument } from './entity/audits.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model, Types } from 'mongoose';
import { AUDIT_EVENT } from './constants';
import _ from 'lodash';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuditsService extends BaseService<AuditDocument, Audit> {
    constructor(
        @InjectModel(COLLECTION_NAMES.AUDIT)
        private readonly auditModel: Model<AuditDocument>,
        eventEmitter: EventEmitter2,
    ) {
        super(auditModel, Audit, COLLECTION_NAMES.AUDIT, eventEmitter);
    }

    async createAudit(audit: Audit) {
        const { event, refSource, refId } = audit;

        if (event === AUDIT_EVENT.PUT) {
            audit.oldValues = await this.findOldData(refId, refSource);
        }

        return await this.create(audit);
    }

    async findAllDataChange(fromDate: Date, toDate: Date) {
        const data = await this.find(
            {
                $and: [
                    {
                        created_at: {
                            $gte: fromDate,
                            $lte: toDate,
                        },
                        event: {
                            $in: [
                                AUDIT_EVENT.POST,
                                AUDIT_EVENT.PUT,
                                AUDIT_EVENT.DELETE,
                            ],
                        },
                    },
                ],
            },
            null,
            { sort: { createdAt: -1 } },
        );

        return data;
    }

    async findOldData(refId: Types.ObjectId, targetType: string) {
        const result = await this.findOne(
            {
                $and: [
                    {
                        event: {
                            $in: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT],
                        },
                    },
                    {
                        targetType,
                    },
                    {
                        refId,
                    },
                ],
            },
            null,
            { created_at: -1 },
        );

        return _.get(result, 'newValues', {});
    }
}
