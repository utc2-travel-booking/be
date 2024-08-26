import { SuperAuthorizeModule } from './../libs/src/super-authorize/super-authorize.module';
import { SuperCoreModule } from 'libs/src/super-core/super-core.module';
import { RoutersModule } from './routers/routers.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SeedsModule } from './packages/seeds/seeds.module';
import { appSettings } from './configs/appsettings';
import { AuditsModule } from './packages/audits/audits.module';
import { MultipleLanguageModule } from '@libs/super-multiple-language/multiple-language.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            useFactory: async () => ({
                uri: appSettings.mongoose.uri,
            }),
        }),
        EventEmitterModule.forRoot(),
        ScheduleModule.forRoot(),
        RoutersModule.forRoot(),
        SuperCoreModule,
        CommonModule,
        SeedsModule,
        MultipleLanguageModule,
        AuditsModule,
        SuperAuthorizeModule.forRoot({ prefixes: ['admin', 'front'] }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
