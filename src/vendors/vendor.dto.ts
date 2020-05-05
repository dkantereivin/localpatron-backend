import {
    IsAlpha,
    IsAlphanumeric,
    IsAscii,
    IsEmail,
    IsLatitude,
    IsLongitude,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsUrl,
    Length,
    ValidateNested
} from 'class-validator';

const urlOptions = (hosts?: string[]) => ({
    protocols: ['https'],
    host_whitelist: hosts,
    require_host: true,
    require_protocol: true,
    require_tld: true,
});


class ExternalsObject {
    @IsUrl(urlOptions())
    wb: string;

    @IsUrl(urlOptions())
    cl: string;

    @IsOptional()
    @IsUrl(urlOptions(['www.ubereats.com']), {groups: ['admin', 'user']})
    ue: string;

    @IsOptional()
    @IsUrl(urlOptions(['www.doordash.com']))
    dd: string;

    @IsOptional()
    @IsUrl(urlOptions(['www.yelp.ca']))
    ye: string;

    @IsOptional()
    @IsUrl(urlOptions(['www.facebook.com']))
    fb: string;

    @IsOptional()
    @IsUrl(urlOptions(['www.instagram.com']))
    ig: string;

    @IsOptional()
    @IsUrl(urlOptions(['www.twitter.com']))
    tt: string;
}

class FullVendorExternalsObject extends ExternalsObject {
    @IsOptional()
    wb: string;
    @IsOptional()
    cl: string;
}

class CoordinateObject {
    @IsLatitude()
    lat: number;
    @IsLongitude()
    lng: number;
}

class PlaceObject {
    @Length(2, 256)
    pid: string;

    @IsAscii()
    @Length(2, 256)
    addr: string;

    @IsNotEmpty()
    @ValidateNested()
    coords: CoordinateObject;

}

class User {
    @IsAscii()
    @Length(2, 32)
    first: string;

    @IsAscii()
    @Length(2, 64)
    last: string;

    @IsEmail({allow_display_name: false, domain_specific_validation: true})
    email: string;

    @IsAscii()
    @Length(8, 64)
    pass: string;
}

export class VendorDto {
    @IsAscii()
    @Length(2, 32)
    ftype: string;

    @IsAscii()
    @Length(2, 32)
    name: string;

    @IsPhoneNumber('CA', {message: 'phone must be a valid Canadian phone number.'})
    phone: string;

    @IsNotEmpty()
    @ValidateNested()
    place: PlaceObject;

    @IsNotEmpty()
    @ValidateNested()
    ext: ExternalsObject;

    @IsNotEmpty()
    @ValidateNested()
    loc: CoordinateObject;
}

export class FullVendorDto extends VendorDto {
    ext: FullVendorExternalsObject;

    @IsNotEmpty()
    @ValidateNested()
    usr: User;
}