import Api from './api';

export default {
    getAll: (onlyAtivos) => {
        const config = {
            isAuth: true
        }
        
        let status = 'all';
        if(onlyAtivos){
            status = 'ativos';
        }

        return Api.get(`/usuarios?status=${status}`, config);
    },
    get: (id) => {
        const config = {
            isAuth: true
        }
        return Api.get(`/usuarios/${id}`, config);
    },
    createOrUpdate: (data) => {
        const config = {
            isAuth: true
        }
        return Api.post('/usuarios', data, config);
    },
    alterarSenha: (data) => {
        const config = {
            isAuth: true
        }
        return Api.post('/usuarios/alterar-senha', data, config);
    }
}