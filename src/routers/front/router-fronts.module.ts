import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/apis/auth/auth.module';
import { AuthController } from 'src/apis/auth/controllers/auth.controller';
import { AIModule } from 'src/apis/ai/ai.module';
import { AIController } from 'src/apis/ai/controllers/ai.controller';

@Module({
    imports: [CommonModule, AuthModule, AIModule],
    controllers: [AuthController, AIController],
    providers: [],
})
export class RouterFrontsModule {}
