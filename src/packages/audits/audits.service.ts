import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { Audit, AuditDocument } from './entity/audits.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model, Types } from 'mongoose';
import { AUDIT_EVENT } from './constants';
import _ from 'lodash';

@Injectable()
export class AuditsService extends BaseService<AuditDocument, Audit> {
    constructor(
        @InjectModel(COLLECTION_NAMES.AUDIT)
        private readonly auditModel: Model<AuditDocument>,
    ) {
        super(auditModel, Audit);
    }

    async create(data: any) {
        const audit: Audit = {
            ...data,
        };
        const { event, targetType, refId } = audit;

        if (event === AUDIT_EVENT.UPDATED) {
            audit['old_values'] = await this.findOldData(refId, targetType);
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
                                AUDIT_EVENT.CREATED,
                                AUDIT_EVENT.UPDATED,
                                AUDIT_EVENT.DELETED,
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
                            $in: [AUDIT_EVENT.CREATED, AUDIT_EVENT.UPDATED],
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

    async countUserRequest(userAgent: string, ipAddress: string) {
        return await this.countDocuments({
            event: AUDIT_EVENT.UPLOAD_FILE_FRONT,
            ip_address: ipAddress,
            user_agent: userAgent,
        });
    }
}
