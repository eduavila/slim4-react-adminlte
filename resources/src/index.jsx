import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import { initializeFirebase } from './push-notification';
import store from './store';
import Routes from './routes/routes';

import "./dependency";

// Importa funções globais
import Globals from './globals';
Globals(store);


render(<Provider store={store}>
    <div>
          <ReduxToastr
            timeOut={4000}
            newestOnTop={false}
            preventDuplicates
            position="top-right"
            getState={(state) => state.toastr}
            transitionIn="fadeIn"
            transitionOut="fadeOut"
            progressBar
            closeOnToastrClick />

        <HashRouter>
            <Routes />
        </HashRouter>
    </div>
</Provider>, document.getElementById('app'));

