import { CredentialResponse } from "@react-oauth/google";
import { IAuthDataUser, IAuthData } from "../interfaces";
import {generateECDHKeyPair} from "../utils";
import { api } from '@modules/api';

export const useAuthActions = () => {
    const authorizeWithGoogle = async (tokenResponse: CredentialResponse): Promise<{
        token: IAuthData['token'];
        user: IAuthDataUser
    }> => {
        const keyPair = generateECDHKeyPair();

        const { data } = await api.post<IAuthData>(
            "/auth/google/callback",
            { token: tokenResponse.credential, publicKey: keyPair.publicKey }
        );

        return { token: data.token, user: data.user };
    }

    return { authorizeWithGoogle };
}