import { PartialType } from '@nestjs/swagger';
import { CreatePagesDto } from './create-pages.dto';

export class UpdatePagesDto extends PartialType(CreatePagesDto) {}
