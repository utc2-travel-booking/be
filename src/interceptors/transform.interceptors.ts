import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    data: T;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>>
{
    intercept(
        ctx: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => {
                let message = 'OK';
                if (
                    data?.message &&
                    data?.message != '' &&
                    typeof data.message === 'string'
                ) {
                    message = data.message;
                    data = data.data;
                }

                return {
                    data,
                    message,
                    statusCode: 200,
                };
            }),
        );
    }
}
