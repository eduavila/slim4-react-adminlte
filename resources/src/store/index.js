import { createStore,applyMiddleware, combineReducers } from 'redux';
import {reducer as toastrReducer} from 'react-redux-toastr';
import thunk from 'redux-thunk';

import auth from '../reducers/auth';
import usuarios from '../reducers/usuarios';
import secretarias from '../reducers/secretarias';
import mensagens from '../reducers/mensagens';
import sidebar from '../reducers/siderbar';
import modals from '../components/modals/reducer';

// Combina reducers.
const reducers = combineReducers(
    {
        toastr:toastrReducer,
        auth,
        usuarios,
        secretarias,
        modals,
        mensagens,
        sidebar
    }
);

// configuracao para DEVTools Reduxs
const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ 
      && window.__REDUX_DEVTOOLS_EXTENSION__();

//Aplica middleware e criar store
const store = applyMiddleware(thunk)(createStore)(reducers,devTools)

export default store;