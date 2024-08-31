import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import config from './config';

const setupSwagger = (app: INestApplication) => {
	const options = new DocumentBuilder()
		.setTitle('Nest js Boilerplate')
		.setDescription('Nest js Boilerplate HTTP API docs')
		.addBearerAuth({ description: 'User JWT Token', type: 'http', name: 'Authorization', bearerFormat: 'JWT' })
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api', app, document, {
		swaggerOptions: { persistAuthorization: true },
	});
};

async function bootstrap() {
	const logger = new Logger('Startup', { timestamp: true });
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

	app.enableCors({
		origin: '*',
	});
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	if (process.env.NODE_ENV !== 'production') {
		setupSwagger(app);
	}

	const redisUrl = new URL(config.redisURL);

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.REDIS,
		options: {
			host: redisUrl.hostname,
			port: parseInt(redisUrl.port, 10),
		},
	});

	await app.startAllMicroservices();
	logger.log('Connected to Redis');
	await app.listen(config.port, '0.0.0.0', (err) => {
		if (err) logger.error(err.message, err.stack, err.name);
		logger.log(`APP Started on Port http://localhost:${config.port}/api`);
	});
}
bootstrap();
