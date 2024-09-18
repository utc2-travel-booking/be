export enum UserNotificationStatus {
    READ = 'READ',
    UNREAD = 'UNREAD',
    DELETED = 'DELETED',
}

export enum NOTIFICATION_EVENT_HANDLER {
    CREATE = 'NOTIFICATION_EVENT_HANDLER_CREATE',
}

export enum NOTIFICATION_TYPE {
    COMPLETED = 'You have completed the task of {{mission.name}}',
    LIMIT = 'You {{limit * reward}} today - max reached!',
    OPEN = 'You open ${appName}',
    COMMENT = 'You comment {{appName}}',
    SHARE = 'You share {{appName}}',
}
