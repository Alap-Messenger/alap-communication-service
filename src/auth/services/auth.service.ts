import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
	async authenticateInternalUser({ token }: { token: string }): Promise<boolean> {
		console.log({ token });
		return true;
	}
}
