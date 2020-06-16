import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {IExtVendorModel, IVendor, User, USER_ROLE} from './vendor.types';
import {VENDOR_ADMIN_SELECT, ExtVendorModel, PUBLIC_SELECT, VendorModel} from './vendor.schema';
import {FullVendorDto} from './vendor.dto';
import {CryptoService} from '../common';



@Injectable()
export class VendorService {
    constructor(private cryptoService: CryptoService) {}

    async fetchVendorByName(uname: string, isAdmin: boolean): Promise<Partial<IVendor> | null> {
        const query: Partial<IVendor> = isAdmin ? {uname} : {uname, active: true};
        const select: string = isAdmin ? VENDOR_ADMIN_SELECT : PUBLIC_SELECT;
        const vendor: any = await VendorModel.findOne(query, select).lean();
        if (vendor && vendor.users) {
            if (isAdmin)
                vendor.users.every((u: User) => delete u.pass);
            else
                delete vendor.users;
        }
        return vendor;
    }

    // TODO[LOW]: Finish testing and potentially rewrite to use Model.replaceOne(), as current version always overwrites object.
    async createExternalVendor(vendorDto: FullVendorDto, ip: string) {
        if (!CryptoService.checkPswdStrength(vendorDto.usr.pass)) return;
        await VendorModel.deleteOne({'place.pid': vendorDto.place.pid});
        return ExtVendorModel.create({
            ...vendorDto,
            uname: vendorDto.name,
            author: {
                ip,
                loc: vendorDto.loc
            },
            users: [{
                ...vendorDto.usr,
                ip: [ip],
                role: USER_ROLE.OWNER,
                pass: await this.cryptoService.hashString(vendorDto.usr.pass)
            }]
        }).catch(() => {
            throw new HttpException('Error on DB Insertion', HttpStatus.INTERNAL_SERVER_ERROR);
        });
    }
}