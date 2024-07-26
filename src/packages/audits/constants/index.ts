export const AUDIT_LOG = 'audit-log';
export const AUDIT_LOG_DATA = 'AUDIT_LOG_DATA';

export enum AUDIT_EVENT {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export enum AuditStatus {
    BAD_REQUEST = 'BAD_REQUEST',
    GOOD_REQUEST = 'GOOD_REQUEST',
}
