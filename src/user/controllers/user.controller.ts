import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';

@ApiTags('User Related Operations')
@Controller('communication')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('users')
	@ApiBody({
		type: String,
		schema: {
			type: 'object',
			properties: {
				id: { type: 'string' },
			},
		},
	})
	async getAllUserExceptLoginUser(@Body() body: { id: string }) {
		return await this.userService.getAllUserExceptLoginUser(body);
	}

	@Get('user-details/:id')
	@ApiParam({ type: String, name: 'id', required: true })
	async getUserDetails(@Param('id') id: string) {
		return await this.userService.getUserDetails(id);
	}
}
