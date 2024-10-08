import { ExtendedModelDefinition } from '@libs/super-core/interfaces/extended-model-definition.interface';
import { DynamicModule, Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ModuleRef } from '@nestjs/core';
import { BaseRepositories } from './repositories/base.repository';
import { getExtendModelToken } from '@libs/super-core/common/extend-mongoose.utils';

@Module({})
export class ExtendedMongooseModule {
    static forFeature(
        models: ExtendedModelDefinition[] = [],
        connectionName?: string,
    ): DynamicModule {
        const providers = models.map((feature) => ({
            provide: getExtendModelToken(feature.name, connectionName),
            useFactory: (model: Model<any>, moduleRef: ModuleRef) =>
                new BaseRepositories(
                    model,
                    feature.entity,
                    feature.name,
                    moduleRef,
                ),
            inject: [getModelToken(feature.name), ModuleRef],
        }));

        return {
            module: ExtendedMongooseModule,
            imports: [MongooseModule.forFeature(models, connectionName)],
            providers: providers,
            exports: providers,
        };
    }
}
