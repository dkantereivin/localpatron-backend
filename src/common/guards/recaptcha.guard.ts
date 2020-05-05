import {CanActivate, ExecutionContext, HttpService, Injectable} from '@nestjs/common';
import {Request} from 'express';
import {AppConfigService} from '../../core';
import {AxiosResponse} from 'axios';

const CAPTCHA_URL: string = 'https://www.google.com/recaptcha/api/siteverify';

@Injectable()
export class ReCaptchaGuard implements CanActivate {
    constructor(private readonly httpService: HttpService,
                private readonly appConfig: AppConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();
        const params = {
            secret: this.appConfig.captchaSecret,
            response: req.get('Captcha-Key') || req.body.captchaKey
        };
        delete req.body.captchaKey;
        const {data}: AxiosResponse<GoogleResponse> =
            await this.httpService.get(CAPTCHA_URL, {params}).toPromise();

        return data.success;
    }
}

interface GoogleResponse {
    'success': boolean;
    'challenge_ts': string;
    'hostname': string;
    'error-codes': string[];
}