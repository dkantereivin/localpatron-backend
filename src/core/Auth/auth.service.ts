import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {VENDOR_ADMIN_SELECT, ExtVendorModel, IExtVendorModel, User, VendorModel} from '../../vendors';
import {CryptoService} from '../../common/crypto';
import {Document} from 'mongoose';

@Injectable()
export class AuthService {
    constructor(private cryptoService: CryptoService) {}
    async validateLogin(email: string, pass: string, ip: string): Promise<{vendor: IExtVendorModel, user: User}> {
        const vendor: IExtVendorModel =
            await ExtVendorModel.findOne({users: {$elemMatch: {email}}}).select(VENDOR_ADMIN_SELECT);

        if (!vendor)
            throw new HttpException('No Matching Email', HttpStatus.UNAUTHORIZED);

        const user: User = vendor.users.find((u: User) => u.email === email);

        if (!await this.cryptoService.comparePswd(pass, user.pass))
            throw new HttpException('Password Incorrect', HttpStatus.UNAUTHORIZED);

        // if (!user.ip.includes(ip)) {
        //     await this.send2FACheck(user);
        //     throw new HttpException('IP Not Recognized, 2FA Sent', HttpStatus.UNAUTHORIZED);
        // }

        return {vendor, user};
    }



    // TODO[MED]: fill 2FA method body. Also required revision of AuthService#validateLogin to activate 2FA.
    async send2FACheck(user: User) {return ;}
}