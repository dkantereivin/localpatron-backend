import {Controller, Body, Post, UseGuards, Param} from '@nestjs/common';
import {ReCaptchaGuard} from '../common/guards';
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