import {Global, Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppConfigService} from './AppConfig.service';

@Global()
@Module({
    providers: [AppConfigService],
    imports: [ConfigModule.forRoot({
        expandVariables: true
    })],
    exports: [AppConfigService]
})
export class AppConfigModule {}