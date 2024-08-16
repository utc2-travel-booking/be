import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import {
    FormBuilderDocument,
    FormBuilder,
} from './entities/form-builders.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model } from 'mongoose';
import { CreateFormBuildersDto } from './dto/create-form-builders.dto';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class FormBuilderService extends BaseService<
    FormBuilderDocument,
    FormBuilder
> {
    constructor(
        @InjectModel(COLLECTION_NAMES.FORM_BUILDER)
        private readonly formBuildersModel: Model<FormBuilderDocument>,
        moduleRef: ModuleRef,
    ) {
        super(
            formBuildersModel,
            FormBuilder,
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
