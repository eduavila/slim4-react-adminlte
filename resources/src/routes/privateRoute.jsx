import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ dispatch, component: Component, ...rest }) => {
    return (
        <Route {...rest} render={ props => {
            return (
                false
                    ? <Component { ...props }/>
                    : <Redirect to={{ pathname: '/login' }} />
            )
        }} />
    )
}

export default PrivateRoute;
