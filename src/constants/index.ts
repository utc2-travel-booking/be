export enum COLLECTION_NAMES {
    NONCE = 'nonces',
    USER = 'users',
    ROLE = 'roles',
    PERMISSION = 'permissions',
    FILE = 'files',
    METADATA = 'metadata',
    CATEGORIES = 'categories',
    POST = 'posts',
    AUDIT = 'audits',
    APP = 'apps',
    REVIEW_RATING = 'review-ratings',
    ADVERTISER = 'advertisers',
    USER_APP_HISTORY = 'userAppHistories',
    TELEGRAM_BOT = 'telegramBots',
    TAG = 'tags',
    TAG_APP = 'tagApps',
    USER_TRANSACTION = 'userTransactions',
    NOTIFICATION = 'notifications',
}

export const PERMISSIONS = {
    USER: {
        index: 'admin.users.index',
        create: 'admin.users.create',
        edit: 'admin.users.edit',
        destroy: 'admin.users.destroy',
    },
    ROLE: {
        index: 'admin.roles.index',
        create: 'admin.roles.create',
        edit: 'admin.roles.edit',
        destroy: 'admin.roles.destroy',
    },
    FILE: {
        index: 'admin.files.index',
        create: 'admin.files.create',
        edit: 'admin.files.edit',
        destroy: 'admin.files.destroy',
    },
    CATEGORIES: {
        index: 'admin.categories.###.index',
        create: 'admin.categories.###.create',
        edit: 'admin.categories.###.edit',
        destroy: 'admin.categories.###.destroy',
    },
    POST: {
        index: 'admin.posts.###.index',
        create: 'admin.posts.###.create',
        edit: 'admin.posts.###.edit',
        destroy: 'admin.posts.###.destroy',
    },
    AUDIT: {
        index: 'admin.audits.index',
    },
    PERMISSION: {
        index: 'admin.permissions.index',
    },
    APP: {
        index: 'admin.apps.index',
        create: 'admin.apps.create',
        edit: 'admin.apps.edit',
        destroy: 'admin.apps.destroy',
    },
    REVIEW: {
        index: 'admin.reviews.index',
        create: 'admin.reviews.create',
        edit: 'admin.reviews.edit',
        destroy: 'admin.reviews.destroy',
    },
    ADVERTISER: {
        index: 'admin.advertisers.index',
        create: 'admin.advertisers.create',
        edit: 'admin.advertisers.edit',
        destroy: 'admin.advertisers.destroy',
    },
    REDIS: {
        index: 'admin.redis.destroy',
    },
    TELEGRAM_BOT: {
        index: 'admin.telegram-bots.index',
        create: 'admin.telegram-bots.create',
        edit: 'admin.telegram-bots.edit',
        destroy: 'admin.telegram-bots.destroy',
    },
    TAG: {
        index: 'admin.tags.index',
        create: 'admin.tags.create',
        edit: 'admin.tags.edit',
        destroy: 'admin.tags.destroy',
    },
    USER_TRANSACTION: {
        index: 'admin.user-transactions.index',
    },
    NOTIFICATION: {
        index: 'admin.notifications.index',
        create: 'admin.notifications.create',
        edit: 'admin.notifications.edit',
        destroy: 'admin.notifications.destroy',
    },
};

export const PERMISSIONS_FRONT = {
    USER: {
        index: 'front.users.index',
        create: 'front.users.create',
        edit: 'front.users.edit',
        destroy: 'front.users.destroy',
    },
    CATEGORIES: {
        index: 'front.categories.###.index',
        create: 'front.categories.###.create',
        edit: 'front.categories.###.edit',
        destroy: 'front.categories.###.destroy',
    },
    POST: {
        index: 'front.posts.###.index',
        create: 'front.posts.###.create',
        edit: 'front.posts.###.edit',
        destroy: 'front.posts.###.destroy',
    },
    FILE: {
        index: 'front.files.index',
        create: 'front.files.create',
        edit: 'front.files.edit',
        destroy: 'front.files.destroy',
    },
    APP: {
        index: 'front.apps.index',
        create: 'front.apps.create',
        edit: 'front.apps.edit',
        destroy: 'front.apps.destroy',
    },
    REVIEW: {
        index: 'front.reviews.index',
        create: 'front.reviews.create',
        edit: 'front.reviews.edit',
        destroy: 'front.reviews.destroy',
    },
    NOTIFICATION: {
        index: 'front.notifications.index',
        edit: 'front.notifications.edit',
        destroy: 'front.notifications.destroy',
    },
};
