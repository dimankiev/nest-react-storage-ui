'use client';

import { create } from 'zustand'
import { IAuthData, IAuthDataUser } from "../interfaces";

type AuthStore = {
    token: IAuthData["token"] | null,
    user: IAuthDataUser | null,
    setToken: (token: IAuthData["token"]) => void,
    setUser: (user: IAuthDataUser) => void,
    clear: () => void
}

export const useStore = create<AuthStore>()((set) => ({
    // get auth data from local storage
    token: null,

    user: null,

    setToken: (token: IAuthData["token"]) => {
        localStorage.setItem("token", token);
        set({ token });
    },

    setUser: (user: IAuthDataUser) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user });
    },

    clear: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ token: null, user: {} });
    }
}))