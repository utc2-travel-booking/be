import { JwtStrategy } from '@libs/super-authorize/strategies/jwt.strategy';
import { SuperCacheModule } from '@libs/super-cache/super-cache.module';
import { Module } from '@nestjs/common';
import { RolesModule } from 'src/apis/roles/roles.module';

@Module({
    imports: [RolesModule, SuperCacheModule],
    controllers: [],
    providers: [JwtStrategy],
})
export class AuthModule {}
