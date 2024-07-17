import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('roles')
@ApiTags('Admin: Roles')
export class RolesController {}
