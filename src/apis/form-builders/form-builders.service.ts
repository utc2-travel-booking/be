import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import {
    FormBuilderDocument,
    FormBuilders,
} from './entities/form-builders.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model } from 'mongoose';
import { CreateFormBuildersDto } from './dto/create-form-builders.dto';
import { ModuleRef } from '@nestjs/core';
import { UserPayload } from 'src/base/models/user-payload.model';

@Injectable()
export class FormBuilderService extends BaseService<
    FormBuilderDocument,
    FormBuilders
> {
    constructor(
        @InjectModel(COLLECTION_NAMES.FORM_BUILDER)
        private readonly formBuildersModel: Model<
            FormBuilderDocument,
            FormBuilders
        >,
        moduleRef: ModuleRef,
    ) {
        super(
            formBuildersModel,
            FormBuilders,
            COLLECTION_NAMES.FORM_BUILDER,
            moduleRef,
        );
    }
    async createOne(createFormBuilderDto: CreateFormBuildersDto) {
        const result = new this.model({
            ...createFormBuilderDto,
        });
        await this.create(result);

        return result;
    }
}
