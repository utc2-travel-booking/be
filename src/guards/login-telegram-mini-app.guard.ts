import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LoginTelegramMiniAppGuard extends AuthGuard(
    'login-telegram-mini-app',
) {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest<TUser = any>(err: any, user: any): TUser {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
