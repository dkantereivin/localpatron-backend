import {HttpModule, HttpService, Module} from '@nestjs/common';
import {DiscordService} from './discord.service';

@Module({
    providers: [DiscordService],
    imports: [HttpModule],
    exports: [DiscordService]
})
export class DiscordModule {}