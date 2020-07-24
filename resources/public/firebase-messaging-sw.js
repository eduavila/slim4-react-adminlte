importScripts('https://www.gstatic.com/firebasejs/7.14.5/firebase-app.js'); // eslint-disable-line
importScripts('https://www.gstatic.com/firebasejs/7.14.5/firebase-messaging.js'); // eslint-disable-line

console.log('Load firebase-messaging-sw.js')
// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyBzEcOiTMhAHi10L-qt270z07y18bri5gE",
  authDomain: "sge-pmlrv.firebaseapp.com",
  databaseURL: "https://sge-pmlrv.firebaseio.com",
  projectId: "sge-pmlrv",
  storageBucket: "sge-pmlrv.appspot.com",
  messagingSenderId: "862647682056",
  appId: "1:862647682056:web:018f8fa2758102f079fdbd",
  measurementId: "G-VD205FK32E"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {

  //console.log('[firebase-messaging-sw.js] Received background message ', payload);

  window.buscaMensagens();
  // // Customize notification here
  // const notificationTitle = 'Background Message Title';
  // const notificationOptions = {
  //   body: 'Background Message body.',
  //   icon: '/itwonders-web-logo.png'
  // };

  // return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  console.log('Click notificação...');
  event.notification.close();
  window.buscaMensagens();
});


// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('../firebase-messaging-sw.js')
//     .then(function (registration) {
//       console.log('Registration successful, scope is:', registration.scope);
//     }).catch(function (err) {
//       console.log('Service worker registration failed, error:', err);
//     });
// }