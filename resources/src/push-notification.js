import firebase from 'firebase/app';
import 'firebase/messaging';
import bootbox from 'bootbox';
import { createOrUpdateDevice } from './actions/usuariosDevices';
import store from './store';

export const initializeFirebase = () => {
    if (!firebase.apps.length) {
        var config = {
            apiKey: "AIzaSyBzEcOiTMhAHi10L-qt270z07y18bri5gE",
            authDomain: "sge-pmlrv.firebaseapp.com",
            databaseURL: "https://sge-pmlrv.firebaseio.com",
            projectId: "sge-pmlrv",
            storageBucket: "sge-pmlrv.appspot.com",
            messagingSenderId: "862647682056",
            appId: "1:862647682056:web:018f8fa2758102f079fdbd",
            measurementId: "G-VD205FK32E"   
        };
    
        firebase.initializeApp(config);

         // use other service worker
        navigator.serviceWorker
            .register('/dist/firebase-messaging-sw.js')
            .then((registration) => { 
                console.log('Registrado...');
                firebase.messaging().useServiceWorker(registration);
            });
    }
}

export const checkEnabledNotification = (enabledBackground) => {

    // Checa se tem suporte
    if (firebase.messaging.isSupported()) {
        const messaging = firebase.messaging();

        messaging
            .requestPermission()
            .then(function () {
                console.log("Notification permission granted.");
                
                // get the token in the form of promise
                return messaging.getToken()
            })
            .then(function(token) {
                console.log(`Token: ${token}`);
                // Envia 
                store.dispatch(createOrUpdateDevice(token));

                if(!enabledBackground){
                    bootbox.dialog({
                        closeButton: false,
                        title: "Ativada com sucesso.",
                        message: `Notificação do navegador foi ativada com sucesso!`,
                        buttons: {
                            confirm: {
                                label: '<i class="fa fa-check"></i> OK'
                            }
                        },
                        callback: (result) => {
                            if (!result) return;
                        }
                    });
                }
               
            })
            .catch(function (err) {
                console.log("Unable to get permission to notify.", err);
                
                if(!enabledBackground){
                    bootbox.dialog({
                        closeButton: false,
                        title: "Ops! ocorreu um erro.",
                        message: `Não foi possivel ativar notificação! Verifique se o navegador está habilitado para receber notificação na barra do navegador.`,
                        buttons: {
                            confirm: {
                                label: '<i class="fa fa-check"></i> OK'
                            }
                        },
                        callback: (result) => {
                            if (!result) return;
                        }
                    });
                }
            });
    
        messaging.onMessage(function(payload) {
            console.log("Message received. ", payload);
    
            //kenng - foreground notifications
            const {title, ...options} = payload.notification;
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, options);
            });
        });

    }else{

        if(!enabledBackground){
            bootbox.dialog({
                closeButton: false,
                title: "Ops! ocorreu um erro.",
                message: `Navegador não possui suporte para receber notificação. Entre contato com suporte!`,
                buttons: {
                    confirm: {
                        label: '<i class="fa fa-check"></i> OK'
                    }
                },
                callback: (result) => {
                    if (!result) return;
                }
            });
        }
    }
}