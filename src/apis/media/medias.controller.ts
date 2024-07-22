import {
    Controller,
    Post,
    Req,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { MediaService } from './medias.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { Authorize } from 'src/decorators/authorize.decorator';
import { COLLECTION_NAMES, PERMISSIONS_FRONT } from 'src/constants';
import { appSettings } from 'src/configs/appsettings';
import { FileInterceptor } from '@nestjs/platform-express';
import { IUploadedMulterFile } from 'src/packages/s3/s3.service';
import { UserPayload } from 'src/base/models/user-payload.model';
import { SuperCache } from 'src/packages/super-cache/decorators/super-cache.decorator';

@ApiTags('Front: Media')
@Controller('media')
@SuperCache({
    mainCollectionName: COLLECTION_NAMES.FILE,
    relationCollectionNames: [COLLECTION_NAMES.USER],
})
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Post()
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadMediaDto })
    @Authorize(PERMISSIONS_FRONT.FILE.create)
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fileSize: 1024 * 1024 * appSettings.maxFileSize.front,
            },
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/^image\/(jpeg|png)$/)) {
                    return callback(
                        new Error('Only image files are allowed!'),
                        false,
                    );
                }
                callback(null, true);
            },
        }),
    )
    async create(
        @UploadedFile() file: IUploadedMulterFile,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        const result = await this.mediaService.createFile(file, user);
        return result;
    }
}
