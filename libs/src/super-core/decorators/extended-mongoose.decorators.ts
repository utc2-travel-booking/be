import { Inject } from '@nestjs/common';
import { getExtendModelToken } from '../common/extend-mongoose.utils';

export const ExtendedInjectModel = (model: string, connectionName?: string) =>
    Inject(getExtendModelToken(model, connectionName));
