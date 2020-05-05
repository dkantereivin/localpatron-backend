import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import {NestExpressApplication} from '@nestjs/platform-express';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as mongoose from 'mongoose';

import {AppModule} from './App.module';
import {AppConfigService} from './AppConfig';


async function runServer() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ['log', 'error', 'warn', 'debug', 'verbose']
    });

    const config: AppConfigService = app.get(AppConfigService);

    await mongoose.connect(config.db.url, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
        })
        .then(() => console.log('Connected to the DB.'))
        .catch((err: Error) => {throw err;});


    app.use(helmet());
    app.use(rateLimit(config.rateLimit));
    app.enableCors(config.cors);
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        }
    }));

    await app.listen(config.port);
}

runServer()
    .then(() => console.log(`Listening on PORT ${process.env.PORT}`))
    .catch((err: Error) => {
        throw err;
    });