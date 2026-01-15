import React from 'react';
import { QRCodeCanvas } from 'qrcode.react'; 
import './App.css'; 

const QRPage = () => {
  // 배포된 앱의 주소 (package.json의 homepage 참조)
  const url = "https://hyeon0907.github.io/busan-trip";

  return (
    <div className="qr-page-container" style={{
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      backgroundColor: '#f0f2f5',
      textAlign: 'center'
    }}>
      <div style={{
        padding: '40px', 
        background: 'white', 
        borderRadius: '20px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ marginBottom: '30px', color: '#333', fontSize: '2rem' }}>
          부산 여행 유형 테스트 🏖️
        </h1>
        
        {/* QR 코드 생성 부분 */}
        <QRCodeCanvas 
          value={url} 
          size={250} 
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"H"}
        />
        
        <p style={{ marginTop: '30px', fontSize: '1.2rem', color: '#555', lineHeight: '1.6' }}>
          스마트폰 카메라를 켜고<br/>
          QR 코드를 스캔해보세요! 📸
        </p>
      </div>
    </div>
  );
};

export default QRPage;