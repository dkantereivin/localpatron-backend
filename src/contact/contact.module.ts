import {HttpModule, Module} from '@nestjs/common';
import {ContactController} from './contact.controller';
import {DiscordModule} from '../common/discord';

@Module({
    controllers: [ContactController],
    imports: [HttpModule, DiscordModule],
    exports: [HttpModule]
})
export class ContactModule {}