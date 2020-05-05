import {Body, Param, Controller, Get, Put, HttpException, HttpStatus, Ip, UseGuards} from '@nestjs/common';
import {VendorModel, IVendorModel, VendorDto, FullVendorDto} from './';
import {IsAdmin, DiscordService, Permissions} from '../common';
import { IVendor } from './vendor.types';
import {VendorService} from './Vendor.service';

/**
 * RESTful Controller for all vendor operations.
 * GET Single Vendor - active = any if admin (by ID or by vendorName)
 * GET List of Vendors
 * PUT community-vendor
 * PUT full-vendor (if already community-vendor, upgrade it)
 * POST profile @Owner
 * POST payment-details @Owner
 * POST verify-email-code @Owner
 * POST reset-password
 * DELETE vendor @Admin @Owner
 */
@Controller('vendor')
export class VendorController {
    constructor(private vendorService: VendorService,
                private discordService: DiscordService) {}

    @Get(':uname')
    async getVendorDetails(@Param('uname') uname: string,
                           @IsAdmin(Permissions.APPROVE) isAdmin: boolean) {
        const res: Partial<IVendor> = await this.vendorService.fetchVendorByName(uname, isAdmin);
        if (res === null)
            throw new HttpException('Vendor Not Found or Not Verified', HttpStatus.NOT_FOUND);
        return res;
    }

    // @UseGuards(ReCaptchaGuard)
    @Put('community-vendor')
    async putCommunityVendor(@Body() createVendorDto: VendorDto, @Ip() ip: string) {
        const vendor: IVendorModel = await VendorModel.create({
            uname: createVendorDto.name,
            author: {
                ip,
                loc: createVendorDto.loc
            },
            ...createVendorDto
        }).catch(() => {
            throw new HttpException('Error on DB Insertion', HttpStatus.INTERNAL_SERVER_ERROR);
        });
        await this.discordService.sendToVerificationQueue(vendor);
        return {uname: vendor.uname, vid: vendor.vid};
    }
}