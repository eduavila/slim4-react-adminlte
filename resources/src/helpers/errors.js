
export function msgError(error){
    const response = error.response;
    const msgErro = [];
    
    console.error(error);

    if(response && ( response.status == 400 || response.status == 403) ){
        // Verifica erro de validacao.
        const data = response.data;

        if(data.msg){
            msgErro.push(data.msg);
        }else{
            for (let errField in data) {

                const listError = data[errField];
                for (let err in listError){
                    msgErro.push(listError[err]);
                }
            }
        }
    }else{
        msgErro.push(error.message);
    }

    return msgErro.join('\n');
}