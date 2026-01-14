import React, { useState, useEffect, useRef } from 'react';
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

// [새로운 질문 데이터 8개]
const questions = [
  {
    id: 1,
    question: "여행 가면, 제일 먼저 떠오르는 건 뭐예요?",
    options: [
      { text: "① 아무 생각 없이 쉬기", scores: { R: 2 } },
      { text: "② 맛집 투어", scores: { L: 1, T: 1 } },
      { text: "③ 인생샷 남기기", scores: { T: 2 } },
      { text: "④ 문화·역사 탐방", scores: { L: 2 } },
      { text: "⑤ 쇼핑 스케줄", scores: { T: 1, A: 1 } },
      { text: "⑥ 이것저것 체험하기", scores: { A: 2 } },
    ],
  },
  {
    id: 2,
    question: "당신의 여행 스타일은?",
    options: [
      { text: "① 일정 꽉꽉 채우는 타입", scores: { J: 2, A: 1 } },
      { text: "② 느긋~하게 즐기는 타입", scores: { P: 1, R: 2 } },
      { text: "③ 발길 닿는 대로 타입", scores: { P: 2 } },
    ],
  },
  {
    id: 3,
    question: "여행지에서 가장 끌리는 장소는? (하나만!)",
    options: [
      { text: "① 바다·자연 힐링 스폿", scores: { R: 2, L: 1 } },
      { text: "② 골목길·시장 구경", scores: { L: 2, A: 1 } },
      { text: "③ 전시·박물관 탐험", scores: { L: 1, T: 1 } },
      { text: "④ 감성 카페 투어", scores: { T: 2, R: 1 } },
      { text: "⑤ 랜드마크 인증샷", scores: { T: 2, A: 1 } },
      { text: "⑥ 디지털·미디어 체험존", scores: { T: 2, A: 1 } },
    ],
  },
  {
    id: 4,
    question: "전통·예술 같은 문화 체험, 솔직히 말하면?",
    options: [
      { text: "① 무조건 한다!", scores: { L: 2, A: 1 } },
      { text: "② 있으면 해본다", scores: { L: 1 } },
      { text: "③ 음… 굳이?", scores: { T: 1 } },
    ],
  },
  {
    id: 5,
    question: "AR·VR 같은 디지털 관광 콘텐츠, 어때요?",
    options: [
      { text: "① 완전 취향 저격", scores: { T: 2, A: 1 } },
      { text: "② 있으면 더 재밌다", scores: { T: 1 } },
      { text: "③ 없어도 상관없다", scores: { L: 1 } },
    ],
  },
  {
    id: 6,
    question: "하루 여행 코스, 당신의 선택은?",
    options: [
      { text: "① 한 곳만 제대로 파기", scores: { J: 1, R: 1 } },
      { text: "② 여러 곳 찍고 다니기", scores: { J: 1, A: 2 } },
      { text: "③ 그날 기분 따라", scores: { P: 2 } },
    ],
  },
  {
    id: 7,
    question: "부산 여행 간다면, 제일 기대되는 건?",
    options: [
      { text: "① 바다 보면서 힐링", scores: { R: 2 } },
      { text: "② 역사·전통 느끼기", scores: { L: 2 } },
      { text: "③ 문화예술 즐기기", scores: { T: 1, L: 1 } },
      { text: "④ 먹고 쇼핑하고 또 먹기", scores: { T: 1, A: 1 } },
      { text: "⑤ 스마트 관광 체험하기", scores: { T: 2 } },
    ],
  },
  {
    id: 8,
    question: "연령대는 어디쯤이신가요?",
    options: [
      { text: "① 10대", scores: { T: 1 } },
      { text: "② 20대", scores: { T: 1 } },
      { text: "③ 30대", scores: { L: 1 } },
      { text: "④ 40대", scores: { L: 1 } },
      { text: "⑤ 50대 이상", scores: { L: 2, R: 1 } },
    ],
  },
];

