import {AppConfigService} from '../AppConfig';
import {NestSessionOptions} from 'nestjs-session';
import * as connectMongo from 'connect-mongo';
import * as session from 'express-session';
import * as mongoose from 'mongoose';

const MongoStore = connectMongo(session);

export const useFactory = (config: AppConfigService): NestSessionOptions => ({
    session: {
        secret: config.session.secret,
        name: 'lp.sid',
        cookie: {

            signed: true,
            secure: config.isProduction,
            maxAge: config.session.maxAge
        },
        resave: true,
        rolling: true,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: mongoose.createConnection(config.db.url, config.db.options),
            ttl: config.session.maxAge
        })
    }
});