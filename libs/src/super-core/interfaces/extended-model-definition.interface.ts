import { ModelDefinition } from '@nestjs/mongoose';

export type ExtendedModelDefinition = {
    entity: new () => any;
} & ModelDefinition;
