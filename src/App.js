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

// [지도 중심 이동 컴포넌트 - 기능 개선]
// center 좌표가 바뀌면 해당 위치로 부드럽게 이동(flyTo)합니다.
function ChangeView({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 }); // 줌 레벨 14, 이동 시간 1.5초
    }
  }, [center, map]);

  return null;
}

// [사용자 지정 고정 코스 데이터]
const fixedCourse = [
  { 
    name: "송도 해상케이블카", 
    lat: 35.076, 
    lng: 129.017, 
    img: "https://busanaircruise.co.kr/images/contents/intro-img.png",
    likes: 1240 
  },
  { 
    name: "암남공원", 
    lat: 35.064, 
    lng: 129.022, 
    img: "https://cdn.dailysecu.com/news/photo/202508/168871_197918_198.jpg",
    likes: 958 
  },
  { 
    name: "남포동 커피 네루다", 
    lat: 35.097, 
    lng: 129.035, 
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80",
    likes: 821 
  },
  { 
    name: "부평 깡통시장", 
    lat: 35.101, 
    lng: 129.026, 
    img: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20170228_77%2F1488249921205G9x7H_JPEG%2F186178517539663_0.jpeg",
    likes: 2105 
  },
  { 
    name: "이재모 피자", 
    lat: 35.102, 
    lng: 129.030, 
    img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80",
    likes: 3402 
  }
];

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
    color: "#4facfe"
  },
  "J-Relax-Trendy": {
    mbti: "감성 플래너",
    desc: "완벽한 동선으로 예쁜 곳만 골라가요.",
    color: "#a18cd1"
  },
  "J-Active-Local": {
    mbti: "열정 탐험가",
    desc: "부산의 찐 바이브를 느끼고 싶어하는 당신!",
    color: "#ff9a9e"
  },
  "J-Active-Trendy": {
    mbti: "트렌드 리더",
    desc: "부산에서 가장 핫한 곳은 다 가봐야 직성이 풀려요.",
    color: "#fbc2eb"
  },
  "P-Relax-Local": {
    mbti: "자유로운 영혼",
    desc: "바다 냄새 맡으며 소주 한 잔, 이게 낭만이지!",
    color: "#8fd3f4"
  },
  "P-Relax-Trendy": {
    mbti: "낭만 방랑자",
    desc: "예쁜 카페에서 하루 종일 있어도 좋아요.",
    color: "#cfd9df"
  },
  "P-Active-Local": {
    mbti: "에너지 부자",
    desc: "시장통에서 이모님이랑 친구 먹는 친화력!",
    color: "#ff758c"
  },
  "P-Active-Trendy": {
    mbti: "힙스터 여행러",
    desc: "지도 없이 걷다가 발견한 힙한 곳을 좋아해요.",
    color: "#a6c0fe"
  }
};

function App() {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [answers, setAnswers] = useState([]);
  const [loadingPercent, setLoadingPercent] = useState(0);
  
  // [NEW] 지도 중심 좌표 상태 (클릭 시 변경)
  const [mapCenter, setMapCenter] = useState(null);

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
  const handleStart = (e) => {
    if (e) e.preventDefault(); // 폼 제출 새로고침 방지

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
    // 1. 링크 공유로 들어온 경우
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
    setDirectResultKey(null);
    setMapCenter(null); // 지도 중심도 초기화

    // URL 파라미터 제거
    window.history.pushState({}, null, window.location.pathname);
  };

  const handleShare = () => {
    const currentKey = directResultKey || calculateResultKey();
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
                  const displayCourse = fixedCourse;

                  // 지도의 초기 중심값 또는 클릭된 위치
                  // mapCenter가 없으면 코스의 2번째 장소(암남공원)를 기본값으로 사용
                  const currentCenter = mapCenter || [displayCourse[1].lat, displayCourse[1].lng];

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
                            center={currentCenter}
                            zoom={13}
                            scrollWheelZoom={false}
                            style={{ height: "100%", width: "100%" }}
                          >
                            <TileLayer
                              attribution='&copy; OpenStreetMap contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {/* 중심좌표 변경 감지 및 이동 */}
                            <ChangeView center={currentCenter} />
                            
                            {displayCourse.map((spot, idx) => (
                              <Marker key={idx} position={[spot.lat, spot.lng]}>
                                <Popup>
                                  <b>{spot.name}</b><br/>
                                  ❤️ {spot.likes.toLocaleString()}
                                </Popup>
                              </Marker>
                            ))}
                          </MapContainer>
                        </div>

                        <h3>추천 코스 📍</h3>
                        <p className="tip-text" style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>
                          * 목록을 클릭하면 지도가 이동해요!
                        </p>
                        <ul className="course-list-visual">
                          {displayCourse.map((spot, idx) => (
                            <li 
                              key={idx} 
                              className="course-card" 
                              // [NEW] 리스트 클릭 시 지도 중심 변경
                              onClick={() => setMapCenter([spot.lat, spot.lng])}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="card-image" style={{ backgroundImage: `url(${spot.img})` }}>
                                <span className="card-num">{idx + 1}</span>
                              </div>
                              <div className="card-info">
                                <div className="card-title-row">
                                  <h4>{spot.name}</h4>
                                  <span className="like-badge">❤️ {spot.likes.toLocaleString()}</span>
                                </div>
                                <a
                                  href={`https://map.kakao.com/link/search/${spot.name}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn-map-link"
                                  onClick={(e) => e.stopPropagation()} // 링크 클릭 시 지도 이동 방지
                                >
                                  길찾기 🔗
                                </a>
                              </div>
                            </li>
                          ))}
                        </ul>

                        <div className="action-buttons">
                          <button className="btn-share" onClick={handleShare}>공유 하기 🔗</button>
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