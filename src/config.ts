import * as dotenv from 'dotenv';

export interface IMongoConfig {
	mongodbUsername: string;
	mongodbPassword: string;
	mongodbHost: string;
	mongodbPort: number;
	dbName: string;
	mongodbAuthSource: string;
}

const getMongoConfig = (): IMongoConfig => {
	return {
		mongodbUsername: process.env.MONGODB_USERNAME || '',
		mongodbPassword: process.env.MONGODB_PASSWORD || '',
		mongodbHost: process.env.MONGODB_HOST || 'localhost',
		mongodbPort: parseInt(process.env.MONGODB_PORT || '27017', 10),
		dbName: process.env.MONGODB_DB_NAME || 'test',
		mongodbAuthSource: process.env.MONGODB_AUTHSOURCE || 'admin',
	};
};

export interface IConfig {
	port: number;
	mongoURL: string;
	mongo: IMongoConfig;
	redisURL: string;
	// email: {
	// 	from: string;
	// 	smtp: {
	// 		host: string;
	// 		port: number;
	// 		secure: boolean;
	// 		auth: {
	// 			user: string;
	// 			pass: string;
	// 		};
	// 	};
	// 	subject: string;
	// };
}

dotenv.config();

const config = (): IConfig => {
	const mongoURL = process.env.MONGODB_URL;
	const mongoConfig = getMongoConfig();
	const redisURL = process.env.REDIS_URL;
	if (!mongoURL || mongoURL === '') throw new StartupError('MongoDB URL was not provided in environment variable');
	if (!redisURL || redisURL === '') throw new StartupError('Redis URL was not provided in environment variable');

	return {
		port: parseInt(process.env.PORT, 10) || 3000,
		mongoURL,
		mongo: mongoConfig,
		redisURL,
		// email: {
		// 	from: process.env.EMAIL_FROM || '"NestJS Boilerplate" <noreply@example.com>',
		// 	smtp: {
		// 		host: process.env.EMAIL_HOST || 'smtp.example.com',
		// 		port: parseInt(process.env.EMAIL_PORT, 10) || 587,
		// 		secure: false, // true for 465, false for other ports
		// 		auth: {
		// 			user: process.env.EMAIL_USER || 'user@example.com',
		// 			pass: process.env.EMAIL_PASS || 'password',
		// 		},
		// 	},
		// 	subject: process.env.EMAIL_SUBJECT || 'Your Email Subject',
		// },
	};
};

export class StartupError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'StartupError';
	}
}

export default config();
