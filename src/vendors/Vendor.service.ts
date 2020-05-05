import {Injectable} from '@nestjs/common';
import {IVendor} from './vendor.types';
import {VendorModel} from './vendor.schema';

const PUBLIC_SELECT: string = '-crAt -upAt -__v -_id';
const ADMIN_SELECT: string = '+author.ip +author.loc.lat +author.loc.lng';

@Injectable()
export class VendorService {
    async fetchVendorByName(uname: string, isAdmin: boolean): Promise<Partial<IVendor> | null> {
        const query: Partial<IVendor> = isAdmin ? {uname} : {uname, active: true};
        const select: string = isAdmin ? ADMIN_SELECT : PUBLIC_SELECT;
        return VendorModel.findOne(query, select).lean();
    }
}