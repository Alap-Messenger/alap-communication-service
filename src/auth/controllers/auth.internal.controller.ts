import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthInternalController {
	constructor(private readonly authService: AuthService) {}

	@MessagePattern({ cmd: 'AUTH_INTERNAL_USER' })
	async authenticateInternalUser(@Body() data: any) {
		return await this.authService.authenticateInternalUser(data);
	}
}
