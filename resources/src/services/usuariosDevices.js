import Api from './api';

export default {
    createOrUpdate: (data) => {
        const config = {
            isAuth: true
        }
        return Api.post('/usuarios/devices', data, config);
    }
}