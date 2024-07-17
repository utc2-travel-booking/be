import { S3Service, S3ServiceProvider } from './s3.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [],
    providers: [S3Service, S3ServiceProvider],
    exports: [S3Service, S3ServiceProvider],
})
export class S3Module {}
