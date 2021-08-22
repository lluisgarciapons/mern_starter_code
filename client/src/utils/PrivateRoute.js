import React, { useContext } from 'react';
import { Redirect, Route } from "react-router-dom";

import { GlobalState } from '../../GlobalState';


function PrivateRoute({ children, ...rest }) {
    const state = useContext(GlobalState);
    const [isLogged] = state.userAPI.isLogged;
    return (
        <Route
            {...rest}
            render={({ location }) =>
                isLogged ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}
export default PrivateRoute;