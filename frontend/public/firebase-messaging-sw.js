// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAul7FojJEvorKUIg_gjj41qxAd7WHAUhs",
  authDomain: "nefrovida-f25f3.firebaseapp.com",
  projectId: "nefrovida-f25f3",
  messagingSenderId: "1000573501582",
  appId: "1:1000573501582:web:44275e4593343ac1e409df",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/vite.svg",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
