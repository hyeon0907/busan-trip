import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 파이어베이스 콘솔에서 복사한 설정을 여기에 붙여넣으세요
const firebaseConfig = {
  apiKey: "API_KEY_여기에_입력",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);