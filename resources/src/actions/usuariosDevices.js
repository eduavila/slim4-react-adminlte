import usuariosDevices from '../services/usuariosDevices';
import { uuidv4 } from '../helpers/utils';

export function createOrUpdateDevice(token) {
    return dispatch => {

        let deviceId = localStorage.getItem('DEVICE_ID');
        if(!deviceId){
            deviceId = uuidv4();
            localStorage.setItem('DEVICE_ID',deviceId);
        }
        
        return usuariosDevices.createOrUpdate({
                device_id: deviceId,
                token: token
            })
            .catch((error) => {
                const response = error.response;
                const msg = response ? response.data : err.message;
                console.log(msg);
            });
    };
}