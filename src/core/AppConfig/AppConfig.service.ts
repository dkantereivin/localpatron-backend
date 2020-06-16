import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {MongooseConnectionOptions, MongoUrlOptions} from 'connect-mongo';

@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService) {
    }

    get session() {
        return {
            secret: this.getVar('SESSION_SECRET'),
            maxAge: parseInt(this.getVar('SESSION_TTL'), 10)
        };
    }

    get isProduction(): boolean {
        return this.getVar('NODE_ENV') === 'production';
    }

    get saltRounds(): number {
        return parseInt(this.getVar('PSWD_SALT_ROUNDS'), 10);
    }

    get isHTTPS(): boolean {
        return this.getVar('PROTOCOL') === 'https';
    }

    get port(): number {
        const envPort: string | undefined = this.getVar('PORT');
        return parseInt(envPort, 10) || this.defaultPort;
    }

    get captchaSecret(): string {
        return this.getVar('CAPTCHA_SECRET');
    }

    get rateLimit(): RateLimitOptions {
        const max: number = parseInt(this.getVar('RATE_MAX'), 10);
        const windowMs: number = parseInt(eval(this.getVar('RATE_WINDOW')), 10);
        const message: string | object = JSON.parse(this.getVar('RATE_MESSAGE')) || this.getVar('RATE_MESSAGE');
        if (isNaN(max) || isNaN(windowMs))
            throw Error('Improperly configured rate limit variables.');
        return {
            max, windowMs, message,
            headers: this.getVar('RATE_HEADERS') === 'true'
        };
    }

    get cors(): CorsOptions {
        return {
            origin: this.getVar('CORS_ORIGIN'),
            preflightContinue: this.getVar('CORS_PREFLIGHT') === 'TRUE',
            methods: this.getVar('CORS_METHODS')
        };
    }

    get db(): DBOptions {
        return {
            url: this.getVar('DB_URL'),
            username: this.getVar('DB_USER'),
            password: this.getVar('DB_PASS'),
            options: {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true
            }
        };
    }

    get discord(): DiscordOptions {
        const baseUrl = this.getVar('DISCORD_BASE_URL');
        return {
            webHooks: {
                baseUrl,
                verification: baseUrl + this.getVar('DISCORD_VERIFICATION'),
                contactUs: baseUrl + this.getVar('DISCORD_CONTACT_US')
            }
        };
    }

    private get defaultPort(): number {
        return this.isHTTPS ? 43 : 80;
    }

    getVar(param: string): string {
        return this.configService.get(param);
    }
}

interface RateLimitOptions {
    max: number;
    windowMs: number;
    message: string | any;
    headers: boolean;
}

interface CorsOptions {
    origin: string | string[] | RegExp | RegExp[];
    preflightContinue: boolean;
    methods: string | string[];
}

interface DBOptions {
    url: string;
    username: string;
    password: string;
    options: any;
}

export interface DiscordOptions {
    webHooks: {
        baseUrl: string;
        verification: string;
        contactUs: string;
    };
}