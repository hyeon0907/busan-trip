import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// ---------------------------------------------------------
// [Leaflet 아이콘 오류 해결] 
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// ... 기존 import ...
import { db } from './firebase'; 
// [NEW] query, where, orderBy, onSnapshot 등 추가
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
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
// [App.js] fixedCourse 수정
const fixedCourse = [
  {
    name: "송도 해상케이블카",
    lat: 35.076,
    lng: 129.017,
    img: "https://busanaircruise.co.kr/images/contents/intro-img.png",
    likes: 1240,
    desc: "바다 위를 가로지르는 짜릿한 경험! 송도 해수욕장의 전경이 한눈에 들어옵니다. 야경도 정말 예뻐요."
  },
  {
    name: "암남공원",
    lat: 35.064,
    lng: 129.022,
    img: "https://cdn.dailysecu.com/news/photo/202508/168871_197918_198.jpg",
    likes: 958,
    desc: "조개구이 맛집들이 모여있는 곳으로 유명해요. 케이블카 타고 내려서 든든하게 배 채우기 딱 좋은 코스!"
  },
  // ... 나머지 장소들도 desc 추가 ...
  {
    name: "남포동 커피 네루다",
    lat: 35.097,
    lng: 129.035,
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80",
    likes: 821,
    desc: "고풍스러운 인테리어와 향긋한 커피가 있는 곳. 여행 중 잠시 쉬어가며 감성 충전하기 좋아요."
  },
  {
    name: "부평 깡통시장",
    lat: 35.101,
    lng: 129.026,
    img: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20170228_77%2F1488249921205G9x7H_JPEG%2F186178517539663_0.jpeg",
    likes: 2105,
    desc: "부산의 맛을 제대로 느끼고 싶다면 필수! 비빔당면, 유부주머니 등 먹거리 천국입니다."
  },
  {
    name: "이재모 피자",
    lat: 35.102,
    lng: 129.030,
    img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80",
    likes: 3402,
    desc: "부산 로컬 찐 맛집. 치즈가 흘러넘치는 피자를 맛보려면 웨이팅은 필수지만 후회하지 않아요!"
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

  const handleBack = () => {
    // 1단계보다 클 때만 동작 (2단계 이상 -> 이전 문제, 1단계 -> 시작 화면)
    if (step >= 1) {
      setStep(step - 1);
      // 마지막에 저장된 답변 하나를 제거
      setAnswers((prev) => prev.slice(0, -1));
    }
  };

  // 로딩 애니메이션
  // 로딩 애니메이션 및 결과 저장
  useEffect(() => {
    if (step === 9) {
      let percent = 0;
      const interval = setInterval(() => {
        percent += 1;
        if (percent > 80) percent += 0.5;
        setLoadingPercent(Math.min(Math.floor(percent), 100));

        if (percent >= 100) {
          clearInterval(interval);
          
          // [NEW] 파이어베이스에 결과 저장하기
          const saveResult = async () => {
            try {
              // 현재 결과 키 계산
              const resultKey = calculateResultKey(); 
              
              // 'test_results'라는 컬렉션에 데이터 추가
              await addDoc(collection(db, "test_results"), {
                name: userName,
                result: resultKey,
                answers: answers, // 사용자가 선택한 답변들
                timestamp: new Date() // 저장 시간
              });
              console.log("결과 저장 완료!");
            } catch (e) {
              console.error("저장 중 에러 발생: ", e);
            }
          };

          saveResult(); // 저장 함수 실행
          setStep(10);  // 결과 화면으로 이동
        }
      }, 25);
      return () => clearInterval(interval);
    }
  }, [step]); // 의존성 배열은 step만 있어도 됩니다.

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

  // ... 기존 state들 ...
  
  // [NEW] 선택된 장소 (모달용)
  const [selectedPlace, setSelectedPlace] = useState(null);
  // [NEW] 해당 장소의 댓글 목록
  const [placeReviews, setPlaceReviews] = useState([]);
  // [NEW] 댓글 입력값
  const [reviewText, setReviewText] = useState("");

  // [NEW] 장소 선택 시 댓글 불러오기 (실시간 연동)
  useEffect(() => {
    if (!selectedPlace) return;

    // 'reviews' 컬렉션에서 현재 장소 이름과 같은 글만 가져오기 (시간 역순)
    const q = query(
      collection(db, "reviews"),
      where("placeName", "==", selectedPlace.name),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlaceReviews(newReviews);
    });

    return () => unsubscribe();
  }, [selectedPlace]);

  // [NEW] 댓글 등록 함수
  const handleAddReview = async () => {
    if (!reviewText.trim()) return;
    
    try {
      await addDoc(collection(db, "reviews"), {
        placeName: selectedPlace.name,
        text: reviewText,
        userName: userName || "익명", // 현재 유저 이름 사용
        createdAt: new Date()
      });
      setReviewText(""); // 입력창 비우기
      alert("후기가 등록되었습니다!");
    } catch (e) {
      console.error("댓글 저장 실패:", e);
      alert("오류가 발생했습니다.");
    }
  };

  // [NEW] 모달 닫기
  const closeDetail = () => {
    setSelectedPlace(null);
    setPlaceReviews([]);
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

                {/* [NEW] 뒤로가기 버튼 영역 추가 */}
                <button className="btn-back-fixed" onClick={handleBack}>
                  ← 뒤로가기
                </button>

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
                  const currentCenter = mapCenter || [displayCourse[1].lat, displayCourse[1].lng];

                  // [NEW] 좋아요 순으로 정렬하여 랭킹 데이터 만들기 (Top 3)
                  const sortedRanking = [...fixedCourse].sort((a, b) => b.likes - a.likes).slice(0, 3);

                  return (
                    <>
                      {/* --- 결과 헤더 --- */}
                      <div className="result-header" style={{ backgroundColor: result.color }}>
                        <div className="user-badge">✨ {userName}님의 여행취향 분석 완료</div>
                        <small>당신의 여행 유형은</small>
                        <h2>{result.mbti}</h2>
                      </div>

                      <div className="result-body">
                        {/* --- 1. 핫플레이스 랭킹 영역 --- */}
                        <div className="ranking-section">
                          <h3>🔥 부산 핫플 랭킹 TOP 3</h3>
                          <div className="ranking-list">
                            {sortedRanking.map((place, idx) => (
                              <div key={idx} className="ranking-item" onClick={() => setSelectedPlace(place)}>
                                <span className={`rank-badge rank-${idx + 1}`}>{idx + 1}위</span>
                                <span className="rank-name">{place.name}</span>
                                <span className="rank-likes">❤️ {place.likes}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* --- 2. 지도 영역 --- */}
                        <div className="map-container-wrapper">
                          <MapContainer center={currentCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <ChangeView center={currentCenter} />
                            {displayCourse.map((spot, idx) => (
                              <Marker key={idx} position={[spot.lat, spot.lng]}
                                eventHandlers={{
                                  click: () => setSelectedPlace(spot) // [NEW] 마커 클릭 시 모달 열기
                                }}>
                              </Marker>
                            ))}
                          </MapContainer>
                        </div>

                        {/* --- 3. 추천 코스 리스트 --- */}
                        <h3>📍 추천 코스 (클릭해서 상세보기)</h3>
                        <ul className="course-list-visual">
                          {displayCourse.map((spot, idx) => (
                            <li key={idx} className="course-card" onClick={() => setSelectedPlace(spot)}>
                              <div className="card-image" style={{ backgroundImage: `url(${spot.img})` }}>
                                <span className="card-num">{idx + 1}</span>
                              </div>
                              <div className="card-info">
                                <h4>{spot.name}</h4>
                                {/* <p className="short-desc">{spot.desc.substring(0, 20)}...</p> */}
                              </div>
                            </li>
                          ))}
                        </ul>
                        
                        {/* 버튼들 */}
                        <div className="action-buttons">
                          <button className="btn-share" onClick={handleShare}>공유 하기 🔗</button>
                          <button className="btn-retry" onClick={handleReset}>다시 하기 🔄</button>
                        </div>
                      </div>

                      {/* --- [NEW] 상세보기 모달 (팝업) --- */}
                      {/* --- 상세보기 모달 (스마트폰 스타일) --- */}
                      {selectedPlace && (
                        <div className="modal-overlay" onClick={closeDetail}>
                          {/* e.stopPropagation()으로 내부 클릭 시 닫힘 방지 */}
                          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            
                            {/* 닫기 버튼 */}
                            <button className="btn-close" onClick={closeDetail}>✕</button>
                            
                            {/* 스크롤 가능한 영역 시작 */}
                            <div className="modal-body-scroll">
                              <img src={selectedPlace.img} alt={selectedPlace.name} className="modal-img" />
                              <h3 style={{marginBottom: '5px'}}>{selectedPlace.name}</h3>
                              <p className="modal-desc" style={{fontSize:'0.95rem', color:'#666'}}>{selectedPlace.desc}</p>
                              <div className="modal-likes">❤️ 이 장소를 {selectedPlace.likes}명이 좋아해요</div>

                              <hr style={{border:'0', borderTop:'1px solid #eee', margin:'20px 0'}} />
                              
                              {/* 댓글(후기) 영역 */}
                              <div className="review-section">
                                <h4 style={{marginBottom:'10px'}}>💬 실시간 여행 톡</h4>
                                <div className="review-list" style={{maxHeight:'200px'}}>
                                  {placeReviews.length === 0 ? (
                                    <p className="no-review" style={{textAlign:'center', color:'#aaa', padding:'20px'}}>
                                      첫 번째 후기를 남겨주세요! 📝
                                    </p>
                                  ) : (
                                    placeReviews.map((rev) => (
                                      <div key={rev.id} className="review-item">
                                        <span style={{fontWeight:'bold', marginRight:'6px'}}>{rev.userName}</span>
                                        <span style={{color:'#333'}}>{rev.text}</span>
                                      </div>
                                    ))
                                  )}
                                </div>
                                
                                <div className="review-input-box" style={{marginTop:'10px'}}>
                                  <input 
                                    type="text" 
                                    value={reviewText} 
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="꿀팁이나 후기를 공유해요!"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddReview()}
                                  />
                                  <button onClick={handleAddReview}>등록</button>
                                </div>
                              </div>
                            </div> 
                            {/* 스크롤 영역 끝 */}

                          </div>
                        </div>
                      )}

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