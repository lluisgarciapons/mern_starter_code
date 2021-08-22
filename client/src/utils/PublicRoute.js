import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { GlobalState } from '../GlobalState';


const PublicRoute = ({ children, restricted, ...rest }) => {
    const state = useContext(GlobalState);
    const [isLogged] = state.userAPI.isLogged;
    return (
        // restricted = false meaning public route
        // restricted = true meaning restricted route
        <Route
            {...rest}
            render={({ location }) => (
                (isLogged && restricted) ?
                    <Redirect to="/" />
                    : children
            )} />
    );
};

export default PublicRoute;