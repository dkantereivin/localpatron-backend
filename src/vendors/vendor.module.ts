import {HttpModule, Module} from '@nestjs/common';
import {VendorController} from './vendor.controller';
import {DiscordModule, CryptoModule} from '../common';
import {VendorService} from './vendor.service';

@Module({
    controllers: [VendorController],
    providers: [VendorService],
    imports: [HttpModule, DiscordModule, CryptoModule],
    exports: [HttpModule]
})
export class VendorModule {}