import {Body, Controller, Ip, Post, Request} from '@nestjs/common';
import {LoginFormDto} from './auth.dto';
import {IExtVendorModel} from '../../vendors';
import {AuthService} from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async loginUser(@Body() {email, pass}: LoginFormDto, @Ip() ip: string, @Request() req) {
        const {vendor, user} =
            await this.authService.validateLogin(email, pass, ip);
            req.session.vid = vendor.vid;
            req.session.email = user.email;
            req.session.role = user.role;
            req.session.ip = ip;

            return {success: true, session: req.session};
    }
}