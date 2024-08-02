import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdvertisersService } from '../advertisers.service';
import { Types } from 'mongoose';
import { UserPayload } from 'src/base/models/user-payload.model';
import { PERMISSIONS } from 'src/constants';
import { Authorize } from 'src/decorators/authorize.decorator';
import {
    PagingDtoPipe,
    ExtendedPagingDto,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';
import { CreateAdvertiserDto } from '../dto/create-advertisers.dto';
import { UpdateAdvertiserDto } from '../dto/update-advertisers.dto';
import { Advertiser } from '../entities/advertisers.entity';

@Controller('advertisers')
@ApiTags('Admin: Advertisers')
export class AdvertisersControllerAdmin {
    constructor(private readonly advertisersService: AdvertisersService) {}

    @Get()
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.ADVERTISER.index)
    async getAll(
        @Query(new PagingDtoPipe<Advertiser>())
        queryParams: ExtendedPagingDto<Advertiser>,
    ) {
        const result = await this.advertisersService.getAll(queryParams);
        return result;
    }

    @Get(':id')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.ADVERTISER.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.advertisersService.getOne(_id);
        return result;
    }

    @Post()
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.ADVERTISER.create)
    async create(
        @Body() createAdvertiserDto: CreateAdvertiserDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.advertisersService.createOne(
            createAdvertiserDto,
            user,
        );
        return result;
    }

    @Put(':id')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.ADVERTISER.edit)
    @ApiParam({ name: 'id', type: String })
    async update(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Body() updateAdvertiserDto: UpdateAdvertiserDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.advertisersService.updateOneById(
            _id,
            updateAdvertiserDto,
            user,
        );

        return result;
    }

    @Delete()
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.ADVERTISER.destroy)
    @ApiQuery({ name: 'ids', type: [String] })
    async deletes(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.advertisersService.deletes(_ids, user);
        return result;
    }
}
