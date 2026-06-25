import { test, expect } from '@playwright/test';

test.describe('DaomTalk Chat App Flow', () => {
  test('should go through lobby, start chat, send messages, and trigger narrative shift at turn 5', async ({ page }) => {
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
    await expect(page.locator('text=학생과의 1:1 대화방이 활성화되었습니다.')).toBeVisible();

    // The greeting is rendered
    const initialBubbles = page.locator('[data-testid="message-bubble"]');
    await expect(initialBubbles).toHaveCount(1);
    
    // Check initial greeting content
    const greetingText = await initialBubbles.first().innerText();
    expect(greetingText).toContain('나 ');
    expect(greetingText).toContain('살고 있어');

    // 7. Click a suggestion button to fill message
    const suggestionBtn = page.locator('[data-testid="suggestion-btn-0"]');
    await expect(suggestionBtn).toBeVisible();
    const suggestionText = await suggestionBtn.innerText();
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
    await expect(lastBubble).toContainText('안 미워할 거지');
  });
});
