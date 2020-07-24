import Api from './api';

export default {
    login : (data) => { 
        return Api.post('/auth/login',data);
    },
    refresh: (data) => {
        return Api.post('/auth/refresh',data);
    },
    logout: (data) =>{
        const config = {
            isAuth: true
        }
        return Api.post('/auth/logout',data,config);
    }
}
