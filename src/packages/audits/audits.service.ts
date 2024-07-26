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

    async findOldData(refId: Types.ObjectId, refSource: string) {
        const result = await this.findOne(
            {
                $and: [
                    {
                        event: {
                            $in: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT],
                        },
                    },
                ],
                refSource,
                refId,
            },
            null,
            { sort: { createdAt: -1 } },
        );

        return _.get(result, 'newValues', {});
    }
}
