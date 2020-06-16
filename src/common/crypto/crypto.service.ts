import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {AppConfigService} from '../../core/AppConfig';

@Injectable()
export class CryptoService {
    private readonly HASH_ROUNDS: number;
    private static readonly STRENGTH_REGEX: RegExp = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');

    constructor(private appConfigService: AppConfigService) {
        this.HASH_ROUNDS = appConfigService.saltRounds;
    }

    public static randomStringToken(len: number = 8): string {
        return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
    }

    public async comparePswd(plain: string, encrypted: string): Promise<boolean> {
        return bcrypt.compare(plain, encrypted);
    }

    /**
     * Validates the password strength and if valid, returns a bcrypt hash + salt of the password.
     * @param pswd The plaintext password to be validated and converted.
     */
    public async checkAndHashPswd(pswd: string): Promise<string> {
        if (!CryptoService.checkPswdStrength(pswd))
            throw new HttpException('Weak Password', HttpStatus.UNPROCESSABLE_ENTITY);
        return this.hashString(pswd);
    }

    public async hashString(data: string): Promise<string> {
        const salt: string = await bcrypt.genSalt(this.HASH_ROUNDS);
        return bcrypt.hash(data, salt);
    }

    public static checkPswdStrength(pswd: string): boolean {
        return CryptoService.STRENGTH_REGEX.test(pswd);
    }

}