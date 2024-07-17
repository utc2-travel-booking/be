import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { RouterFrontsModule } from './front/router-fronts.module';
import { RouterAdminsModule } from './admin/router-admins.module';
import { RouterCommonModule } from './common/router-common.module';
import { RouterFrontLocaleModule } from './front/router-fronts-locale.module';
import { RoutesAdminLocaleModule } from './admin/router-admins-locale.module';

@Module({})
export class RoutersModule {
    static forRoot(): DynamicModule {
        const imports: (
            | DynamicModule
            | Type<any>
            | Promise<DynamicModule>
            | ForwardReference<any>
        )[] = [];

        imports.push(
            RouterFrontsModule,
            RouterFrontLocaleModule,
            RouterAdminsModule,
            RoutesAdminLocaleModule,
            RouterCommonModule,
            RouterModule.register([
                {
                    path: ``,
                    children: [
                        {
                            path: `/front`,
                            module: RouterFrontsModule,
                        },
                        {
                            path: `/:locale/front`,
                            module: RouterFrontLocaleModule,
                        },
                        {
                            path: '/admin',
                            module: RouterAdminsModule,
                        },
                        {
                            path: '/:locale/admin',
                            module: RoutesAdminLocaleModule,
                        },
                    ],
                },
            ]),
        );

        return {
            module: RoutersModule,
            providers: [],
            exports: [],
            controllers: [],
            imports,
        };
    }
}
