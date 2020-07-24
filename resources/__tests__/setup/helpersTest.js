
import { act } from 'react-dom/test-utils';

// https://github.com/wesbos/waait/blob/master/index.js
export function waait(amount = 0) {
    return new Promise(resolve => setTimeout(resolve, amount));
}

// Use this in your test after mounting if you need just need to let the query finish without updating the wrapper
export async function actWait(amount = 0) {
    await act(async () => {
        await waait(amount);
    });
}

// Use this in your test after mounting if you want the query to finish and update the wrapper
export async function updateWrapper(wrapper, amount = 0) {
    await act(async () => {
        await waait(amount);
        wrapper.update();
    });
}


export function mockErroApi(erroCode,msg){
    return Promise.reject(
        {
            response:{
                data:{
                    erroCode: erroCode,
                    msg: msg
                }
            }
        }
    );
}