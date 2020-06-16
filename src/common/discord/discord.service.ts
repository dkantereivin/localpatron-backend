import {HttpException, HttpService, HttpStatus, Injectable} from '@nestjs/common';
import {AppConfigService, DiscordOptions} from '../../core/AppConfig';
import {IVendorModel} from '../../vendors';
import {AxiosResponse} from 'axios';

@Injectable()
export class DiscordService {
    private static readonly defaultHeaders = {
        'Content-Type': 'application/json'
    };
    private readonly options: DiscordOptions;

    constructor(private httpService: HttpService,
                private appConfigService: AppConfigService)
    {
        this.options = appConfigService.discord;
    }

    async sendToVerificationQueue(vendor: IVendorModel): Promise<void> {
        const content =
`**New Vendor For Verification**
__ID:__ \`${vendor.id}\`
__Name:__ \`${vendor.name}\`
__Unique Name:__ \`${vendor.uname}\``;
        await this.sendMessage('verification', content);
    }

    async createTicket({name, email, message}): Promise<void> {
        const content =
`**New Support Ticket Created**
__Name:__ \`${name}\`
__Email:__ \`${email}\`
__Message:__\n\`\`\`${message}\`\`\``;

        await this.sendMessage('contactUs', content);

    }

    private async sendMessage(hookName: keyof DiscordOptions['webHooks'], content: string): Promise<AxiosResponse<any>>{
        const headers = DiscordService.defaultHeaders;
        return this.httpService.post(this.options.webHooks[hookName], {content}, {headers})
            .toPromise()
            .catch(() => {
                throw new HttpException('Failed to Communicate with Discord', HttpStatus.BAD_GATEWAY);
            });
    }
}