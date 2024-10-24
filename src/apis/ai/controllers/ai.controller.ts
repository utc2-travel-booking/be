import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { COLLECTION_NAMES } from 'src/constants';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { PERMISSION, Resource, SuperAuthorize } from '@libs/super-authorize';
import { SuperPost } from '@libs/super-core';
import { AIService } from '../ai.service';
import { EmbedTextDto } from '../dto/embed.dto';
import { QdrantDto } from '../dto/qdrant.dto';
import { TypeInputEmbed } from '../constant';

@Controller('ais')
@Resource('ais')
@ApiTags('Front: AI')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.AI,
})
export class AIController {
    constructor(private readonly aiService: AIService) {}

    @SuperPost({ route: 'embed', dto: EmbedTextDto })
    @SuperAuthorize(PERMISSION.POST)
    async embed(@Body() embedTextDto: EmbedTextDto) {
        const { text, urlImg, type } = embedTextDto;
        const result = await this.aiService.embedding(text, type);
        return result;
    }

    @SuperPost({ route: 'qdrant', dto: QdrantDto })
    @SuperAuthorize(PERMISSION.POST)
    async add(@Body() qdrantDto: QdrantDto) {
        const result = await this.aiService.add(qdrantDto.vectors, {
            urlImg: qdrantDto.urlImg,
            textImg: qdrantDto.textImg,
        });
        return result;
    }
}
