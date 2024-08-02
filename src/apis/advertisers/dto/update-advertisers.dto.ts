import { PartialType } from '@nestjs/swagger';
import { CreateAdvertiserDto } from './create-advertisers.dto';

export class UpdateAdvertiserDto extends PartialType(CreateAdvertiserDto) {}
