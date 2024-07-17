import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Front: Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
}
