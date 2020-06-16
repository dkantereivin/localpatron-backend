import {Document} from 'mongoose';

enum BusinessType {
    RESTAURANT
}

enum USER_ROLE {
    STAFF,
    MANAGER,
    OWNER
}

interface User {
    ip: string[];
    role: USER_ROLE;
    email: string;
    pass: string;
    first: string;
    last: string;
}

interface IVendor {
    active: boolean;
    btype: 're'; // businessType (restaurant)
    ftype: string; // foodType
    vid: string; // vendorID
    name: string;
    uname: string;
    phone: string;
    place: {
        pid: string;
        addr: string;
        coords: { lat: number; lng: number; };
    };
    ext: { // externals
        wb: string; // website
        cl: string; // cardLink
        dd: string; // doordash
        ue: string; // ubereats
        ye: string; // yelp
        fb: string;
        ig: string;
        tt: string; // twitter
    };
    author: {
        ip: string;
        loc: { lat: number; lng: number; };
    };
    crAt: Date;
    upAt: Date;
}

interface IExtVendor extends IVendor {
    users: User[];
    description: string;
}

interface IFullVendor extends IExtVendor {
    billing: any;
    cardPrice: {
        min: number;
        max: string;
    };
}

interface IVendorModel extends IVendor, Document {}
interface IExtVendorModel extends IExtVendor, Document {}
interface IFullVendorModel extends IFullVendor, Document {}

export {
    BusinessType,
    USER_ROLE,
    User,
    IVendor,
    IExtVendor,
    IFullVendor,
    IVendorModel,
    IExtVendorModel,
    IFullVendorModel
};
