import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUploadedMulterFile, S3Service } from 'src/packages/s3/s3.service';
import { readFileFromUrl } from 'src/packages/s3/utils';
import { File, FileDocument } from './entities/files.entity';
import { Model } from 'mongoose';
import { BaseService } from 'src/base/service/base.service';
import { COLLECTION_NAMES } from 'src/constants';
import { UserPayload } from 'src/base/models/user-payload.model';
import { appSettings } from 'src/configs/appsettings';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class MediaService extends BaseService<FileDocument, File> {
    constructor(
        @InjectModel(COLLECTION_NAMES.FILE)
        private readonly fileModel: Model<FileDocument>,
        private readonly s3Service: S3Service,
        moduleRef: ModuleRef,
    ) {
        super(fileModel, File, COLLECTION_NAMES.FILE, moduleRef);
    }

    async createFile(
        file: IUploadedMulterFile,
        user: UserPayload,
        folder: string = appSettings.s3.folder,
    ) {
        const uploadedFile = await this.s3Service.uploadPublicFile(
            file,
            folder,
        );

        if (!uploadedFile) {
            throw new BadRequestException('Can not upload image');
        }

        const { fieldName, originalname, mimetype, size } = file;

        const result = new this.fileModel({
            filename: fieldName,
            name: originalname,
            alt: originalname,
            mime: mimetype,
            size,
            filePath: uploadedFile.url,
            folder,
            createdBy: user._id,
        });
        await this.create(result);

        return result;
    }

    async readFileFromUrl(url: string) {
        const data = await readFileFromUrl(url);
        if (!data) throw new BadRequestException('Can not read image');

        return data;
    }

    async deleteMedia(fileName: string) {
        const uploadedAvatar = await this.s3Service.deletePublicFile(
            fileName,
            'marketplace',
        );
        if (!uploadedAvatar)
            throw new BadRequestException('Can not delte image');

        return uploadedAvatar;
    }
}
