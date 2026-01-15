import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// 파이어베이스 관련 함수 불러오기
import { db } from './firebase'; 
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  increment,
  writeBatch 
} from 'firebase/firestore';

// ---------------------------------------------------------
// [초기 데이터 - DB가 비어있을 때 한 번만 업로드됨]
const initialCourseData = [
  {
    id: 1, // 정렬 순서용
    name: "송도 해상케이블카",
    lat: 35.076,
    lng: 129.017,
    img: "https://busanaircruise.co.kr/images/contents/intro-img.png",
    likes: 1240,
    desc: "바다 위를 가로지르는 짜릿한 경험! 송도 해수욕장의 전경이 한눈에 들어옵니다."
  },
  {
    id: 2,
    name: "암남공원",
    lat: 35.064,
    lng: 129.022,
    img: "https://cdn.dailysecu.com/news/photo/202508/168871_197918_198.jpg",
    likes: 958,
    desc: "조개구이 맛집들이 모여있는 곳으로 유명해요. 케이블카 타고 내려서 가기 딱!"
  },
  {
    id: 3,
    name: "남포동 커피 네루다",
    lat: 35.097,
    lng: 129.035,
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80",
    likes: 821,
    desc: "고풍스러운 인테리어와 향긋한 커피가 있는 곳. 잠시 쉬어가기 좋아요."
  },
  {
    id: 4,
    name: "부평 깡통시장",
    lat: 35.101,
    lng: 129.026,
    img: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20170228_77%2F1488249921205G9x7H_JPEG%2F186178517539663_0.jpeg",
    likes: 2105,
    desc: "부산의 맛을 제대로 느끼고 싶다면 필수! 비빔당면, 유부주머니 등 먹거리 천국."
  },
  {
    id: 5,
    name: "이재모 피자",
    lat: 35.102,
    lng: 129.030,
    img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80",
    likes: 3402,
    desc: "부산 로컬 찐 맛집. 치즈가 흘러넘치는 피자를 맛보려면 웨이팅은 필수!"
  }
];

// ---------------------------------------------------------
// [질문 데이터는 그대로 유지]
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

const results = {
  "J-Relax-Local": { mbti: "꼼꼼한 힐러", desc: "계획적이면서도 여유를 즐기는 당신!", color: "#4facfe" },
  "J-Relax-Trendy": { mbti: "감성 플래너", desc: "완벽한 동선으로 예쁜 곳만 골라가요.", color: "#a18cd1" },
  "J-Active-Local": { mbti: "열정 탐험가", desc: "부산의 찐 바이브를 느끼고 싶어하는 당신!", color: "#ff9a9e" },
  "J-Active-Trendy": { mbti: "트렌드 리더", desc: "부산에서 가장 핫한 곳은 다 가봐야 직성이 풀려요.", color: "#fbc2eb" },
  "P-Relax-Local": { mbti: "자유로운 영혼", desc: "바다 냄새 맡으며 소주 한 잔, 이게 낭만이지!", color: "#8fd3f4" },
  "P-Relax-Trendy": { mbti: "낭만 방랑자", desc: "예쁜 카페에서 하루 종일 있어도 좋아요.", color: "#cfd9df" },
  "P-Active-Local": { mbti: "에너지 부자", desc: "시장통에서 이모님이랑 친구 먹는 친화력!", color: "#ff758c" },
  "P-Active-Trendy": { mbti: "힙스터 여행러", desc: "지도 없이 걷다가 발견한 힙한 곳을 좋아해요.", color: "#a6c0fe" }
};

// ---------------------------------------------------------
// [기능: 지도 중심 이동]
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

// [기능: 번호가 표시되는 커스텀 마커 생성 함수]
const createNumberedIcon = (number) => {
  return new L.DivIcon({
    html: `<div class="custom-marker">${number}</div>`,
    className: "custom-marker-container",
    iconSize: [30, 30],
    iconAnchor: [15, 30], // 마커의 뾰족한 부분이 위치할 기준점
    popupAnchor: [0, -30]
  });
};

