import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// ---------------------------------------------------------
// [Leaflet 아이콘 오류 해결] 
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
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 12); 
  return null;
}

// [데이터]
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

// [데이터] 이미지(img) URL 포함
const results = {
  "J-Relax-Local": {
    mbti: "꼼꼼한 힐러",
    desc: "계획적이면서도 여유를 즐기는 당신!",
    color: "#4facfe",
    course: [
      { name: "해동용궁사", lat: 35.1883, lng: 129.2233, img: "https://images.unsplash.com/photo-1596418833075-80252875e638?w=500&q=80" },
      { name: "기장 연화리 해녀촌", lat: 35.216, lng: 129.227, img: "https://images.unsplash.com/photo-1621689893488-82db37c2299a?w=500&q=80" },
      { name: "해운대 달맞이길", lat: 35.158, lng: 129.176, img: "https://images.unsplash.com/photo-1563292723-5e758782a4d0?w=500&q=80" }
    ]
  },
  "J-Relax-Trendy": {
    mbti: "감성 플래너",
    desc: "완벽한 동선으로 예쁜 곳만 골라가요.",
    color: "#a18cd1",
    course: [
      { name: "흰여울문화마을", lat: 35.078, lng: 129.044, img: "https://images.unsplash.com/photo-1569925624707-160892047814?w=500&q=80" },
      { name: "영도 피아크", lat: 35.086, lng: 129.065, img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80" },
      { name: "광안리 해수욕장", lat: 35.153, lng: 129.118, img: "https://images.unsplash.com/photo-1548178152-1e96720eb99e?w=500&q=80" }
    ]
  },
  "J-Active-Local": {
    mbti: "열정 탐험가",
    desc: "부산의 찐 바이브를 느끼고 싶어하는 당신!",
    color: "#ff9a9e",
    course: [
      { name: "자갈치 시장", lat: 35.096, lng: 129.030, img: "https://images.unsplash.com/photo-1535231902047-9878278784d4?w=500&q=80" },
      { name: "남포동 먹자골목", lat: 35.099, lng: 129.033, img: "https://images.unsplash.com/photo-1629729868731-299f1165452f?w=500&q=80" },
      { name: "용두산 공원", lat: 35.100, lng: 129.032, img: "https://images.unsplash.com/photo-1627885375782-b1b70c4c47f5?w=500&q=80" }
    ]
  },
  "J-Active-Trendy": {
    mbti: "트렌드 리더",
    desc: "부산에서 가장 핫한 곳은 다 가봐야 직성이 풀려요.",
    color: "#fbc2eb",
    course: [
      { name: "해운대 블루라인파크", lat: 35.161, lng: 129.166, img: "https://images.unsplash.com/photo-1634568437937-25e1a3b90f4a?w=500&q=80" },
      { name: "엘시티 전망대", lat: 35.160, lng: 129.165, img: "https://images.unsplash.com/photo-1545641203-7d072a14e3b2?w=500&q=80" },
      { name: "더베이101", lat: 35.156, lng: 129.152, img: "https://images.unsplash.com/photo-1570535914652-3d8429c663a8?w=500&q=80" }
    ]
  },
  "P-Relax-Local": {
    mbti: "자유로운 영혼",
    desc: "바다 냄새 맡으며 소주 한 잔, 이게 낭만이지!",
    color: "#8fd3f4",
    course: [
      { name: "민락수변공원", lat: 35.154, lng: 129.123, img: "https://images.unsplash.com/photo-1602042103525-4c03884e933e?w=500&q=80" },
      { name: "광안리 회센터", lat: 35.153, lng: 129.119, img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80" },
      { name: "수영강 산책로", lat: 35.170, lng: 129.120, img: "https://images.unsplash.com/photo-1635583562699-b1322198083b?w=500&q=80" }
    ]
  },
  "P-Relax-Trendy": {
    mbti: "낭만 방랑자",
    desc: "예쁜 카페에서 하루 종일 있어도 좋아요.",
    color: "#cfd9df",
    course: [
      { name: "전포 카페거리", lat: 35.155, lng: 129.063, img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&q=80" },
      { name: "송상현 광장", lat: 35.165, lng: 129.063, img: "https://images.unsplash.com/photo-1590494056259-255d65f57342?w=500&q=80" },
      { name: "부산시민공원", lat: 35.168, lng: 129.057, img: "https://images.unsplash.com/photo-1582260654030-a29d66050b15?w=500&q=80" }
    ]
  },
  "P-Active-Local": {
    mbti: "에너지 부자",
    desc: "시장통에서 이모님이랑 친구 먹는 친화력!",
    color: "#ff758c",
    course: [
      { name: "부평 깡통시장", lat: 35.101, lng: 129.026, img: "https://images.unsplash.com/photo-1583907799516-8df7d9d282cb?w=500&q=80" },
      { name: "국제시장", lat: 35.100, lng: 129.028, img: "https://images.unsplash.com/photo-1605218427368-35b02661841b?w=500&q=80" },
      { name: "보수동 책방골목", lat: 35.103, lng: 129.026, img: "https://images.unsplash.com/photo-1588661706828-569d6286df9a?w=500&q=80" }
    ]
  },
  "P-Active-Trendy": {
    mbti: "힙스터 여행러",
    desc: "지도 없이 걷다가 발견한 힙한 곳을 좋아해요.",
    color: "#a6c0fe",
    course: [
      { name: "송도 해상케이블카", lat: 35.076, lng: 129.017, img: "https://images.unsplash.com/photo-1559461128-4c173c4d7b32?w=500&q=80" },
      { name: "송도 용궁구름다리", lat: 35.075, lng: 129.015, img: "https://images.unsplash.com/photo-1598583487372-f0491dd55f0b?w=500&q=80" },
      { name: "영도 포장마차촌", lat: 35.092, lng: 129.035, img: "https://images.unsplash.com/photo-1627885449718-d4239845778a?w=500&q=80" }
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

  // --------------------------------------------------------------------------
  // [수정된 부분] 복잡한 공유 로직을 제거하고, 링크 복사 + 알림만 남겼습니다.
  // --------------------------------------------------------------------------
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("링크가 복사되었습니다!");
  };

  return (
    <div className="app-container">
      {/* 휴대폰 프레임 유지 */}
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
                  const centerPosition = [result.course[0].lat, result.course[0].lng];

                  return (
                    <>
                      <div className="result-header" style={{backgroundColor: result.color}}>
                        <small>당신의 여행 유형은</small>
                        <h2>{result.mbti}</h2>
                      </div>
                      
                      <div className="result-body">
                        <p className="desc">"{result.desc}"</p>
                        
                        {/* 지도 영역 */}
                        <div className="map-container-wrapper">
                          <MapContainer 
                            center={centerPosition} 
                            zoom={12} 
                            scrollWheelZoom={false}
                            style={{ height: "100%", width: "100%" }}
                          >
                            <TileLayer
                              attribution='&copy; OpenStreetMap contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <ChangeView center={centerPosition} />
                            {result.course.map((spot, idx) => (
                              <Marker key={idx} position={[spot.lat, spot.lng]}>
                                <Popup>{spot.name}</Popup>
                              </Marker>
                            ))}
                          </MapContainer>
                        </div>

                        {/* 코스 리스트 (카드 형태) */}
                        <h3>추천 코스 📍</h3>
                        <ul className="course-list-visual">
                          {result.course.map((spot, idx) => (
                            <li key={idx} className="course-card">
                              <div className="card-image" style={{backgroundImage: `url(${spot.img})`}}>
                                <span className="card-num">{idx + 1}</span>
                              </div>
                              <div className="card-info">
                                <h4>{spot.name}</h4>
                                <a 
                                  href={`https://map.kakao.com/link/search/${spot.name}`} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="btn-map-link"
                                >
                                  길찾기 🔗
                                </a>
                              </div>
                            </li>
                          ))}
                        </ul>

                        {/* 버튼 그룹 (수정된 공유하기 버튼 포함) */}
                        <div className="action-buttons">
                          <button className="btn-share" onClick={handleShare}>링크 복사 🔗</button>
                          <button className="btn-retry" onClick={handleReset}>다시 하기 🔄</button>
                        </div>
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