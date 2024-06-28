'use client';

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useAuthActions, useStore } from '@modules/auth/hooks';
import { useEffect } from "react";

const Login = () => {
    const { setToken, setUser } = useStore((state) => state);
    const { authorizeWithGoogle } = useAuthActions();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && user) {
            setToken(token);
            setUser(JSON.parse(user));
        }
    }, [setToken, setUser]);

    const onLoginSuccess = (credential: CredentialResponse) =>
        authorizeWithGoogle(credential)
            .then((data) => {
                setToken(data.token);
                setUser(data.user);
                window.location.replace('/explorer');
            });

    const onLoginError = () => {
        console.log("Google Login Failed");
    }

    return (
        <div
            className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700"
        >
            <div className="p-4 sm:p-7">
                <div className="text-center">
                    <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Sign in</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400 flex justify-center gap-1">
                        Don&apos;t have an account yet?
                        <span className="text-blue-600 decoration-2 font-medium dark:text-blue-500">
                            Sign in anyway
                        </span>
                    </p>
                </div>

                <div className="mt-5 flex justify-center">
                    <GoogleLogin
                        onSuccess={onLoginSuccess}
                        onError={onLoginError}
                        size="large"
                    ></GoogleLogin>
                </div>
            </div>
        </div>
    );
}

export default Login;