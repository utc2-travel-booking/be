import { RoutersModule } from './routers/routers.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SeedsModule } from './packages/seeds/seeds.module';
import { appSettings } from './configs/appsettings';

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
        CommonModule,
        // SeedsModule,
        RoutersModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
