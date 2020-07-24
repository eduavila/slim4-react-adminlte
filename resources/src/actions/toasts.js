import {actions as toastrActions} from 'react-redux-toastr';
import { bindActionCreators } from 'redux';

export function addError(title,message){
    return dispatch => {
        const toastr = bindActionCreators(toastrActions, dispatch);
        toastr.add({
            id: 'msgError'+ new Date().getTime(),
            type: 'error',
            title: title,
            message: message
        });
    }
}


export function addSuccess(title,message){
    return dispatch => {
        const toastr = bindActionCreators(toastrActions, dispatch);
        toastr.add({
            id: 'msgSuccess_'+ new Date().getTime(),
            type: 'success',
            title: title,
            message: message
        });
    }
}

export function addAlert(title,message){
    return dispatch => {
        const toastr = bindActionCreators(toastrActions, dispatch);
        toastr.add({
            id: 'msgAlert_'+ new Date().getTime(),
            type: 'error',
            title: title,
            message: message
        });
    }
}