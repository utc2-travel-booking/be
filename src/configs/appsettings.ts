import 'dotenv/config';

export const appSettings = {
    port: Number(process.env.PORT) || 3000,
    development: process.env.DEVELOPMENT,
    mainLanguage: process.env.MAIN_LANGUAGE || 'en',
    maxFileSize: {
        admin: Number(process.env.MAX_FILE_SIZE_UPLOAD_ADMIN),
        front: Number(process.env.MAX_FILE_SIZE_UPLOAD_USER),
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expireIn: process.env.JWT_EXPIRES_IN,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpireIn: process.env.JWT_REFRESH_EXPIRES_IN,
        issuer: process.env.JWT_ISSUER,
    },
    oidc: {
        sessionSecret: process.env.SESSION_SECRET,
    },
    mongoose: {
        uri: process.env.MONGO_URI,
    },
    s3: {
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY,
        bucket: process.env.AWS_BUCKET_NAME,
        folder: process.env.AWS_FOLDER_NAME_DEFAULT,
    },
    redis: {
        heathCheck: process.env.REDIS_HOST ? true : false,
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
    },
    provider: {
        telegram: {
            contractChannelId: process.env.TELEGRAM_CONTACT_CHANNEL_ID,
            contractBotToken: process.env.TELEGRAM_CONTACT_BOT_TOKEN,
        },
    },
    webSocket: {
        port: Number(process.env.WEBSOCKET_PORT),
    },
};
