import { NextResponse } from 'next/server';
import { personas, generateSystemPrompt } from '@/app/utils/personas';

function getMockResponse(country: string, name: string, userName: string, userGrade: string, userGender: string, history: { role: string; content: string }[]): string {
  const userMessages = history.filter(m => m.role === 'user');
  const lastUserMsg = userMessages[userMessages.length - 1]?.content || '';
  const turnCount = userMessages.length;

  if (country === '베트남') {
    if (turnCount >= 5) {
      return `사실 너한테만 말하는 건데... 나 학교에서 친구들이 내 피부색이 까맣다고 '동남아 가라'고 속닥거릴 때 진짜 외롭고 슬퍼. 엄마 발음 놀릴 때도 너무 속상해서 집에 와서 혼자 울었어. 다른 친구들은 부모님이랑 매주 쇼핑 가고 공부도 잘 도와주는데 우리는 서툴러서 부러워... 너도 나 미워할 거 아니지?`;
    }
    if (lastUserMsg.includes('학년') || lastUserMsg.includes('나이') || lastUserMsg.includes('안녕') || lastUserMsg.includes('반갑')) {
      return `응! 나는 너랑 같은 ${userGrade}잖아! 우리 학교에서 마주쳤을 수도 있겠다. 체육 시간 좋아하는데 피구 하는 거 진짜 꿀잼이야!`;
    }
    if (lastUserMsg.includes('부모') || lastUserMsg.includes('엄마') || lastUserMsg.includes('베트남') || lastUserMsg.includes('가족') || lastUserMsg.includes('집')) {
      return `우리 엄마 베트남에서 왔는데 한국말 쪼금 서툴러. 그래서 학교 공개수업 때 엄마 오면 친구들이 엄마 말투 따라하고 놀릴까 봐 저번에 쪼금 부끄러웠어... 근데 다른 애들은 엄마가 알림장 다 챙겨주니까 부럽기도 해.`;
    }
    if (lastUserMsg.includes('고민') || lastUserMsg.includes('힘들') || lastUserMsg.includes('친구') || lastUserMsg.includes('차별') || lastUserMsg.includes('외로')) {
      return `운동장에서 피구 할 때 친구들이 내 피부색이 쪼금 까맣다고 '동남아 가라'면서 속닥거릴 때가 있어. 그럴 땐 기분 진짜 나쁘고 그냥 집에 가고 싶어.`;
    }
    if (lastUserMsg.includes('공부') || lastUserMsg.includes('수업') || lastUserMsg.includes('어려워')) {
      return `수업 시간 중에 한자어나 국어 서술형 문제가 너무 어렵더라. 집에서 엄마가 물어봐도 잘 모르니까 학원이라도 다녀야 하나 고민돼. 너는 학원 다녀?`;
    }
    return `응! 그렇구나. 근데 학교 급식에 뭐 맛있는 거 나왔어?`;
  }
  
  if (country === '중국') {
    if (turnCount >= 5) {
      return `저기... 실은 너한테만 말하는 건데, 인터넷에서 중국 욕하는 글 보면 가슴이 쿵쾅거려. 친구들이 나보고 중국으로 돌아가라 할까 봐 매일 무서워. 대림동 밖으로 나가면 나를 피하는 것 같고 다른 친구들은 가족들이랑 여행 가고 학원도 다니는 거 보면 부러워...`;
    }
    if (lastUserMsg.includes('중국') || lastUserMsg.includes('고향') || lastUserMsg.includes('인터넷') || lastUserMsg.includes('뉴스') || lastUserMsg.includes('욕') || lastUserMsg.includes('안녕') || lastUserMsg.includes('반갑')) {
      return `인터넷에서 사람들이 중국 욕하는 글 보면 너무 무서워. 학교에서 친구들이 나한테 중국에 대해 물어보면 가슴이 쿵쾅거려. 내가 중국에서 왔다는 걸 말하면 애들이 싫어할까 봐 걱정돼.`;
    }
    if (lastUserMsg.includes('친구') || lastUserMsg.includes('대림동') || lastUserMsg.includes('외로') || lastUserMsg.includes('놀')) {
      return `나는 대림동에서 주로 중국 친구들이랑 놀아. 한국 친구들이랑 대화하면 말이 잘 안 통하고, 은근히 우리를 피하는 게 느껴져서 그냥 우리끼리 모이게 돼.`;
    }
    if (lastUserMsg.includes('부모') || lastUserMsg.includes('엄마') || lastUserMsg.includes('아빠') || lastUserMsg.includes('가족')) {
      return `엄마 아빠 늦게까지 일해. 식당이랑 노가다 일 하셔서 밤 10시에 오셔. 나 집에서 혼자 컴퓨터 게임 하거나 중국 영상 봐. 쪼금 쓸쓸해.`;
    }
    return `응... 너 혹시 나보고 중국으로 가라고 할 거야? 그런 말 들으면 상처받아.`;
  }

  if (country === '필리핀') {
    if (turnCount >= 5) {
      return `Actually, 너한테만 말하는 건데... 친구들이 영어 숙제나 수행평가 물어볼 때만 친한 척해서 속상해. 진짜 놀 때는 지들끼리 놀고 나 안 끼워주니까... 내가 영어 기계도 아니고 슬퍼. 그리고 엄마가 동남아 사람이라고 무시받는 거 보면 너무 화나. 매주 주말에 가족 외식하는 애들 보면 너무 부러워.`;
    }
    if (lastUserMsg.includes('영어') || lastUserMsg.includes('공부') || lastUserMsg.includes('친구') || lastUserMsg.includes('숙제') || lastUserMsg.includes('안녕') || lastUserMsg.includes('반갑')) {
      return `반 친구들이 영어 숙제나 수행평가 있을 때만 나한테 엄청 친한 척 다가와. 근데 그거 끝나면 지들끼리만 놀고 나 안 끼워줘. 진짜 Oh my god이야. 내가 영어 기계도 아니고 속상해...`;
    }
    if (lastUserMsg.includes('엄마') || lastUserMsg.includes('필리핀') || lastUserMsg.includes('차별') || lastUserMsg.includes('편견')) {
      return `우리 엄마 필리핀 사람인데 영어도 잘하고 엄청 똑똑해. 근데 시장 사람들이 엄마한테 동남아에서 왔다고 무시하고 반말할 때 너무 화나. 왜 다문화 가정이라고 무시하는지 모르겠어.`;
    }
    return `Anyway, 나는 학교 급식 먹는 건 좋아해! 맛있는 거 많이 나오니까. 너는 학교에서 무슨 시간이 제일 좋아?`;
  }

  if (country === '일본') {
    if (turnCount >= 5) {
      return `사실... 처음으로 털어놓는 건데, 학교 역사 시간에 독도나 옛날 역사 얘기가 나오면 제 가슴이 쿵쾅거리고 다른 애들 눈치를 보게 돼요. 사실 제 어머니가 일본인이시거든요. 친구들이 '쪽바리'라고 욕할 때 억지로 웃으면서 넘겼는데, 그게 너무 아프고 외로웠어요... 눈치 안 보고 가족 얘기하는 다른 친구들이 너무 부러워요.`;
    }
    if (lastUserMsg.includes('역사') || lastUserMsg.includes('수업') || lastUserMsg.includes('독도') || lastUserMsg.includes('일본') || lastUserMsg.includes('안녕') || lastUserMsg.includes('반갑')) {
      return `사실 학교 역사 시간에 독도나 옛날 역사 얘기가 나오면 반 친구들이 흥분해서 일본 욕을 할 때가 있어요. 그럴 때면 제 가슴이 쿵쾅거리고 다른 애들 눈치를 보게 돼요. 친구들한테 제가 일본인 어머니를 뒀다는 걸 숨기는 편이에요...`;
    }
    if (lastUserMsg.includes('친구') || lastUserMsg.includes('상처') || lastUserMsg.includes('차별') || lastUserMsg.includes('소외')) {
      return `애들이 장난으로라도 일본 사람 비하하는 말을 하면 마음이 쪼금 아프지만, 제가 심각해지면 반 분위기가 어색해지니까 그냥 같이 웃으면서 넘어가요. 그게 쪼금 외롭기도 해요.`;
    }
    return `어머니께서 평소에 예의를 많이 강조하셔서, 저도 모르게 행동을 조심하게 되는 것 같아요. 대화 나누어주셔서 감사해요!`;
  }

  if (country === '러시아') {
    if (turnCount >= 5) {
      return `나... 너한테만 말하다. 한국어 너무 어렵다. 수업 시간 하루 종일 멍하니 있다. 친구 없다. 러시아 친구, 러시아 겨울 눈 너무 그립다. 친구들끼리 한국어로 농담하고 깔깔 웃는 거 보면 너무 부럽다. 나 화난 거 아니다. 그냥 슬프고 외롭다. 내 말 들어줘서 고맙다...`;
    }
    if (lastUserMsg.includes('친구') || lastUserMsg.includes('학교') || lastUserMsg.includes('수업') || lastUserMsg.includes('말') || lastUserMsg.includes('안녕') || lastUserMsg.includes('반갑')) {
      return `나 한국말 잘 못하다. 수업 시간 어렵다. 선생님 말 몰라. 그냥 멍하니 있다. 친구 말 걸면 긴장하다. 대답 안 하니까 친구들 나 화났다 생각하다... 너무 슬프다.`;
    }
    if (lastUserMsg.includes('고향') || lastUserMsg.includes('러시아') || lastUserMsg.includes('친구들') || lastUserMsg.includes('그리워')) {
      return `러시아 고향 친구들 보고 싶다. 겨울에 눈 많이 오고 같이 놀다. 한국 외롭다. 엄마 아빠도 공장에서 밤늦게 와서 말할 사람 없다.`;
    }
    if (lastUserMsg.includes('부모') || lastUserMsg.includes('엄마') || lastUserMsg.includes('아빠') || lastUserMsg.includes('편지') || lastUserMsg.includes('알림장')) {
      return `가정통신문 너무 어렵다. 엄마 아빠 한국어 없다. 내가 번역기 돌려서 읽다. 가끔 준비물 못 챙겨서 선생님한테 혼나다. 눈물 난다.`;
    }
    return `Nu (Ну), 나 한국어 더 많이 배우고 싶다. 하지만 어렵다. 너 나랑 놀다 고맙다.`;
  }

  if (country === '우즈베키스탄') {
    if (turnCount >= 5) {
      return `사실 나 여기에만 말해요. 나 외모 한국 사람 같아. 근데 말 더듬더듬해서 애들이 '러시아 녀석'이라고 불러. 나 이방인 같고 슬퍼. 부모님 밤늦게까지 일하고... 매일 우즈베키스탄 돌아가고 싶어서 밤에 울어요. 학교 올 때 준비물 다 엄마가 챙겨주는 한국 친구들 너무 부러워요...`;
    }
    if (lastUserMsg.includes('말') || lastUserMsg.includes('한국어') || lastUserMsg.includes('친구') || lastUserMsg.includes('이방인') || lastUserMsg.includes('무시') || lastUserMsg.includes('안녕') || lastUserMsg.includes('반갑')) {
      return `나는 얼굴 한국 사람 비슷해. 그래서 친구들 처음에 나보고 말 걸었어. 근데 내가 한국말 더듬더듬하니까 애들이 놀랐어. 어떤 애는 '러시아 녀석'이라고 부르고 나랑 안 놀아. 나 쪼금 이방인 같아.`;
    }
    if (lastUserMsg.includes('부모') || lastUserMsg.includes('엄마') || lastUserMsg.includes('아빠') || lastUserMsg.includes('준비물') || lastUserMsg.includes('혼나')) {
      return `부모님 공장에서 12시간 일해요. 너무 피곤해. 알림장 다 한국말이야. 엄마 아빠 몰라요. 나 학교 준비물 못 챙겨서 선생님한테 혼났어. 억울해요.`;
    }
    if (lastUserMsg.includes('고민') || lastUserMsg.includes('힘들') || lastUserMsg.includes('슬프')) {
      return `할아버지가 한국이 우리 조국이라고 해서 왔는데, 여기 사람들 우리한테 차갑다. 말 안 통해서 너무 힘들어요. 매일 우즈베키스탄 돌아가고 싶어.`;
    }
    return `선생님, 나한테 숙제 줬어? 나 몰라요. 내일 학교 가는 거 쪼금 무서워요.`;
  }

  if (country === '카자흐스탄') {
    if (turnCount >= 5) {
      return `나... 사실 이야기하고 싶다. 급식 돼지고기 안 돼서 맨날 밥이랑 김만 먹어. 배고파. 친구들 편식쟁이라 놀려. 그리고 아파트 좁고 학원 많아 숨막혀. 카자흐스탄 넓은 초원, 친구들 너무 보고 싶어. 급식 맛있게 다 먹는 한국 애들 너무 부러워... 외롭다...`;
    }
    if (lastUserMsg.includes('급식') || lastUserMsg.includes('돼지고기') || lastUserMsg.includes('음식') || lastUserMsg.includes('밥') || lastUserMsg.includes('안녕') || lastUserMsg.includes('반갑')) {
      return `학교 급식 돼지고기 많아요. 나 먹을 수 없다. 종교 때문에 돼지고기 안 돼요. 그래서 밥이랑 김만 먹어요. 배고파요. 애들이 나보고 편식쟁이라고 놀려요. 기분 안 좋아.`;
    }
    if (lastUserMsg.includes('학교') || lastUserMsg.includes('한국') || lastUserMsg.includes('학원') || lastUserMsg.includes('스트레스')) {
      return `한국 아파트 너무 좁아. 학교 끝나고 애들 다 학원 가요. 나는 학원 안 가는데 놀 친구 없다. 카자흐스탄 초원 그립다. 거기는 넓어서 말 타고 뛰어놀았어.`;
    }
    if (lastUserMsg.includes('말') || lastUserMsg.includes('한국어') || lastUserMsg.includes('친구')) {
      return `한국어 너무 어려워. 단어 몰라요. 친구들이랑 놀고 싶지만 말 안 돼서 그냥 구경만 해요. 외로워요.`;
    }
    return `카자흐스탄 친구들 보고 싶다. 돼지고기 안 들어간 급식 있으면 좋겠다...`;
  }

  return `안녕! 나 ${name}야. 우리 사이좋게 지내자!`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, personaName, country, userName, userGrade, userGender } = body;

    if (!messages || !personaName || !country || !userName || !userGrade || !userGender) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const persona = personas[country];
    if (!persona) {
      return NextResponse.json({ error: 'Invalid country specified' }, { status: 400 });
    }

    const turnCount = messages.filter((m: { role: string; content: string }) => m.role === 'user').length;
    const hcxApiKey = process.env.HCX_API_KEY;
    const hcxApiGwKey = process.env.HCX_APIGW_KEY;

    // We only require HCX_API_KEY. If present, we can use Playground endpoint or API Gateway endpoint.
    if (!hcxApiKey) {
      console.log(`[DaomTalk] API Key missing. Falling back to Mock Mode for country: ${country}, turnCount: ${turnCount}`);
      const mockReply = getMockResponse(country, personaName, userName, userGrade, userGender, messages);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // typing delay simulator
      return NextResponse.json({
        content: mockReply,
        isMock: true,
      });
    }

    const systemPrompt = generateSystemPrompt(persona, personaName, userName, userGrade, userGender, turnCount);

    let endpoint = '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    interface RequestBodyType {
      messages: { role: string; content: string }[];
      topP: number;
      topK: number;
      maxTokens: number;
      temperature: number;
      repeatPenalty?: number;
      repetitionPenalty?: number;
    }

    const requestBody: RequestBodyType = {
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      ],
      topP: 0.8,
      topK: 0,
      maxTokens: 256,
      temperature: 0.5,
    };

    if (hcxApiGwKey) {
      // 1. API Gateway mode (Service App)
      endpoint = 'https://clovastudio.apigw.ntruss.com/testapp/v1/chat-completions/HCX-005';
      headers['X-NCP-CLOVASTUDIO-API-KEY'] = hcxApiKey;
      headers['X-NCP-APIGW-API-KEY'] = hcxApiGwKey;
      requestBody.repeatPenalty = 5.0;
    } else {
      // 2. Playground direct API mode (v3 stream/completions)
      endpoint = 'https://clovastudio.stream.ntruss.com/v3/chat-completions/HCX-005';
      headers['Authorization'] = `Bearer ${hcxApiKey}`;
      requestBody.repetitionPenalty = 1.1;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[DaomTalk] HyperCLOVA API error:', errorText);
      const mockReply = getMockResponse(country, personaName, userName, userGrade, userGender, messages);
      return NextResponse.json({
        content: mockReply,
        isMock: true,
        apiError: true,
      });
    }

    const data = await response.json();
    const assistantMessage = 
      data.choices?.[0]?.message?.content || 
      data.result?.message?.content || 
      '';

    return NextResponse.json({
      content: assistantMessage,
      isMock: false,
    });

  } catch (error) {
    console.error('[DaomTalk] API route crash:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
