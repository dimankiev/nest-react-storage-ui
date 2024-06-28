export interface IAuthData {
    // Data about the user
    user: IAuthDataUser

    // JWT token
    token: string;
}

export interface IAuthDataUser {
    name?: string;
    email?: string;
}