import * as utils from '@noble/curves/abstract/utils';
import { secp521r1 } from '@noble/curves/p521';

export interface ECDHKeyPair {
    publicKey: string;
    privateKey: string;
}

export function generateECDHKeyPair(): ECDHKeyPair {
    const privateKey = secp521r1.utils.randomPrivateKey();
    const publicKey = secp521r1.getPublicKey(privateKey);

    return {
        privateKey: utils.bytesToHex(privateKey),
        publicKey: utils.bytesToHex(publicKey),
    };
}
