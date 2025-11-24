// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAul7FojJEvorKUIg_gjj41qxAd7WHAUhs",
  authDomain: "nefrovida-f25f3.firebaseapp.com",
  projectId: "nefrovida-f25f3",
  storageBucket: "nefrovida-f25f3.firebasestorage.app",
  messagingSenderId: "1000573501582",
  appId: "1:1000573501582:web:44275e4593343ac1e409df",
  measurementId: "G-JQGHB8N8PE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const messaging = getMessaging(app);

export async function requestPermissionAndGetToken() {
    try {
      console.log("Requesting notification permission...");
      const permission = await Notification.requestPermission();
  
      if (permission !== "granted") {
        console.log("Notification permission denied");
        return null;
      }
  
      const vapidKey = "BJKsSxLvB3Yaj1fhds0xq-9q_fYm98m-Fe8E30jpbcED7IhaCvID4atp4n0Q5M-svs9aNzRoYgD-nOT8eI6sYY4";
      const token = await getToken(messaging, { vapidKey });
  
      console.log("FCM Token obtained:", token);
      return token;
    } catch (error) {
      console.error("Error getting FCM token:", error);
      return null;
    }
}

// Optional: handle foreground messages
onMessage(messaging, (payload) => {
    console.log("Message received in foreground:", payload);
});