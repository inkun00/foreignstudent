'use client';

import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import styles from './ChatRoom.module.css';
import { Persona } from '../utils/personas';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

interface ChatRoomProps {
  userName: string;
  userGrade: string;
  userGender: string;
  country: string;
  personaName: string;
  persona: Persona;
  profileImageIdx: number;
  onBack: () => void;
}

function getKoreanTime(): string {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? '오후' : '오전';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 is 12
  return `${ampm} ${hours}:${minutes}`;
}

function getCountryDir(country: string): string {
  switch (country) {
    case '베트남': return 'vietnam';
    case '중국': return 'china';
    case '필리핀': return 'philippines';
    case '일본': return 'japan';
    case '러시아': return 'russia';
    case '우즈베키스탄': return 'uzbekistan';
    case '카자흐스탄': return 'kazakhstan';
    default: return 'vietnam';
  }
}

function getInitialGreeting(country: string, name: string, userName: string, userGrade: string): string {
  switch (country) {
    case '베트남':
      return `안녕 ${userName}! 우리 같은 ${userGrade}인데 우리 학교에서 마주친 적 있지? 만나서 반가워! 근데 오늘 학교 끝나고 다들 학원 가던데, 너도 학원 가?`;
    case '중국':
      return `안녕? 나 ${name}이야. 우리 같은 학교 ${userGrade}잖아! 대화할 수 있어서 기뻐. 오늘 학교 급식 맛있었어?`;
    case '필리핀':
      return `Hi! 나 ${name}야. 우리 ${userGrade} 같은 학교이지? 만나서 반가워! What's up?`;
    case '일본':
      return `안녕! ${userName}, 나 ${name}야. 우리 같은 ${userGrade} 친구인데 이렇게 카톡으로 얘기하게 돼서 반가워. 친하게 지내자!`;
    case '러시아':
      return `안녕 ${userName}. 나 ${name}. 우리 같은 학교 ${userGrade}. 너 반갑다. 오늘 수업 너무 어려워.`;
    case '우즈베키스탄':
      return `안녕 ${userName}! 나 ${name}야. 우리 같은 ${userGrade}이지? 오늘 학교에서 준비물 못 챙겨서 속상했어. 대화 나눠줘서 고마워!`;
    case '카자흐스탄':
      return `안녕. 나 ${name}. 우리 ${userGrade} 같은 학교잖아. 오늘 급식에 돼지고기 나와서 밥만 먹었다. 너무 배고파...`;
    default:
      return `안녕! 나 ${name}야. 우리 같은 ${userGrade} 친구잖아. 친하게 지내자!`;
  }
}


// Map country to custom emoji
function getCountryEmoji(country: string): string {
  switch (country) {
    case '베트남': return '🇻🇳';
    case '중국': return '🇨🇳';
    case '필리핀': return '🇵🇭';
    case '일본': return '🇯🇵';
    case '러시아': return '🇷🇺';
    case '우즈베키스탄': return '🇺🇿';
    case '카자흐스탄': return '🇰🇿';
    default: return '👶';
  }
}

// Dynamic guide suggestions per country
function getGuideSuggestions(country: string): { label: string; question: string }[] {
  switch (country) {
    case '베트남':
      return [
        { label: '📖 학업의 어려움 묻기', question: '학교 수업 들을 때 교과서 단어들이 많이 어렵니?' },
        { label: '👩 엄마의 한국어와 학교 방문 묻기', question: '엄마가 학교에 올 때 혹시 부끄러웠던 적이 있어?' },
        { label: '🎨 피부색으로 인한 소외 경험 묻기', question: '친구들이 피부색이나 생김새로 상처 주는 말을 하진 않아?' }
      ];
    case '중국':
      return [
        { label: '🇨🇳 반중 정서에 대한 생각 묻기', question: '인터넷이나 뉴스에서 중국 욕하는 걸 보면 마음이 어떠니?' },
        { label: '🏫 대림동 밖의 대인 관계 묻기', question: '대림동 밖에서 한국 친구들이랑 같이 놀 때는 어때?' },
        { label: '🏠 부모님의 근로와 홀로 있는 시간 묻기', question: '부모님이 늦게까지 일하시면 집에서 혼자 뭐해?' }
      ];
    case '필리핀':
      return [
        { label: '🤝 도구적인 친구 관계 묻기', question: '친구들이 영어 숙제 도와달라고 할 때만 다가오면 속상하지 않아?' },
        { label: '👵 어머니에 대한 사회적 시선 묻기', question: '어머니가 동남아에서 왔다고 무시받는 걸 본 적이 있어?' }
      ];
    case '일본':
      return [
        { label: '📚 역사 시간과 독도 갈등 묻기', question: '학교 역사 시간이나 독도 얘기 나올 때 친구들 눈치 보여?' },
        { label: '🤐 정체성을 숨기는 마음 묻기', question: '친구들에게 너가 일본계라는 사실을 왜 숨기는 거니?' }
      ];
    case '러시아':
      return [
        { label: '💬 언어 미숙과 고립감 묻기', question: '수업 시간에 한국어 몰라서 멍하니 앉아 있으면 외롭지 않아?' },
        { label: '📄 가정통신문 번역의 부담 묻기', question: '학교 가정통신문 부모님이 못 읽으셔서 곤란했던 적 있어?' },
        { label: '❄️ 고향 친구에 대한 향수 묻기', question: '러시아에 있는 친구들이랑 고향이 많이 보고 싶니?' }
      ];
    case '우즈베키스탄':
      return [
        { label: '🤔 외모와 언어 격차의 오해 묻기', question: '외모는 한국인 같은데 말을 못 한다고 오해나 무시당한 적 있어?' },
        { label: '🇰🇷 조국에 대한 실망감 묻기', question: '할아버지가 한국이 조국이라고 하셨는데, 와서 지내보니 어때?' },
        { label: '📦 부모님의 돌봄 공백과 준비물 묻기', question: '가정통신문 준비물을 부모님이 못 챙겨주셔서 혼난 적 있니?' }
      ];
    case '카자흐스탄':
      return [
        { label: '🍖 돼지고기 급식 제외 고충 묻기', question: '학교 급식에 돼지고기 나오면 밥 먹기 힘들 텐데 어떻게 하니?' },
        { label: '🏢 학원 뺑뺑이와 답답함 묻기', question: '한국의 빽빽한 아파트랑 학원 문화가 답답하게 느껴져?' },
        { label: '👀 주변인으로 지켜보는 고독감 묻기', question: '말이 안 통해 노는 모습을 밖에서 지켜볼 때 외롭지 않니?' }
      ];
    default:
      return [];
  }
}

