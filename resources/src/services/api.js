import axios from 'axios';
import { unsetTokens, setTokenAccess, getTokenAccess, getTokenReflesh } from '../helpers/auth';
import { logoutSuccess } from '../actions/auth';

import history from '../history';
import Store from '../store';

const API_URL = `${process.env.APP_URL}/api`;

class Api {
    constructor() {
        this.config = {
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            validateStatus: function(status) {
                return status >= 200 && status < 300; // default
            },
        };

       // axios = axios.create(this.config);
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        axios.defaults.baseURL = API_URL;
        axios.defaults.validateStatus= (status) => (status >= 200 && status < 300)

        //Middware capture erros and success
        axios.interceptors.response.use(this._handleSucess, this._handlerError.bind(this));
    }

    _handleSucess(response) {
        return response;
    }

    _handlerError(err) {
        if(err.response == undefined){
            return Promise.reject(err);
        }

        //Caso for 401 atualizar token/
        if (err.config.headers.Authorization && err.response.status === 401 && err.config && !err.config.__isRetryRequest) {

            const tokenRefresh = getTokenReflesh();

            if(!tokenRefresh){
                console.warn('Token refresh nao encontrado..');
                this._logout();
            }

                //Atualiza token de acesso.
            return this._refreshToken(tokenRefresh)
                .then(({ token_access })=>{

                    // Grava novamente no localStore
                    setTokenAccess(token_access);

                    //Seta novo Bearer 
                    err.config.__isRetryRequest = true;
                    err.config.headers.Authorization = 'Bearer ' + getTokenAccess();

                    return axios(err.config);
                })
                .catch(err =>{
                    if (err.response) {
                        /*
                        * The request was made and the server responded with a
                        * status code that falls out of the range of 2xx
                        */
                        if (err.response.status === 401) {
                        this._logout();
                        }
                    }

                    return Promise.reject(err);
                });
        }

        return Promise.reject(err);
    }

    _logout(){
        console.log('logout...');
        Store.dispatch(logoutSuccess());
        unsetTokens();
        history.push("/login");

        throw new axios.Cancel('Cancelada requisições.');
    }

    _refreshToken(tokenRefresh) {
        return axios.post(`/auth/refresh`, { token: tokenRefresh })
            .then(({ status, data }) => Promise.resolve(data))
    }

    get(path, config) {
        if (config && config.isAuth) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${getTokenAccess()}`
            }
        }
        //request
        return axios.get(path, config)
            .then(({ status, data }) => Promise.resolve(data))
    }
    post(path, data, config) {
        if (config && config.isAuth) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${getTokenAccess()}`
            }
        }
        //request
        return axios.post(path, data, config)
            .then(({ status, data }) => Promise.resolve(data))
    }

    put(path, data, config) {
        if (config && config.isAuth) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${getTokenAccess()}`
            }
        }
        // request 
        return axios.put(path, data, config)
            .then(({ status, data }) => Promise.resolve(data))
    }
    delete(path, config) {
        if (config && config.isAuth) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${getTokenAccess()}`
            }
        }
        // request 
        return axios.delete(path, config)
            .then(({ status, data }) => Promise.resolve(data))
    }
}

export default new Api;