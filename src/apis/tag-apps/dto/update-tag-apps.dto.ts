import { PartialType } from '@nestjs/swagger';
import { CreateTagAppDto } from './create-tag-apps.dto';

export class UpdateTagAppDto extends PartialType(CreateTagAppDto) {}
