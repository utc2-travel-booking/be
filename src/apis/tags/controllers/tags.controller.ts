import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TagsService } from '../tags.service';

@Controller('tags')
@ApiTags('Front: Tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}
}
