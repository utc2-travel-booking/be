import { Controller, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { COLLECTION_NAMES } from 'src/constants';
import { appSettings } from 'src/configs/appsettings';
import { FileInterceptor } from '@nestjs/platform-express';
import { IUploadedMulterFile } from 'src/packages/s3/s3.service';
import { UserPayload } from 'src/base/models/user-payload.model';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { UploadMediaDto } from '../dto/upload-media.dto';
import { MediaService } from '../medias.service';
import { SuperPost } from '@libs/super-core/decorators/super-post.decorator';
import { SuperAuthorize } from '@libs/super-authorize/decorators/authorize.decorator';
import { Resource } from '@libs/super-authorize';

@Controller('media')
@Resource('media')
@ApiTags('Front: Media')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.FILE,
})
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @SuperPost({ dto: UploadMediaDto })
    @ApiConsumes('multipart/form-data')
    @SuperAuthorize()
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
