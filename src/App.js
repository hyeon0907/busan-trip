import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// ---------------------------------------------------------
// [Leaflet 아이콘 오류 해결] 
// 리액트에서 Leaflet 기본 마커 아이콘이 깨지는 현상을 방지하는 코드입니다.
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// ---------------------------------------------------------

// [지도 중심 이동 컴포넌트]
// 결과가 바뀔 때마다 지도의 중심을 첫 번째 장소로 이동시킵니다.
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 12); // 줌 레벨 12
  return null;
}

// [데이터] 좌표(lat, lng) 정보를 포함하도록 수정했습니다.
const questions = [
  {
    id: 1,
    question: "여행을 떠날 때 당신의 스타일은?",
    options: [
      { text: "철저한 계획파! 엑셀 파일은 필수지.", type: "J" },
      { text: "무계획이 상팔자! 발길 닿는 대로~", type: "P" },
    ],
  },
  {
    id: 2,
    question: "부산에 도착했다! 가장 먼저 하고 싶은 것은?",
    options: [
      { text: "바다를 보며 멍때리기 (힐링)", type: "Relax" },
      { text: "핫플레이스 & 액티비티 즐기기 (활동)", type: "Active" },
    ],
  },
  {
    id: 3,
    question: "선호하는 저녁 메뉴 분위기는?",
    options: [
      { text: "노포 감성! 시끌벅적한 시장통", type: "Local" },
      { text: "인스타 감성! 예쁘고 조용한 카페/바", type: "Trendy" },
    ],
  },
];

const results = {
  "J-Relax-Local": {
    mbti: "꼼꼼한 힐러",
    desc: "계획적이면서도 여유를 즐기는 당신!",
    color: "#4facfe",
    course: [
      { name: "해동용궁사", lat: 35.1883, lng: 129.2233 },
      { name: "기장 연화리 해녀촌", lat: 35.216, lng: 129.227 },
      { name: "해운대 달맞이길", lat: 35.158, lng: 129.176 }
    ]
  },
  "J-Relax-Trendy": {
    mbti: "감성 플래너",
    desc: "완벽한 동선으로 예쁜 곳만 골라가요.",
    color: "#a18cd1",
    course: [
      { name: "흰여울문화마을", lat: 35.078, lng: 129.044 },
      { name: "영도 피아크", lat: 35.086, lng: 129.065 },
      { name: "광안리 해수욕장", lat: 35.153, lng: 129.118 }
    ]
  },
  "J-Active-Local": {
    mbti: "열정 탐험가",
    desc: "부산의 찐 바이브를 느끼고 싶어하는 당신!",
    color: "#ff9a9e",
    course: [
      { name: "자갈치 시장", lat: 35.096, lng: 129.030 },
      { name: "남포동 먹자골목", lat: 35.099, lng: 129.033 },
      { name: "용두산 공원", lat: 35.100, lng: 129.032 }
    ]
  },
  "J-Active-Trendy": {
    mbti: "트렌드 리더",
    desc: "부산에서 가장 핫한 곳은 다 가봐야 직성이 풀려요.",
    color: "#fbc2eb",
    course: [
      { name: "해운대 블루라인파크", lat: 35.161, lng: 129.166 },
      { name: "엘시티 전망대", lat: 35.160, lng: 129.165 },
      { name: "더베이101", lat: 35.156, lng: 129.152 }
    ]
  },
  // P유형 (예시로 J와 동일한 좌표 사용하거나 약간 변형 가능)
  "P-Relax-Local": {
    mbti: "자유로운 영혼",
    desc: "바다 냄새 맡으며 소주 한 잔, 이게 낭만이지!",
    color: "#8fd3f4",
    course: [
      { name: "민락수변공원", lat: 35.154, lng: 129.123 },
      { name: "광안리 회센터", lat: 35.153, lng: 129.119 },
      { name: "수영강 산책로", lat: 35.170, lng: 129.120 }
    ]
  },
  "P-Relax-Trendy": {
    mbti: "낭만 방랑자",
    desc: "예쁜 카페에서 하루 종일 있어도 좋아요.",
    color: "#cfd9df",
    course: [
      { name: "전포 카페거리", lat: 35.155, lng: 129.063 },
      { name: "송상현 광장", lat: 35.165, lng: 129.063 },
      { name: "부산시민공원", lat: 35.168, lng: 129.057 }
    ]
  },
  "P-Active-Local": {
    mbti: "에너지 부자",
    desc: "시장통에서 이모님이랑 친구 먹는 친화력!",
    color: "#ff758c",
    course: [
      { name: "부평 깡통시장", lat: 35.101, lng: 129.026 },
      { name: "국제시장", lat: 35.100, lng: 129.028 },
      { name: "보수동 책방골목", lat: 35.103, lng: 129.026 }
    ]
  },
  "P-Active-Trendy": {
    mbti: "힙스터 여행러",
    desc: "지도 없이 걷다가 발견한 힙한 곳을 좋아해요.",
    color: "#a6c0fe",
    course: [
      { name: "송도 해상케이블카", lat: 35.076, lng: 129.017 },
      { name: "송도 용궁구름다리", lat: 35.075, lng: 129.015 },
      { name: "영도 포장마차촌", lat: 35.092, lng: 129.035 }
    ]
  }
};

