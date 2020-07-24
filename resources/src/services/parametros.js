import Api from './api';

export default {
    getAll: () => {
        const config = {
            isAuth: true
        }
        return Api.get('/parametros', config);
    },
    get: (id) => {
        const config = {
            isAuth: true
        }
        return Api.get(`/parametros/${id}`, config);
    },
    createOrUpdate: (data) => {
        const config = {
            isAuth: true
        }
        return Api.post('/parametros', data, config);
    }
}