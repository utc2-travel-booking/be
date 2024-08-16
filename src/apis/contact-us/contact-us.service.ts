import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { ContactUsDocument, ContactUs } from './entities/contact-us.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model } from 'mongoose';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { ModuleRef } from '@nestjs/core';
import { UserPayload } from 'src/base/models/user-payload.model';

@Injectable()
export class ContactUsService extends BaseService<
    ContactUsDocument,
    ContactUs
> {
    constructor(
        @InjectModel(COLLECTION_NAMES.CONTACT_US)
        private readonly contactUsModel: Model<ContactUsDocument>,
        moduleRef: ModuleRef,
    ) {
        super(
            contactUsModel,
            ContactUs,
            COLLECTION_NAMES.CONTACT_US,
            moduleRef,
        );
    }
    async createOne(
        createContactUsDto: CreateContactUsDto,
        user: UserPayload,
        options?: Record<string, any>,
    ) {
        const { _id: userId } = user;

        const result = new this.model({
            ...createContactUsDto,
            ...options,
            createdBy: userId,
        });
        await this.create(result);

        return result;
    }
}
