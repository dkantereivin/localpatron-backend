import {Injectable} from '@nestjs/common';

@Injectable()
export class UtilsService {
    public static formatPhoneNumber(phoneNumber: string | number): string {
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return null;
    }
}