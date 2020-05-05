import {Global, HttpModule, Module} from '@nestjs/common';
import {AuthController} from './auth.controller';

@Global()
@Module({
    controllers: [AuthController],
    providers: [],
    imports: [],
    exports: []
})
export class AuthModule {}