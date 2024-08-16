import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [],
    providers: [WebsocketService, WebsocketGateway],
    exports: [WebsocketService, WebsocketGateway],
})
export class WebsocketModule {}
