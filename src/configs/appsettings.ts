import 'dotenv/config';

export const appSettings = {
    port: Number(process.env.PORT) || 3000,
    development: process.env.DEVELOPMENT,
    mainLanguage: process.env.MAIN_LANGUAGE,
    maxFileSize: {
        admin: Number(process.env.MAX_FILE_SIZE_UPLOAD_ADMIN),
        front: Number(process.env.MAX_FILE_SIZE_UPLOAD_USER),
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expireIn: process.env.EXPIRES_IN,
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
        folder: process.env.AWS_FOLDER_NAME_DEFAULT || 'marketplace',
    },
};
