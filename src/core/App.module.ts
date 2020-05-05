import {Module} from '@nestjs/common';

import {VendorModule} from '../vendors/vendor.module';
import {AuthModule} from './Auth';
import {AppConfigModule} from './AppConfig';
import {ContactModule} from '../contact/contact.module';


@Module({
    controllers: [],
    providers: [],
    imports: [
        ContactModule,
        VendorModule,
        AuthModule,
        AppConfigModule
    ],
    exports: []
})
export class AppModule {
}