export default function ChatRoom({ userName, userGrade, userGender, country, personaName, persona, profileImageIdx, onBack }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'initial',
      role: 'assistant',
      content: getInitialGreeting(country, personaName, userName, userGrade),
      time: getKoreanTime(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(true);
  
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const genderPrefix = userGender === '남학생' ? 'male' : 'female';
  const profileImgPath = `/profiles/${getCountryDir(country)}/${genderPrefix}_${profileImageIdx}.png`;


  // Scroll to bottom on new message
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessageContent = inputValue.trim();
    setInputValue('');

    const newMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessageContent,
      time: getKoreanTime(),
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Map message history to server expectations
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          personaName,
          country,
          userName,
          userGrade,
          userGender,
        }),
      });

      if (!res.ok) {
        throw new Error('API Request Failed');
      }

      const data = await res.json();

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.content,
          time: getKoreanTime(),
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: '어이쿠... 폰 네트워크 상태가 안 좋은가 봐. 다시 물어봐 줄래?',
          time: getKoreanTime(),
        },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleCapture = async () => {
    if (!chatAreaRef.current) return;

    const chatArea = chatAreaRef.current;
    
    // Save original styles
    const originalHeight = chatArea.style.height;
    const originalMaxHeight = chatArea.style.maxHeight;
    const originalOverflowY = chatArea.style.overflowY;

    try {
      // Temporarily expand the element to its full content height
      chatArea.style.height = 'auto';
      chatArea.style.maxHeight = 'none';
      chatArea.style.overflowY = 'visible';

      const canvas = await html2canvas(chatArea, {
        useCORS: true,
        backgroundColor: '#BACEE0',
        logging: false,
        scale: 2,
      });

      // Restore original styles
      chatArea.style.height = originalHeight;
      chatArea.style.maxHeight = originalMaxHeight;
      chatArea.style.overflowY = originalOverflowY;

      // Downloader trigger
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `daomtalk_chat_${personaName}_${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
    } catch (error) {
      console.error('Capture failed:', error);
      chatArea.style.height = originalHeight;
      chatArea.style.maxHeight = originalMaxHeight;
      chatArea.style.overflowY = originalOverflowY;
    }
  };

  const handleDownloadTxt = () => {
    let text = `==================================================\n`;
    text += `  다옴톡 (DaomTalk) 대화 대본 기록\n`;
    text += `==================================================\n`;
    text += `대화 일시: ${new Date().toLocaleString('ko-KR')}\n`;
    text += `대화 상대: ${personaName} (${country} 배경, ${userGrade} ${userGender})\n`;
    text += `사용자: ${userName} (${userGrade} ${userGender})\n`;
    text += `--------------------------------------------------\n\n`;

    messages.forEach((msg) => {
      const sender = msg.role === 'user' ? userName : personaName;
      text += `[${sender}] (${msg.time}):\n${msg.content}\n\n`;
    });

    text += `==================================================\n`;

    // Download trigger
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `daomtalk_transcript_${personaName}_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleSuggestionClick = (question: string) => {
    setInputValue(question);
  };

  const emoji = getCountryEmoji(country);
  const suggestions = getGuideSuggestions(country);

  // Generate today date in Korean format
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayName = days[today.getDay()];
  const dateString = `${year}년 ${month}월 ${date}일 ${dayName}`;
  return (
    <div className={styles.chatContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button id="chat-back-btn" className={styles.backBtn} onClick={onBack} aria-label="이전 화면으로 이동">
            ◀
          </button>
          <img
            src={profileImgPath}
            alt={personaName}
            className={styles.headerAvatar}
          />
          <div>
            <div className={styles.profileName}>
              {personaName} {emoji}
            </div>
            <div className={styles.roomInfo}>
              {userGrade} · {userGender} · {country} 배경 (한국어: {persona.languageLevel})
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.iconBtn} 
            onClick={handleCapture} 
            title="대화방 이미지 저장 (📸)" 
            aria-label="대화방 이미지 저장"
          >
            📸
          </button>
          <button 
            className={styles.iconBtn} 
            onClick={handleDownloadTxt} 
            title="대본 텍스트 다운로드 (📄)" 
            aria-label="대본 텍스트 다운로드"
          >
            📄
          </button>
          <button className={styles.iconBtn} aria-label="검색">🔍</button>
          <button className={styles.iconBtn} aria-label="메뉴">☰</button>
        </div>
      </header>

      {/* Empathetic Suggestions Guide Card */}
      {suggestions.length > 0 && (
        <div className={styles.guideBanner}>
          <div 
            id="guide-header"
            className={styles.guideHeader} 
            onClick={() => setIsGuideOpen(!isGuideOpen)}
          >
            <div className={styles.guideTitle}>
              💡 공감 대화 힌트 (질문 가이드)
            </div>
            <button id="guide-toggle-btn" className={styles.guideToggleBtn}>
              {isGuideOpen ? '닫기 ▲' : '열기 ▼'}
            </button>
          </div>
          {isGuideOpen && (
            <div className={styles.guideContent}>
              <p>친구의 고충을 이끌어내기 위해 아래 질문들을 클릭하여 대화해 보세요:</p>
              <ul className={styles.guideList}>
                {suggestions.map((item, idx) => (
                  <li key={idx}>
                    <button
                      id={`suggestion-btn-${idx}`}
                      data-testid={`suggestion-btn-${idx}`}
                      onClick={() => handleSuggestionClick(item.question)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '12px',
                        padding: '2px 0'
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Chat Area */}
      <div className={styles.chatArea} ref={chatAreaRef}>
        {/* System Message */}
        <div className={styles.systemContainer}>
          <div className={styles.systemMsg}>
            🔒 {personaName} 친구와의 1:1 대화방이 활성화되었습니다.<br/>
            서로 같은 학교의 같은 학년({userGrade}), 같은 성별({userGender}) 친구 관계입니다.
          </div>
        </div>

        {/* Date Divider */}
        <div className={styles.dateDivider}>
          <span className={styles.datePill}>{dateString}</span>
        </div>

        {/* Messages */}
        {messages.map((msg) => {
          const isMe = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`${styles.messageRow} ${isMe ? styles.messageRowMe : styles.messageRowOther}`}
              data-testid="message-row"
            >
              {!isMe && (
                <img
                  src={profileImgPath}
                  alt={personaName}
                  className={styles.avatarImage}
                />
              )}
              <div className={styles.bubbleCol}>
                {!isMe && <span className={styles.senderName}>{personaName}</span>}
                <div className={styles.bubbleAndInfo}>
                  <div className={`${styles.bubble} ${isMe ? styles.bubbleMe : styles.bubbleOther}`} data-testid="message-bubble">
                    {msg.content}
                  </div>
                  <div className={`${styles.infoCol} ${isMe ? styles.infoColMe : ''}`}>
                    <span className={styles.unreadMark}></span>
                    <span className={styles.timeLabel}>{msg.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className={`${styles.messageRow} ${styles.messageRowOther}`} data-testid="typing-row">
            <img
              src={profileImgPath}
              alt={personaName}
              className={styles.avatarImage}
            />
            <div className={styles.bubbleCol}>
              <span className={styles.senderName}>{personaName}</span>
              <div className={styles.bubbleAndInfo}>
                <div className={styles.typingBubble} data-testid="typing-indicator">
                  <span className="dot-bounce"></span>
                  <span className="dot-bounce"></span>
                  <span className="dot-bounce"></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <footer className={styles.inputBar}>
        <button className={styles.plusBtn} aria-label="메뉴 추가">+</button>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            id="chat-input-field"
            className={styles.inputField}
            placeholder="메시지를 입력하세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isTyping}
          />
        </div>
        <button className={styles.emoticonBtn} aria-label="이모티콘">☺</button>
        <button
          id="chat-send-btn"
          className={`${styles.sendButton} ${inputValue.trim() && !isTyping ? styles.sendActive : ''}`}
          onClick={handleSend}
          disabled={!inputValue.trim() || isTyping}
        >
          전송
        </button>
      </footer>
    </div>
  );
}
