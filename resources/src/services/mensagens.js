import Api from './api';

export default {
    getAll: (limit) =>{
        const config = {
            isAuth: true
        }
        return Api.get(`/mensagens?${limit ? `limit=${limit}`: ''}`,config);
    },
    setLida: (id) =>{
        const config = {
            isAuth: true
        }
        return Api.post(`/mensagens/${id}`,null , config);
    }
}