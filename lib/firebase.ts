import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging} from "firebase/messaging"

const firebaseConfig = {
  apiKey: "AIzaSyB4N88EgeUrrXFGTeYFg0Gblzd_dsJdPJE",
  authDomain: "proyectoimperial-5d914.firebaseapp.com",
  projectId: "proyectoimperial-5d914",
  storageBucket: "proyectoimperial-5d914.firebasestorage.app",
  messagingSenderId: "979871430084",
  appId: "1:979871430084:web:d124dd06d546be6563a091",
  measurementId: "G-KED3S6WS9T"
};

const app = initializeApp(firebaseConfig)

let analytics
if (typeof window !== "undefined") {
  analytics = getAnalytics(app)
}

export const messaging =
  typeof window !== "undefined"
    ? getMessaging(app)
    : null