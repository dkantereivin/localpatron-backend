import {HttpModule, Module} from '@nestjs/common';
import {VendorController} from './vendor.controller';
import {DiscordModule} from '../common/discord';
import {VendorService} from './Vendor.service';

@Module({
    controllers: [VendorController],
    providers: [VendorService],
    imports: [HttpModule, DiscordModule],
    exports: [HttpModule]
})
export class VendorModule {}