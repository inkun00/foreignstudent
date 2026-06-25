import { test, expect } from '@playwright/test';

test.describe('DaomTalk Chat App Flow', () => {
  test('should go through lobby, start chat, send messages, and trigger narrative shift at turn 5', async ({ page }) => {
    // Mock the /api/chat endpoint
    await page.route('**/api/chat', async (route) => {
      const request = route.request();
      const payload = JSON.parse(request.postData() || '{}');
      const messages = payload.messages || [];
      const userMessages = messages.filter((m: { role: string; content: string }) => m.role === 'user');
      const turnCount = userMessages.length;
      
      let reply = '응! 그렇구나. 근데 학교 급식에 뭐 맛있는 거 나왔어?';
      if (turnCount >= 5) {
        reply = `사실 너한테만 말하는 건데... 나 학교에서 친구들이 내 피부색이 까맣다고 '동남아 가라'고 속닥거릴 때 진짜 외롭고 슬퍼. 엄마 발음 놀릴 때도 너무 속상해서 집에 와서 혼자 울었어. 다른 친구들은 부모님이랑 매주 쇼핑 가고 공부도 잘 도와주는데 우리는 서툴러서 부러워... 너도 나 미워할 거 아니지?`;
      } else {
        const lastUserMsg = userMessages[userMessages.length - 1]?.content || '';
        if (lastUserMsg.includes('어렵')) {
          reply = `수업 시간 중에 한자어나 국어 서술형 문제가 너무 어렵더라.`;
        }
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: reply,
          isMock: true,
        }),
      });
    });

    // 1. Go to landing page
    await page.goto('/');

    // 2. Check lobby elements
    await expect(page.locator('h1')).toHaveText('다옴톡 (DaomTalk)');
    const startBtn = page.locator('#start-chat-btn');
    await expect(startBtn).toBeDisabled();

    // 3. Fill in user name
    await page.fill('#user-name-input', '테스터');
    await expect(startBtn).toBeDisabled();

    // 4. Select Vietnam country card
    const vietnamCard = page.locator('[data-testid="country-card-베트남"]');
    await vietnamCard.click();
    await expect(vietnamCard).toHaveAttribute('aria-pressed', 'true');

    // 5. Start chat
    await expect(startBtn).toBeEnabled();
    await startBtn.click();

    // 6. Verify chatroom initialization
    await expect(page.locator('#chat-back-btn')).toBeVisible();
    await expect(page.locator('text=친구와의 1:1 대화방이 활성화되었습니다.')).toBeVisible();

    // The greeting is rendered
    const initialBubbles = page.locator('[data-testid="message-bubble"]');
    await expect(initialBubbles).toHaveCount(1);
    
    // Check initial greeting content
    const greetingText = await initialBubbles.first().innerText();
    expect(greetingText).toContain('반가워');
    expect(greetingText).toContain('학원');

    // 7. Click a suggestion button to fill message
    const suggestionBtn = page.locator('[data-testid="suggestion-btn-0"]');
    await expect(suggestionBtn).toBeVisible();
    // e.g. "📖 학업의 어려움 묻기" -> will fill "학교 수업 들을 때 교과서 단어들이 많이 어렵니?"
    await suggestionBtn.click();

    // Check input field populated
    const inputField = page.locator('#chat-input-field');
    await expect(inputField).not.toHaveValue('');

    // Send the first message
    const sendBtn = page.locator('#chat-send-btn');
    await expect(sendBtn).toBeEnabled();
    await sendBtn.click();

    // Verify user bubble is added (now 2 bubbles: 1 assistant, 1 user)
    await expect(initialBubbles).toHaveCount(2);

    // Wait for the bot to reply (typing indicator shows then disappears, or typing delay simulates response)
    // The bot's reply will make it 3 bubbles
    await expect(initialBubbles).toHaveCount(3);

    // 8. Send 4 more messages to reach turnCount = 5 for REQ-08
    // Let's send 4 simple messages: "응", "그래", "그렇구나", "힘내"
    const messagesToSend = ['응', '그래', '그렇구나', '힘내'];
    for (let i = 0; i < messagesToSend.length; i++) {
      const bubbleCountBefore = await initialBubbles.count();
      
      await page.fill('#chat-input-field', messagesToSend[i]);
      await page.click('#chat-send-btn');
      
      // Wait for user bubble
      await expect(initialBubbles).toHaveCount(bubbleCountBefore + 1);
      // Wait for bot reply
      await expect(initialBubbles).toHaveCount(bubbleCountBefore + 2);
    }

    // Now turnCount = 5 (the user has sent 5 messages).
    // The 5th bot response should contain the narrative shift text.
    const lastBubble = initialBubbles.last();
    await expect(lastBubble).toContainText('사실 너한테만 말하는 건데');
    await expect(lastBubble).toContainText('피부색');
    await expect(lastBubble).toContainText('미워할 거 아니지');
  });
});
