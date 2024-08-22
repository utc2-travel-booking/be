import 'reflect-metadata';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CreateAppDto } from 'src/apis/apps/dto/create-app.dto';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { GlobalParametersStorage } from '@nestjs/swagger/dist/storages/global-parameters.storage';

@Injectable()
export class DataTransferObjectsService implements OnModuleInit {
    constructor(private readonly reflector: Reflector) {}

    onModuleInit() {}

    getAllDtoMetadata(dtoClass?: any, propertyName?: string) {
        if (dtoClass) {
            if (propertyName) {
                return Reflect.getMetadata(
                    'swagger/apiModelProperties',
                    dtoClass.prototype,
                    propertyName,
                );
            } else {
                const propertyKeys = Object.getOwnPropertyNames(
                    dtoClass.prototype,
                );
                return propertyKeys.reduce((acc, key) => {
                    const propertyMetadata = Reflect.getMetadata(
                        'swagger/apiModelProperties',
                        dtoClass.prototype,
                        key,
                    );
                    if (propertyMetadata) {
                        acc[key] = propertyMetadata;
                    }
                    return acc;
                }, {});
            }
        } else {
            return {};
        }
    }
}
