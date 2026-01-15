import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // 라우터 추가
import './index.css';
import App from './App';
import QRPage from './QRPage'; // QR 페이지 임포트
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* GitHub Pages 배포를 고려해 basename 설정 */}
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        {/* 기본 경로는 기존 앱(App) */}
        <Route path="/" element={<App />} />
        
        {/* /qr 경로는 QR 코드 페이지 */}
        <Route path="/qr" element={<QRPage/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();