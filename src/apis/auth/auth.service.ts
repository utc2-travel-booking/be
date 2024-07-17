import { BadRequestException, Injectable } from '@nestjs/common';
import { UserPayload } from 'src/base/models/user-payload.model';
import { JwtService } from '@nestjs/jwt';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { decodeUTF8 } from 'tweetnacl-util';
import bs58 from 'bs58';
import { isBase58 } from 'src/utils/helper';
import { appSettings } from 'src/configs/appsettings';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async login(user: UserPayload) {
        const tokens = await this.getTokens(user);
        return tokens;
    }

    private async getTokens(user: UserPayload) {
        const { _id } = user;

        const refreshToken = await this.jwtService.signAsync(
            { _id },
            {
                expiresIn: appSettings.jwt.refreshExpireIn,
                secret: appSettings.jwt.refreshSecret,
            },
        );

        const accessToken = await this.jwtService.signAsync(user);

        return {
            accessToken,
            refreshToken,
        };
    }

    async verifySignature(
        message: string,
        signature: string,
        publicKey: string,
    ): Promise<boolean> {
        if (!isBase58(publicKey)) {
            throw new BadRequestException('Invalid public key or signature');
        }

        const publicKeyObj = new PublicKey(publicKey);

        const messageBuffer = decodeUTF8(message);

        const signatureBuffer = bs58.decode(signature);

        return nacl.sign.detached.verify(
            messageBuffer,
            new Uint8Array(signatureBuffer),
            publicKeyObj.toBytes(),
        );
    }
}
