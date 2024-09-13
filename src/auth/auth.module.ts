import { Module } from '@nestjs/common';
import { AuthInternalController } from './controllers/auth.internal.controller';
import { AuthService } from './services/auth.service';

@Module({
	imports: [],
	controllers: [AuthInternalController],
	providers: [AuthService],
})
export class AuthModule {}
