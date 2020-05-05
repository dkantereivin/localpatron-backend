import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {Request} from 'express';
import {AdminModel, IAdmin, Permissions} from './admin.schema';

export const IsAdmin = createParamDecorator(
    async (data: number = Permissions.ADMIN, ctx: ExecutionContext): Promise<boolean> => {
        const req: Request = ctx.switchToHttp().getRequest();
        const key: string = req.get('Admin-Token');
        if (!key || key.length < 16)
            return false;
        const {permissions}: IAdmin | {permissions: number} =
            await AdminModel.findOne({key}).lean() || {permissions: -1};
        return permissions > data;
    }
);