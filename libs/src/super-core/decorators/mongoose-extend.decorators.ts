import { Inject } from '@nestjs/common';
import { getExtendModelToken } from '../common/extend-mongoose.utils';

export const InjectModelExtend = (model: string, connectionName?: string) =>
    Inject(getExtendModelToken(model, connectionName));
