export const COLLECTION_NAMES = {
    USER: 'users',
    ROLE: 'roles',
    PERMISSION: 'permissions',
    FILE: 'files',
    METADATA: 'metadata',
    CATEGORIES: 'categories',
    POST: 'posts',
    AUDIT: 'audits',
};

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
};
