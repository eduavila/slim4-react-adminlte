import Api from './api';

export default {
    getAll: () => {
        const config = {
            isAuth: true
        }
        return Api.get('/perfils', config);
    },
    get: (id) => {
        const config = {
            isAuth: true
        }
        return Api.get(`/perfils/${id}`, config);
    },
    createOrUpdate: (data) => {
        const config = {
            isAuth: true
        }
        return Api.post('/perfils', data, config);
    }
}