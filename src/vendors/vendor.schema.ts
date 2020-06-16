import {model, Schema, SchemaOptions} from 'mongoose';
import {CryptoService, MongooseUtils, UtilsService} from '../common';
import {BusinessType, IExtVendorModel, IVendorModel} from './vendor.types';

const options: SchemaOptions = {
    strict: true,
    selectPopulatedPaths: false,
    timestamps: {
        createdAt: 'author.crAt',
        updatedAt: 'upAt'
    }
};

const VendorSchema = new Schema({
    vid: {
        ...MongooseUtils.Str,
        index: true,
        unique: true,
        minlength: 14,
        maxlength: 14,
        default: () => CryptoService.randomStringToken(14),
    },
    name: {
        ...MongooseUtils.Str,
        minlength: 2,
        maxlength: 32
    },
    uname: {
        ...MongooseUtils.Str,
        index: true,
        unique: true,
        lowercase: true,
        set: (name: string) => name.replace(/ /g, '-')
    },
    phone: {
        ...MongooseUtils.Str,
        select: false,
        set: UtilsService.formatPhoneNumber
    },
    place: {
        pid: {
            ...MongooseUtils.Str,
            unique: true
        },
        addr: MongooseUtils.Str,
        coords: {
            lat: MongooseUtils.Num,
            lng: MongooseUtils.Num
        }
    },
    ext: {
        wb: MongooseUtils.Url,
        cl: MongooseUtils.Url,
        ue: MongooseUtils.Url,
        dd: MongooseUtils.Url,
        ye: MongooseUtils.Url,
        fb: MongooseUtils.Url,
        ig: MongooseUtils.Url,
        tt: MongooseUtils.Url

    },
    active: MongooseUtils.Bool,
    ftype: {
        ...MongooseUtils.Str,
        maxlength: 32
    },
    btype: {
        ...MongooseUtils.Num,
        default: BusinessType.RESTAURANT
    },
    author: {
        ip: {
            ...MongooseUtils.Str,
            select: false
        },
        loc: {
            lat: {
                ...MongooseUtils.Num,
                select: false
            },
            lng: {
                ...MongooseUtils.Num,
                select: false
            }
        }
    }
}, options);

const UserSchema = new Schema({
    ip: [{...MongooseUtils.Str, select: false}],
    role: {
        ...MongooseUtils.Num,
        select: false
    },
    email: {
        ...MongooseUtils.Str,
        select: false,
        lowercase: true,
        unique: true
    },
    pass: {
        ...MongooseUtils.Str,
        maxlength: 1024,
        select: false
    },
    first: {
        ...MongooseUtils.Str,
        select: false
    },
    last: {
        ...MongooseUtils.Str,
        select: false
    }
});

const ExternalVendorSchema = new Schema({
    profile: {
        description: {
            ...MongooseUtils.Str,
            maxlength: 200,
            required: false,
            default: ''
        }
    },
    users: [UserSchema]
});

export const VendorModel = model<IVendorModel>('VendorModel', VendorSchema, 'vendors');
export const ExtVendorModel = VendorModel.discriminator<IExtVendorModel>('ExtVendorModel', ExternalVendorSchema, 'EX');

export const PUBLIC_SELECT: string =
    '-author.crAt -upAt -__v -_id' +
    '-users.ip -users.first -users.last -users._id -users.email -users.pass -users.role';
export const VENDOR_ADMIN_SELECT: string = '+author.ip +author.loc.lat +author.loc.lng ' +
    '+users.ip +users.first +users.last +users._id +users.email +users.pass +users.role';