// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDnXjj_kC-zW1tOTfvVHXUNkgrPr1LeNhA",
    authDomain: "leadscalementor.firebaseapp.com",
    projectId: "leadscalementor",
    storageBucket: "leadscalementor.appspot.com",
    messagingSenderId: "591922421850",
    appId: "1:591922421850:web:83b59e12a8bb1672a13863"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };
