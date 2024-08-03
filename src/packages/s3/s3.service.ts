import {
    BadRequestException,
    Inject,
    Injectable,
    Logger,
    Provider,
} from '@nestjs/common';
import AWS from 'aws-sdk';
import { appSettings } from 'src/configs/appsettings';
export const S3ServiceLib = 'lib:s3';

export interface IUploadedMulterFile {
    fieldName: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

const S3 = new AWS.S3({
    secretAccessKey: appSettings.s3.secretKey,
    accessKeyId: appSettings.s3.accessKey,
});

export const S3ServiceProvider: Provider<AWS.S3> = {
    provide: S3ServiceLib,
    useValue: S3,
};

@Injectable()
export class S3Service {
    private readonly logger = new Logger('S3Service');
    constructor(@Inject(S3ServiceLib) private readonly s3: AWS.S3) {}

    async uploadPublicFile(file: IUploadedMulterFile, folder: string) {
        try {
            const { buffer, originalname, mimetype } = file;
            const uploadResult = await this.s3
                .upload({
                    Bucket: `${process.env.AWS_BUCKET_NAME}/` + folder,
                    Body: buffer,
                    Key: `${originalname}`,
                    ACL: 'public-read',
                    ContentType: mimetype,
                })
                .promise();

            return {
                key: uploadResult.Key,
                url: uploadResult.Location,
                mimetype: mimetype,
            };
        } catch (error) {
            this.logger.error(error);
            throw new BadRequestException(error.message);
        }
    }

    async deletePublicFile(fileName: string, folder: string) {
        try {
            const params = {
                Bucket: `${process.env.AWS_BUCKET_NAME}/` + folder,
                Key: `${fileName}`,
            };
            const deleteResult = await this.s3.deleteObject(params).promise();

            return deleteResult;
        } catch (error) {
            this.logger.error(error);
            throw new BadRequestException(error.message);
        }
    }
}
