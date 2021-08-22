import React, { createContext, useState, useEffect } from 'react';
import UserAPI from './api/UserAPI';

import axios from 'axios';

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
    const [token, setToken] = useState(false);

    useEffect(() => {
        const firstLogin = localStorage.getItem('firstLogin');
        if (firstLogin) {
            const refreshToken = async () => {
                const res = await axios.get('api/auth/refresh_token');

                setToken(res.data.token);

                setTimeout(() => {
                    refreshToken();
                }, 23 * 60 * 60 * 1000);
            };
            refreshToken();
        }
    }, []);

    const state = {
        token: [token, setToken],
        userAPI: UserAPI(token),
    };

    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    );
};