import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Req,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { MediaService } from 'src/apis/media/medias.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadMediaDto } from 'src/apis/media/dto/upload-media.dto';
import { IUploadedMulterFile } from 'src/packages/s3/s3.service';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { File } from 'src/apis/media/entities/files.entity';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';
import { Authorize } from 'src/decorators/authorize.decorator';
import { COLLECTION_NAMES, PERMISSIONS } from 'src/constants';
import { UserPayload } from 'src/base/models/user-payload.model';
import { appSettings } from 'src/configs/appsettings';
import { SuperCache } from 'src/packages/super-cache/decorators/super-cache.decorator';

@ApiTags('Admin: Media')
@Controller('media')
@SuperCache({
    mainCollectionName: COLLECTION_NAMES.FILE,
    relationCollectionNames: [COLLECTION_NAMES.USER],
})
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Get()
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.FILE.index)
    async getAll(
        @Query(new PagingDtoPipe<File>())
        queryParams: ExtendedPagingDto<File>,
    ) {
        const result = await this.mediaService.getAll(queryParams);
        return result;
    }

    @Get(':id')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.FILE.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.mediaService.getOne(_id);
        return result;
    }

    @Post()
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadMediaDto })
    @Authorize(PERMISSIONS.FILE.create)
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fileSize: 1024 * 1024 * appSettings.maxFileSize.admin,
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

    @Delete()
    @Authorize(PERMISSIONS.FILE.destroy)
    @ApiBearerAuth()
    @ApiQuery({ name: 'ids', type: [String] })
    async deletes(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        const result = await this.mediaService.deletes(_ids, user);
        return result;
    }
}
