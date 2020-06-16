import {Body, Controller, Get, HttpException, HttpStatus, Ip, Param, Put} from '@nestjs/common';
import {FullVendorDto, IExtVendorModel, IVendorModel, VendorDto, VendorModel} from './';
import {DiscordService, IsAdmin, Permissions} from '../common';
import {IVendor} from './vendor.types';
import {VendorService} from './vendor.service';
import {create} from 'domain';

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
        if (await VendorModel.countDocuments({'place.pid': createVendorDto.place.pid}) > 0)
            throw new HttpException('Already Exists', HttpStatus.CONFLICT);
        const vendor: IVendorModel = await VendorModel.create({
            ...createVendorDto,
            uname: createVendorDto.name,
            author: {
                ip,
                loc: createVendorDto.loc
            }
        }).catch(() => {
            throw new HttpException('Error on DB Insertion', HttpStatus.INTERNAL_SERVER_ERROR);
        });
        await this.discordService.sendToVerificationQueue(vendor);
        return {uname: vendor.uname, vid: vendor.vid};
    }

    @Put('full-vendor')
    async putFullVendor(@Body() createVendorDto: FullVendorDto, @Ip() ip: string) {
        const vendor: IExtVendorModel = await this.vendorService.createExternalVendor(createVendorDto, ip);
        return {uname: vendor.uname, vid: vendor.vid};
    }
}