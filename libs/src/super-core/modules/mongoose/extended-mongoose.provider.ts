import { getExtendModelToken } from '@libs/super-core/common/extend-mongoose.utils';
import { ExtendedModelDefinition } from '@libs/super-core/interfaces/extended-model-definition.interface';
import { Provider } from '@nestjs/common';
import { Model } from 'mongoose';
import { BaseRepositories } from './repositories/base.repository';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { ModuleRef } from '@nestjs/core';

export function createExtendMongooseProviders(
    connectionName?: string,
    options: ExtendedModelDefinition[] = [],
): Provider[] {
    return options.reduce(
        (providers, option) => [
            ...providers,
            {
                provide: getExtendModelToken(option.name, connectionName),
                useFactory: (moduleRef: ModuleRef) => {
                    const model = moduleRef.get<Model<AggregateRoot>>(
                        option.name,
                        { strict: false },
                    );
                    return new BaseRepositories(
                        model,
                        option.entity,
                        option.name,
                        moduleRef,
                    );
                },
                inject: [ModuleRef],
            },
        ],
        [] as Provider[],
    );
}
