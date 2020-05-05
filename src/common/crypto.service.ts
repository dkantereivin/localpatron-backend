import * as crypto from 'crypto';
import {Injectable} from '@nestjs/common';

@Injectable()
export class CryptoService {
    public static randomStringToken(len: number = 8): string {
        return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
    }

}