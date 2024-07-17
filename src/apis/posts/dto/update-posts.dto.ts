import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-posts.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}
