import Api from './api';

export default {
    getAll: () => {
        const config = {
            isAuth: true
        }
        return Api.get('/secretarias', config);
    },
    get: (id) => {
        const config = {
            isAuth: true
        }
        return Api.get(`/secretarias/${id}`, config);
    },
    create: (data) => {
        const config = {
            isAuth: true
        }
        return Api.post('/secretarias', data, config);
    },
    getSecetariaAcesso: () => {
        const config = {
            isAuth: true
        }
        return Api.get('/usuarios/secretarias', config);
    },
    createOrUpdate: (data) => {
        const config = {
            isAuth: true
        }
        return Api.post('/secretarias', data, config);
    }
}