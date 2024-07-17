import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './interceptors/transform.interceptors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import _ from 'lodash';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { useContainer } from 'class-validator';
import { appSettings } from './configs/appsettings';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
        abortOnError: true,
    });
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.setGlobalPrefix('/api');

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: false,
        }),
    );
    app.useGlobalInterceptors(new TransformInterceptor());

    const refreshTokenExpireMillisecond =
        Number(appSettings.jwt.refreshExpireIn) * 1000;
    const minuteMillisecond = 60 * 1000;
    app.use(
        session({
            store: new MongoStore({ mongoUrl: appSettings.mongoose.uri }),
            secret: appSettings.oidc.sessionSecret,
            resave: false,
            saveUninitialized: false,
            rolling: true,
            cookie: {
                maxAge: refreshTokenExpireMillisecond + minuteMillisecond,
                httpOnly: true,
            },
        }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    if (_.isEqual(appSettings.development, 'true')) {
        const config = new DocumentBuilder()
            .setTitle('API Documentation')
            .setDescription('API description')
            .setVersion('1.0')
            .addBasicAuth(
                {
                    type: 'http',
                    scheme: 'basic',
                },
                'basic',
            )
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('document', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
    }

    await app.listen(appSettings.port);
}
bootstrap();
