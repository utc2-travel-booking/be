import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { COLLECTION_NAMES } from 'src/constants';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { PERMISSION, Resource, SuperAuthorize } from '@libs/super-authorize';
import { SuperPost } from '@libs/super-core';
import { AIService } from '../ai.service';
import { EmbedTextDto } from '../dto/embed.dto';

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
        const result = await this.aiService.embedding(embedTextDto.text);
        return result;
    }
}