function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleStart = () => setStep(1);

  const handleAnswer = (type) => {
    const newAnswers = [...answers, type];
    setAnswers(newAnswers);
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      setStep(4);
    }
  };

  const getResult = () => {
    const key = answers.join('-');
    return results[key] || results["P-Active-Trendy"];
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
  };

  return (
    <div className="app-container">
      <div className="phone-frame">
        <div className="notch"></div>
        <div className="screen">
          <div className="status-bar">
            <span>12:00</span>
            <span>🔋 100%</span>
          </div>

          <div className="content">
            {step === 0 && (
              <div className="start-screen">
                <h1>부산 여행<br/>유형 테스트 🗺️</h1>
                <p>나에게 딱 맞는<br/>부산 여행 코스는?</p>
                <div className="emoji-graphic">🚆🏖️📸</div>
                <button className="btn-primary" onClick={handleStart}>테스트 시작하기</button>
              </div>
            )}

            {step >= 1 && step <= 3 && (
              <div className="quiz-screen">
                <div className="progress-bar">
                  <div className="fill" style={{width: `${(step / 3) * 100}%`}}></div>
                </div>
                <div className="question-box">
                  <h2>Q{step}.</h2>
                  <p>{questions[step - 1].question}</p>
                </div>
                <div className="options">
                  {questions[step - 1].options.map((opt, idx) => (
                    <button key={idx} className="btn-option" onClick={() => handleAnswer(opt.type)}>
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="result-screen">
                {(() => {
                  const result = getResult();
                  // 지도의 초기 중심 좌표는 첫 번째 코스 장소로 설정
                  const centerPosition = [result.course[0].lat, result.course[0].lng];

                  return (
                    <>
                      <div className="result-header" style={{backgroundColor: result.color}}>
                        <small>당신의 여행 유형은</small>
                        <h2>{result.mbti}</h2>
                      </div>
                      
                      <div className="result-body">
                        <p className="desc">"{result.desc}"</p>
                        
                        {/* 지도 영역 추가 */}
                        <div className="map-container-wrapper">
                          <MapContainer 
                            center={centerPosition} 
                            zoom={12} 
                            scrollWheelZoom={false} // 스크롤 방해 방지
                            style={{ height: "100%", width: "100%" }}
                          >
                            <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {/* 중심점 변경 컴포넌트 */}
                            <ChangeView center={centerPosition} />
                            
                            {/* 마커 표시 */}
                            {result.course.map((spot, idx) => (
                              <Marker key={idx} position={[spot.lat, spot.lng]}>
                                <Popup>{spot.name}</Popup>
                              </Marker>
                            ))}
                          </MapContainer>
                        </div>

                        <h3>추천 코스 📍</h3>
                        <ul className="course-list">
                          {result.course.map((spot, idx) => (
                            <li key={idx}>
                              <span className="num">{idx + 1}</span>
                              {spot.name}
                            </li>
                          ))}
                        </ul>
                        <button className="btn-retry" onClick={handleReset}>다시 하기</button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
          <div className="home-indicator"></div>
        </div>
      </div>
    </div>
  );
}

export default App;