function App() {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [answers, setAnswers] = useState([]);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [mapCenter, setMapCenter] = useState(null);
  const [directResultKey, setDirectResultKey] = useState(null);

  // [NEW] 파이어베이스에서 불러온 장소 데이터
  const [courseData, setCourseData] = useState([]);
  
  // 모달 & 댓글 관련 상태
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeReviews, setPlaceReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");

  const contentRef = useRef(null);

  // 1. 파이어베이스에서 장소 데이터 실시간 구독 (없으면 업로드)
  useEffect(() => {
    const fetchAndInitPlaces = async () => {
      const placesRef = collection(db, "places");
      const q = query(placesRef, orderBy("id", "asc"));
      
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("DB에 장소 데이터가 없어 업로드를 시작합니다...");
        const batch = writeBatch(db);
        
        initialCourseData.forEach((place) => {
          // [수정 전] const newDocRef = doc(collection(db, "places")); 
          // [수정 후] ID를 "place_1", "place_2" 처럼 고정해서 만듭니다. 
          // 이렇게 하면 코드가 100번 실행돼도 덮어쓰기만 될 뿐 데이터가 늘어나지 않습니다.
          const newDocRef = doc(db, "places", `place_${place.id}`); 
          
          batch.set(newDocRef, place);
        });
        
        await batch.commit();
        console.log("초기 데이터 업로드 완료!");
      }
    };

    // 초기화 체크 실행
    fetchAndInitPlaces();

    // 실시간 데이터 구독 (좋아요 숫자 변경 시 자동 반영)
    const q = query(collection(db, "places"), orderBy("id", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const places = snapshot.docs.map(doc => ({
        docId: doc.id, // 파이어베이스 문서 ID (수정할 때 필요)
        ...doc.data()
      }));
      setCourseData(places);
    });

    return () => unsubscribe();
  }, []);

  // 2. 링크 공유 확인
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedResult = params.get('result');
    const sharedName = params.get('name');

    if (sharedResult && results[sharedResult]) {
      setDirectResultKey(sharedResult);
      setUserName(sharedName || "익명");
      setStep(10);
    }
  }, []);

  // 3. 리뷰 데이터 실시간 구독 (모달 열렸을 때)
  useEffect(() => {
    if (!selectedPlace) return;

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

  // --- 이벤트 핸들러들 ---

  const handleStart = (e) => {
    if (e) e.preventDefault();
    if (!userName.trim()) {
      alert("이름을 입력해주세요!");
      return;
    }
    setStep(1);
  };

  const handleAnswer = (scores) => {
    setAnswers([...answers, scores]);
    if (step < questions.length) setStep(step + 1);
    else setStep(9);
  };

  const handleBack = () => {
    if (step >= 1) {
      setStep(step - 1);
      setAnswers((prev) => prev.slice(0, -1));
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
    setUserName("");
    setLoadingPercent(0);
    setDirectResultKey(null);
    setMapCenter(null);
    window.history.pushState({}, null, window.location.pathname);
  };

  const handleShare = () => {
    const currentKey = directResultKey || calculateResultKey();
    const shareUrl = `${window.location.origin}${window.location.pathname}?result=${currentKey}&name=${userName}`;
    navigator.clipboard.writeText(shareUrl);
    alert("링크 복사 완료! 친구에게 공유하세요 💌");
  };

  const calculateResultKey = () => {
    let scoreJ = 0, scoreA = 0, scoreT = 0;
    answers.forEach(score => {
      if (score.J) scoreJ += score.J;
      if (score.P) scoreJ -= score.P;
      if (score.A) scoreA += score.A;
      if (score.R) scoreA -= score.R;
      if (score.T) scoreT += score.T;
      if (score.L) scoreT -= score.L;
    });
    const t1 = scoreJ >= 0 ? "J" : "P";
    const t2 = scoreA >= 0 ? "Active" : "Relax";
    const t3 = scoreT >= 0 ? "Trendy" : "Local";
    return `${t1}-${t2}-${t3}`;
  };

  const getResult = () => {
    if (directResultKey && results[directResultKey]) return results[directResultKey];
    const key = calculateResultKey();
    return results[key] || results["P-Active-Trendy"];
  };

  // [NEW] 좋아요 증가 함수 (파이어베이스 연동)
  const handleLike = async () => {
    if (!selectedPlace) return;
    try {
      const placeRef = doc(db, "places", selectedPlace.docId);
      await updateDoc(placeRef, {
        likes: increment(1) // 1 증가 (동시성 문제 해결)
      });
      // 로컬 state는 onSnapshot이 자동으로 업데이트해줌
      // 모달 내부 숫자도 업데이트된 courseData에서 찾아야 함
    } catch (e) {
      console.error("좋아요 업데이트 실패:", e);
    }
  };

  const handleAddReview = async () => {
    if (!reviewText.trim()) return;
    try {
      await addDoc(collection(db, "reviews"), {
        placeName: selectedPlace.name,
        text: reviewText,
        userName: userName || "익명",
        createdAt: new Date()
      });
      setReviewText("");
    } catch (e) {
      console.error("리뷰 저장 실패:", e);
    }
  };

  const closeDetail = () => {
    setSelectedPlace(null);
    setPlaceReviews([]);
  };

  // 로딩바
  useEffect(() => {
    if (step === 9) {
      let percent = 0;
      const interval = setInterval(() => {
        percent += 1;
        if (percent > 80) percent += 0.5;
        setLoadingPercent(Math.min(Math.floor(percent), 100));
        if (percent >= 100) {
          clearInterval(interval);
          
          // 결과 저장
          const saveResult = async () => {
            try {
              const resultKey = calculateResultKey();
              await addDoc(collection(db, "test_results"), {
                name: userName,
                result: resultKey,
                answers: answers,
                timestamp: new Date()
              });
            } catch (e) {
              console.error("결과 저장 에러", e);
            }
          };
          saveResult();
          setStep(10);
        }
      }, 25);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div className="app-container">
      <div className="phone-frame">
        <div className="notch"></div>
        <div className="screen">
          <div className="status-bar"><span>12:00</span><span>🔋 100%</span></div>
          <div className="content" ref={contentRef}>
            
            {step === 0 && (
              <div className="start-screen">
                <h1>부산 여행<br />유형 테스트 🗺️</h1>
                <p>나에게 딱 맞는<br />부산 여행 코스는?</p>
                <div className="emoji-graphic">🚆🏖️📸</div>
                <div className="input-group">
                  <input type="text" placeholder="이름을 입력하세요" value={userName} onChange={(e) => setUserName(e.target.value)} className="name-input" />
                </div>
                <button className="btn-primary" onClick={handleStart}>테스트 시작하기</button>
              </div>
            )}

            {step >= 1 && step <= 8 && (
              <div className="quiz-screen">
                <button className="btn-back-fixed" onClick={handleBack}>← 뒤로가기</button>
                <div className="progress-bar"><div className="fill" style={{ width: `${((step - 1) / 8) * 100}%` }}></div></div>
                <div className="question-box"><span className="q-badge">Q{step}</span><h2>{questions[step - 1].question}</h2></div>
                <div className="options">
                  {questions[step - 1].options.map((opt, idx) => (
                    <button key={`${step}-${idx}`} className="btn-option" onClick={() => handleAnswer(opt.scores)}>{opt.text}</button>
                  ))}
                </div>
              </div>
            )}

            {step === 9 && (
              <div className="loading-screen">
                <div className="loading-content">
                  <div className="spinner">✈️</div>
                  <h2>취향 분석 중...</h2>
                  <div className="percent-text">{loadingPercent}%</div>
                  <div className="loading-bar"><div className="loading-fill" style={{ width: `${loadingPercent}%` }}></div></div>
                </div>
              </div>
            )}

            {step === 10 && (
              <div className="result-screen">
                {(() => {
                  const result = getResult();
                  // 데이터가 아직 로드 안 됐으면 빈 배열
                  const displayCourse = courseData.length > 0 ? courseData : [];
                  
                  // 지도 중심 (기본값: 데이터 있으면 2번째 장소, 없으면 부산역 근처)
                  const defaultCenter = displayCourse.length > 0 
                    ? [displayCourse[1].lat, displayCourse[1].lng] 
                    : [35.115, 129.04];
                  const currentCenter = mapCenter || defaultCenter;

                  // 랭킹 정렬 (좋아요 많은 순)
                  const sortedRanking = [...displayCourse].sort((a, b) => b.likes - a.likes).slice(0, 3);

                  return (
                    <>
                      <div className="result-header" style={{ backgroundColor: result.color }}>
                        <div className="user-badge">✨ {userName}님의 여행취향 분석 완료</div>
                        <small>당신의 여행 유형은</small>
                        <h2>{result.mbti}</h2>
                      </div>

                      <div className="result-body">
                        {/* 핫플 랭킹 */}
                        <div className="ranking-section">
                          <h3>🔥 실시간 인기 랭킹 TOP 3</h3>
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

                        {/* 지도 영역 */}
                        <div className="map-container-wrapper">
                          <MapContainer center={currentCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <ChangeView center={currentCenter} />
                            
                            {/* [NEW] 번호 마커 표시 */}
                            {displayCourse.map((spot, idx) => (
                              <Marker 
                                key={spot.docId || idx} 
                                position={[spot.lat, spot.lng]}
                                icon={createNumberedIcon(idx + 1)} // 번호 아이콘 적용
                                eventHandlers={{ click: () => setSelectedPlace(spot) }}
                              >
                                <Popup>
                                  <b>{spot.name}</b><br/>클릭해서 자세히 보기
                                </Popup>
                              </Marker>
                            ))}
                          </MapContainer>
                        </div>

                        {/* 코스 리스트 */}
                        <h3>📍 추천 코스 (지도 번호와 같아요!)</h3>
                        <ul className="course-list-visual">
                          {displayCourse.map((spot, idx) => (
                            <li key={spot.docId || idx} className="course-card" onClick={() => {
                                setSelectedPlace(spot);
                                setMapCenter([spot.lat, spot.lng]);
                              }}>
                              <div className="card-image" style={{ backgroundImage: `url(${spot.img})` }}>
                                <span className="card-num">{idx + 1}</span>
                              </div>
                              <div className="card-info">
                                <h4>{spot.name}</h4>
                                
                              </div>
                            </li>
                          ))}
                        </ul>

                        <div className="action-buttons">
                          <button className="btn-share" onClick={handleShare}>공유 하기 🔗</button>
                          <button className="btn-retry" onClick={handleReset}>다시 하기 🔄</button>
                        </div>
                      </div>

                      {/* 상세보기 모달 */}
                      {selectedPlace && (
                        <div className="modal-overlay" onClick={closeDetail}>
                          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="btn-close" onClick={closeDetail}>✕</button>
                            <div className="modal-body-scroll">
                              <img src={selectedPlace.img} alt={selectedPlace.name} className="modal-img" />
                              <h3 style={{marginBottom: '5px'}}>{selectedPlace.name}</h3>
                              <p className="modal-desc" style={{fontSize:'0.95rem', color:'#666'}}>{selectedPlace.desc}</p>
                              
                              {/* [NEW] 실시간 좋아요 반영되는 부분 */}
                              <div className="modal-likes-row" style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px'}}>
                                <span style={{fontWeight:'bold', color:'#ff5e62'}}>
                                  ❤️ {courseData.find(p => p.docId === selectedPlace.docId)?.likes || selectedPlace.likes}명
                                </span>
                                <button onClick={handleLike} style={{
                                  padding: '5px 12px', borderRadius:'20px', border:'1px solid #ff5e62', 
                                  background:'white', color:'#ff5e62', cursor:'pointer', fontSize:'0.8rem'
                                }}>
                                  좋아요 누르기 👍
                                </button>
                              </div>

                              <hr style={{border:'0', borderTop:'1px solid #eee', margin:'20px 0'}} />
                              
                              {/* 댓글 영역 */}
                              <div className="review-section">
                                <h4 style={{marginBottom:'10px'}}>💬 실시간 여행 톡</h4>
                                <div className="review-list" style={{maxHeight:'200px'}}>
                                  {placeReviews.length === 0 ? (
                                    <p className="no-review" style={{textAlign:'center', color:'#aaa', padding:'20px'}}>첫 후기를 남겨주세요! 📝</p>
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
                                  <input type="text" value={reviewText} onChange={(e) => setReviewText(e.target.value)} 
                                    placeholder="후기를 남겨주세요!" onKeyPress={(e) => e.key === 'Enter' && handleAddReview()}/>
                                  <button onClick={handleAddReview}>등록</button>
                                </div>
                              </div>
                            </div> 
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