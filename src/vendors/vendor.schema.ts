import {model, Schema, SchemaOptions} from 'mongoose';
import {CryptoService, MongooseUtils, UtilsService} from '../common';
import {BusinessType, IVendorModel} from './vendor.types';

const options: SchemaOptions = {
    minimize: false,
    strict: true,
    selectPopulatedPaths: false,
    timestamps: {
        createdAt: 'crAt',
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

export const VendorModel = model<IVendorModel>('VendorModel', VendorSchema, 'vendors');