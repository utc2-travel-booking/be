import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { RouterFrontsModule } from './front/router-fronts.module';
import { RouterAdminsModule } from './admin/router-admins.module';
import { RouterCommonModule } from './common/router-common.module';
import { RouterAdminsModuleDev } from './admin/router-admins.module.dev';

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
            RouterAdminsModule,
            RouterCommonModule,
            RouterAdminsModuleDev,
            RouterModule.register([
                {
                    path: ``,
                    children: [
                        {
                            path: `/front`,
                            module: RouterFrontsModule,
                        },
                        {
                            path: '/admin',
                            module: RouterAdminsModule,
                        },
                        {
                            path: '/admin',
                            module: RouterAdminsModuleDev,
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
