importScripts("https://www.gstatic.com/firebasejs/12.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.10.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB4N88EgeUrrXFGTeYFg0Gblzd_dsJdPJE",
  authDomain: "proyectoimperial-5d914.firebaseapp.com",
  projectId: "proyectoimperial-5d914",
  storageBucket: "proyectoimperial-5d914.firebasestorage.app",
  messagingSenderId: "979871430084",
  appId: "1:979871430084:web:d124dd06d546be6563a091",
});

messaging.onBackgroundMessage(function (payload) {
  console.log("Mensaje en background:", payload);

  const notificationTitle = payload.notification?.title || "Sin título";
  const notificationOptions = {
    body: payload.notification?.body || "Sin cuerpo",
    icon: "/apple-icon.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});