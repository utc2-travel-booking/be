import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { generateKey } from '../common/genarate-key.utils';
import { SUPER_CACHE_METADATA_KEY, HTTP_METHODS } from '../constants';
import { SuperCacheOptions } from '../decorators/super-cache.decorator';
import { SuperCacheService } from '../super-cache.service';
import { appSettings } from 'src/configs/appsettings';

@Injectable()
export class SuperCacheInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly superCacheService: SuperCacheService,
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        if (!appSettings.redis.heathCheck) {
            return next.handle();
        }

        const target = context.getClass();
        const options: SuperCacheOptions =
            this.reflector.get<SuperCacheOptions>(
                SUPER_CACHE_METADATA_KEY.CATCH_RETURN_CLASS,
                target,
            );

        const request = context.switchToHttp().getRequest();
        const { body, query, params, user, method } = request;

        const { mainCollectionName, relationCollectionNames } = options || {};

        await this.superCacheService.setOneCollection(
            mainCollectionName,
            relationCollectionNames,
        );

        if (method === HTTP_METHODS.GET) {
            const key = generateKey({ ...body, ...query, ...params, ...user });

            const cacheData = await this.superCacheService.getDataForCollection(
                mainCollectionName,
                key,
            );

            if (cacheData) {
                return of(cacheData);
            }

            return next.handle().pipe(
                switchMap(async (data) => {
                    await this.superCacheService.setDataForCollection(
                        mainCollectionName,
                        key,
                        data,
                    );
                    return data;
                }),
            );
        }

        return next.handle();
    }
}
