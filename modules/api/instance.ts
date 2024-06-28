'use client';

import axios, { AxiosInstance } from 'axios';

export const api: AxiosInstance = axios.create({
    baseURL: '/api',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            // redirect to login page
            window.location.replace("/login");
        }
        return Promise.reject(error);
    }
);