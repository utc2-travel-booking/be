import { getConnectionToken } from '@nestjs/mongoose';

export function getExtendModelToken(model: string, connectionName?: string) {
    if (connectionName === undefined) {
        return `${model}Extend_Model`;
    }
    return `${getConnectionToken(connectionName)}/${model}Extend_Model`;
}
