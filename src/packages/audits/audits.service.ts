import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { Audit, AuditDocument } from './entities/audits.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model, Types } from 'mongoose';
import { AUDIT_EVENT } from './constants';
import _ from 'lodash';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class AuditsService extends BaseService<AuditDocument, Audit> {
    constructor(
        @InjectModel(COLLECTION_NAMES.AUDIT)
        private readonly auditModel: Model<AuditDocument>,
        moduleRef: ModuleRef,
    ) {
        super(auditModel, Audit, COLLECTION_NAMES.AUDIT, moduleRef);
    }

    async createAudit(audit: Audit) {
        const { event, refSource, refId } = audit;

        if (event === AUDIT_EVENT.PUT) {
            audit.oldValues = await this.findOldData(refId, refSource);
        }

        return await this.create(audit);
    }

    async findOldData(refId: Types.ObjectId, refSource: string) {
        const result = await this.findOne({
            $and: [
                {
                    event: {
                        $in: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT],
                    },
                },
            ],
            refSource,
            refId,
        })
            .sort({ createdAt: -1 })
            .exec();

        return _.get(result, 'newValues', {});
    }
}
