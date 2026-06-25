'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { personas, Persona } from './utils/personas';
import ChatRoom from './components/ChatRoom';

export default function Home() {
  const [userName, setUserName] = useState('');
  const [userGrade, setUserGrade] = useState('5학년');
  const [userGender, setUserGender] = useState('남학생');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [personaName, setPersonaName] = useState('');
  const [persona, setPersona] = useState<Persona | null>(null);
  const [profileImageIdx, setProfileImageIdx] = useState(1);

  const handleStartChat = () => {
    if (!userName.trim() || !selectedCountry) return;

    const chosenPersona = personas[selectedCountry];
    if (!chosenPersona) return;

    // Dynamically select a random name matching the user's gender
    const nameList = userGender === '남학생' ? chosenPersona.defaultNamesMale : chosenPersona.defaultNamesFemale;
    const randomName = nameList[Math.floor(Math.random() * nameList.length)];

    const randomImgIdx = Math.floor(Math.random() * 5) + 1;

    setPersona(chosenPersona);
    setPersonaName(randomName);
    setProfileImageIdx(randomImgIdx);
    setIsChatting(true);
  };

  const handleBack = () => {
    setIsChatting(false);
    setPersona(null);
    setPersonaName('');
  };

  const countries = Object.keys(personas);

  // Map country to custom flag emoji
  const getFlag = (country: string) => {
    switch (country) {
      case '베트남': return '🇻🇳';
      case '중국': return '🇨🇳';
      case '필리핀': return '🇵🇭';
      case '일본': return '🇯🇵';
      case '러시아': return '🇷🇺';
      case '우즈베키스탄': return '🇺🇿';
      case '카자흐스탄': return '🇰🇿';
      default: return '📍';
    }
  };

  const isFormValid = userName.trim() !== '' && selectedCountry !== '';

  return (
    <main className={styles.container}>
      <div className={styles.device}>
        {isChatting && persona ? (
          <ChatRoom
            userName={userName}
            userGrade={userGrade}
            userGender={userGender}
            country={selectedCountry}
            personaName={personaName}
            persona={persona}
            profileImageIdx={profileImageIdx}
            onBack={handleBack}
          />
        ) : (
          <div className={`${styles.lobby} animate-fade-in`}>
            {/* Branding */}
            <div className={styles.brandArea}>
              <span className={styles.brandEmoji} aria-hidden="true">💬</span>
              <h1 className={styles.title}>다옴톡 (DaomTalk)</h1>
              <p className={styles.subtitle}>이주배경 초등학생 공감 메신저 시뮬레이터</p>
            </div>

            {/* Input Form */}
            <div className={styles.formSection}>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup} style={{ flex: 2 }}>
                  <label htmlFor="user-name-input" className={styles.label}>
                    본인의 이름 (닉네임)
                  </label>
                  <input
                    id="user-name-input"
                    type="text"
                    className={styles.textInput}
                    placeholder="이름 입력"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    maxLength={10}
                  />
                </div>

                <div className={styles.inputGroup} style={{ flex: 1.5 }}>
                  <label htmlFor="user-grade-select" className={styles.label}>
                    학년
                  </label>
                  <select
                    id="user-grade-select"
                    className={styles.selectInput}
                    value={userGrade}
                    onChange={(e) => setUserGrade(e.target.value)}
                  >
                    <option value="1학년">1학년</option>
                    <option value="2학년">2학년</option>
                    <option value="3학년">3학년</option>
                    <option value="4학년">4학년</option>
                    <option value="5학년">5학년</option>
                    <option value="6학년">6학년</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <span className={styles.label}>본인의 성별</span>
                <div className={styles.genderGroup}>
                  <button
                    type="button"
                    className={`${styles.genderButton} ${userGender === '남학생' ? styles.genderActive : ''}`}
                    onClick={() => setUserGender('남학생')}
                  >
                    🙋‍♂️ 남학생
                  </button>
                  <button
                    type="button"
                    className={`${styles.genderButton} ${userGender === '여학생' ? styles.genderActive : ''}`}
                    onClick={() => setUserGender('여학생')}
                  >
                    🙋‍♀️ 여학생
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <span className={styles.label}>대화할 친구의 국적 선택</span>
                <div className={styles.grid}>
                  {countries.map((countryName) => {
                    const countryInfo = personas[countryName];
                    const flag = getFlag(countryName);
                    const isSelected = selectedCountry === countryName;

                    return (
                      <div
                        key={countryName}
                        id={`country-card-${countryName}`}
                        data-testid={`country-card-${countryName}`}
                        className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
                        onClick={() => setSelectedCountry(countryName)}
                        role="button"
                        aria-pressed={isSelected}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedCountry(countryName);
                          }
                        }}
                      >
                        <span className={styles.flag} aria-hidden="true">{flag}</span>
                        <span className={styles.countryName}>{countryName}</span>
                        <span className={styles.typeBadge}>
                          {countryInfo.immigrantType.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <button
              id="start-chat-btn"
              className={`${styles.startButton} ${isFormValid ? styles.startActive : ''}`}
              onClick={handleStartChat}
              disabled={!isFormValid}
            >
              대화 시작하기 (카카오톡 연결)
            </button>

            {/* Footer info */}
            <footer className={styles.footer}>
              <p>본 서비스는 이주배경 아동이 학교·가정 생활에서 겪는</p>
              <p>실제 고충을 공감하고 이해하도록 돕는 교육용 모바일 체험기입니다.</p>
              <p style={{ marginTop: '8px', fontSize: '10px' }}>Powered by Next.js & HyperCLOVA X</p>
            </footer>
          </div>
        )}
      </div>
    </main>
  );
}