// [결과 데이터]
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
  const [userName, setUserName] = useState("");
  const [answers, setAnswers] = useState([]);
  const [loadingPercent, setLoadingPercent] = useState(0);

  // [공유 기능] 링크를 통해 들어왔을 때 강제 적용할 결과 Key
  const [directResultKey, setDirectResultKey] = useState(null);

  const contentRef = useRef(null);

  // [초기화] 링크에 결과 파라미터가 있는지 확인
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedResult = params.get('result');
    const sharedName = params.get('name');

    if (sharedResult && results[sharedResult]) {
      // 파라미터가 유효하면 바로 결과 화면으로 셋팅
      setDirectResultKey(sharedResult);
      setUserName(sharedName || "익명");
      setStep(10);
    }
  }, []);

  // 화면 전환 시 스크롤 맨 위로
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [step]);

  // 시작 버튼
  const handleStart = () => {
    if (!userName.trim()) {
      alert("이름을 입력해주세요!");
      return;
    }
    setStep(1);
  };

  // 답변 선택
  const handleAnswer = (scores) => {
    const newAnswers = [...answers, scores];
    setAnswers(newAnswers);

    if (step < questions.length) {
      setStep(step + 1);
    } else {
      setStep(9);
    }
  };

  // 로딩 애니메이션
  useEffect(() => {
    if (step === 9) {
      let percent = 0;
      const interval = setInterval(() => {
        percent += 1;
        if (percent > 80) percent += 0.5;
        setLoadingPercent(Math.min(Math.floor(percent), 100));

        if (percent >= 100) {
          clearInterval(interval);
          setStep(10);
        }
      }, 25);
      return () => clearInterval(interval);
    }
  }, [step]);

  // 결과 계산 함수 (Key 반환용)
  const calculateResultKey = () => {
    let scoreJ = 0;
    let scoreA = 0;
    let scoreT = 0;

    answers.forEach(score => {
      if (score.J) scoreJ += score.J;
      if (score.P) scoreJ -= score.P;
      if (score.A) scoreA += score.A;
      if (score.R) scoreA -= score.R;
      if (score.T) scoreT += score.T;
      if (score.L) scoreT -= score.L;
    });

    const type1 = scoreJ >= 0 ? "J" : "P";
    const type2 = scoreA >= 0 ? "Active" : "Relax";
    const type3 = scoreT >= 0 ? "Trendy" : "Local";

    return `${type1}-${type2}-${type3}`;
  };

  // 최종 결과 객체 가져오기
  const getResult = () => {
    // 1. 링크 공유로 들어온 경우 (directResultKey가 있으면 우선 사용)
    if (directResultKey && results[directResultKey]) {
      return results[directResultKey];
    }

    // 2. 퀴즈를 풀어서 들어온 경우
    const key = calculateResultKey();
    return results[key] || results["P-Active-Trendy"];
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
    setUserName("");
    setLoadingPercent(0);
    setDirectResultKey(null); // 공유 상태 초기화

    // URL 파라미터 제거 (뒤로가기 방지 및 깔끔한 URL)
    window.history.pushState({}, null, window.location.pathname);
  };

  const handleShare = () => {
    // 현재 결과 Key를 계산 (퀴즈 푼 상태라면 계산, 링크라면 저장된 값)
    const currentKey = directResultKey || calculateResultKey();

    // 공유용 URL 생성
    const shareUrl = `${window.location.origin}${window.location.pathname}?result=${currentKey}&name=${userName}`;

    navigator.clipboard.writeText(shareUrl);
    alert("결과 링크가 복사되었습니다! \n친구에게 공유해보세요 💌");
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

          <div className="content" ref={contentRef}>
            {step === 0 && (
              <div className="start-screen">
                <h1>부산 여행<br />유형 테스트 🗺️</h1>
                <p>나에게 딱 맞는<br />부산 여행 코스는?</p>
                <div className="emoji-graphic">🚆🏖️📸</div>

                <div className="input-group">
                  <input
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="name-input"
                  />
                </div>

                <button className="btn-primary" onClick={handleStart}>테스트 시작하기</button>
              </div>
            )}

            {step >= 1 && step <= 8 && (
              <div className="quiz-screen">
                <div className="progress-bar">
                  <div className="fill" style={{ width: `${((step - 1) / 8) * 100}%` }}></div>
                </div>
                <div className="question-box">
                  <span className="q-badge">Q{step}</span>
                  <h2>{questions[step - 1].question}</h2>
                </div>
                <div className="options">
                  {questions[step - 1].options.map((opt, idx) => (
                    <button
                      key={`${step}-${idx}`}
                      className="btn-option"
                      onClick={() => handleAnswer(opt.scores)}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 9 && (
              <div className="loading-screen">
                <div className="loading-content">
                  <div className="spinner">✈️</div>
                  <h2>여행 취향 분석 중...</h2>
                  <div className="percent-text">{loadingPercent}%</div>
                  <div className="loading-bar">
                    <div className="loading-fill" style={{ width: `${loadingPercent}%` }}></div>
                  </div>
                </div>
              </div>
            )}

            {step === 10 && (
              <div className="result-screen">
                {(() => {
                  const result = getResult();
                  const centerPosition = [result.course[0].lat, result.course[0].lng];

                  return (
                    <>
                      <div className="result-header" style={{ backgroundColor: result.color }}>
                        <div className="user-badge">✨ {userName}님의 여행취향 분석 완료</div>
                        <small>당신의 여행 유형은</small>
                        <h2>{result.mbti}</h2>
                      </div>

                      <div className="result-body">
                        <p className="desc">"{result.desc}"</p>

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

                        <h3>추천 코스 📍</h3>
                        <ul className="course-list-visual">
                          {result.course.map((spot, idx) => (
                            <li key={idx} className="course-card">
                              <div className="card-image" style={{ backgroundImage: `url(${spot.img})` }}>
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

//test