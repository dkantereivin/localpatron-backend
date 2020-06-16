import {Global, Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {CryptoModule} from '../../common/crypto';
import {SessionModule} from 'nestjs-session';
import {AppConfigService} from '../AppConfig';
import {useFactory} from './session.config';

@Global()
@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        CryptoModule,
        SessionModule.forRootAsync({
            inject: [AppConfigService],
            useFactory
        })
    ],
    exports: []
})
export class AuthModule {}