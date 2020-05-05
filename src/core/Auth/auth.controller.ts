import {Controller, Post, UseGuards} from '@nestjs/common';

@Controller('auth')
export class AuthController {
    @Post('vendor')
    loginUser() {
        return 'Success';
    }
}