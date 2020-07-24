const TOKEN_NAME = 'sge_token';
const TOKEN_USER = 'sge_user';
const TOKEN_REFRESH_NAME = 'sge_token_refresh';

export function getTokenAccess(){
    return localStorage.getItem(TOKEN_NAME) || null;
}

export function getTokenReflesh(){
    return localStorage.getItem(TOKEN_REFRESH_NAME) || null; 
}
/**
 * Retorna usuário gravado no navegador
 */
export function getUser(){
    const user = localStorage.getItem(TOKEN_USER);
    if (user !== null){
        return JSON.parse(user);
    } else{
        return null;
    }
}

/**
 * Seta token e usuario no armazenamento do navegador.
 */
export function setTokensUser(data){
    localStorage.setItem(TOKEN_NAME,data.token_access);
    localStorage.setItem(TOKEN_USER,JSON.stringify(data.usuario));
    localStorage.setItem(TOKEN_REFRESH_NAME,data.token_refresh);
}

/**
 * Seta token Access
 * 
 */
export function setTokenAccess(token){
    localStorage.setItem(TOKEN_NAME,token);
}

/**
 * Remove token e usuario do armazenamento do navegador.
 */
export function unsetTokens(){
    localStorage.removeItem(TOKEN_NAME);
    localStorage.removeItem(TOKEN_REFRESH_NAME);
    localStorage.removeItem(TOKEN_USER);
}


