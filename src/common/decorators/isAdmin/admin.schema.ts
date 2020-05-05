import {Document, Schema, model, Model} from 'mongoose';
import {CryptoService, MongooseUtils} from '../../';

export enum Permissions {
    APPROVE,
    ADMIN,
    SUPERADMIN
}


export interface IAdmin {
    name: string;
    apiKey: string;
    permissions: Permissions;
}

export interface IAdminModel extends IAdmin, Document {}

const AdminSchema = new Schema({
    name: MongooseUtils.Str,
    key: {
        ...MongooseUtils.Str,
        default: () => CryptoService.randomStringToken(32)
    },
    permissions: MongooseUtils.Num
});

export const AdminModel: Model<IAdminModel> = model('AdminModel', AdminSchema, 'admins');