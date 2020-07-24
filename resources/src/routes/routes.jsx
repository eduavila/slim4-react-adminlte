import React from 'react';
import { Route,Switch } from 'react-router';
import loadable from 'react-loadable';

// loading view
const LoadingComponent = () => <div class="preloader"></div>;

const AsyncLoginPage = loadable( {
    loader: () => import( '../views/LoginPage' ),
    loading: LoadingComponent
} );

const AsyncAppPage = loadable( {
    loader: () => import('../views/app/App'),
    loading: LoadingComponent
} );

const Routes = props => (
    <Switch>
        <Route path="/login" component={ AsyncLoginPage } />
        
        <Route path="/" component={ AsyncAppPage } />
    </Switch>
)

export default Routes;
