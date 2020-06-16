import {Body, Controller, Post} from '@nestjs/common';
import {ContactFormDto} from './contact.dto';
import {DiscordService} from '../common/discord';

@Controller('contact')
export class ContactController {
    constructor(private discordService: DiscordService) {}

    // @UseGuards(ReCaptchaGuard)
    @Post()
    async contactForm(@Body() body: ContactFormDto): Promise<any> {
        await this.discordService.createTicket(body);
        return {success: true};
    }
}