// ═══════════════════════════════════════════
// ДИАЛОГ · 18.05.2025 — TELEGRAM + МЫСЛИ
// ═══════════════════════════════════════════

const chatMessages = document.getElementById('chat-messages');
const chatChoices = document.getElementById('chat-choices');
const typingIndicator = document.getElementById('typing-indicator');

let messageCounter = 0;
const messageTexts = {};

function scrollToBottom() {
    requestAnimationFrame(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

function showTyping() {
    typingIndicator.classList.remove('hidden');
    scrollToBottom();
}

function hideTyping() {
    typingIndicator.classList.add('hidden');
}

function highlightMessage(id) {
    document.querySelectorAll('.message').forEach(m => m.classList.remove('highlighted'));
    const target = document.getElementById('msg-' + id);
    if (target) {
        target.classList.add('highlighted');
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => target.classList.remove('highlighted'), 2500);
    }
}

function createMessageElement(text, type, replyTo = null, authorLabel = null) {
    const id = ++messageCounter;
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.id = 'msg-' + id;
    
    const displayText = text || '';
    messageTexts[id] = displayText;
    
    // Если это мысль — добавляем подпись
    if (type === 'thought' && authorLabel) {
        const authorDiv = document.createElement('div');
        authorDiv.className = `thought-author ${authorLabel}`;
        authorDiv.textContent = authorLabel === 'her-thought' ? '💭 Ты думаешь...' : '💭 Сашка думает...';
        msg.appendChild(authorDiv);
    }
    
    if (replyTo !== null && messageTexts[replyTo]) {
        const replyPreview = document.createElement('div');
        replyPreview.className = 'reply-preview';
        const quoteText = messageTexts[replyTo];
        replyPreview.textContent = quoteText.length > 40 ? quoteText.substring(0, 37) + '...' : quoteText;
        replyPreview.title = 'Нажмите чтобы увидеть сообщение';
        replyPreview.addEventListener('click', (e) => {
            e.stopPropagation();
            highlightMessage(replyTo);
        });
        msg.appendChild(replyPreview);
    }
    
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    msg.appendChild(textSpan);
    
    return { element: msg, id: id };
}

// Она отправляет текст
function sheSends(text, delay = 400, replyTo = null) {
    return new Promise(resolve => {
        setTimeout(() => {
            const { element, id } = createMessageElement(text, 'hers', replyTo);
            chatMessages.appendChild(element);
            scrollToBottom();
            resolve(id);
        }, delay);
    });
}

// Она отправляет мысль
function sheThinks(text, delay = 600) {
    return new Promise(resolve => {
        setTimeout(() => {
            const { element, id } = createMessageElement(text, 'thought', null, 'her-thought');
            chatMessages.appendChild(element);
            scrollToBottom();
            resolve(id);
        }, delay);
    });
}

// Он отправляет текст
function heSends(text, delay = 800, replyTo = null) {
    return new Promise(resolve => {
        showTyping();
        setTimeout(() => {
            hideTyping();
            const { element, id } = createMessageElement(text, 'his', replyTo);
            chatMessages.appendChild(element);
            scrollToBottom();
            resolve(id);
        }, delay);
    });
}

// Он отправляет мысль
function heThinks(text, delay = 600) {
    return new Promise(resolve => {
        setTimeout(() => {
            const { element, id } = createMessageElement(text, 'thought', null, 'his-thought');
            chatMessages.appendChild(element);
            scrollToBottom();
            resolve(id);
        }, delay);
    });
}

function addDate(text) {
    const date = document.createElement('div');
    date.className = 'message-date';
    date.textContent = text;
    chatMessages.appendChild(date);
    scrollToBottom();
}

function showHerChoices(choices) {
    chatChoices.innerHTML = '';
    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.label;
        btn.addEventListener('click', () => {
            chatChoices.innerHTML = '';
            if (choice.action) choice.action();
        });
        chatChoices.appendChild(btn);
    });
    scrollToBottom();
}

// ===== ЗАПУСК ЧАТА =====
function startChat() {
    chatMessages.innerHTML = '';
    messageCounter = 0;
    for (const key in messageTexts) delete messageTexts[key];
    
    addDate('18 мая 2025');
    
    // 1. Она: большое сообщение с признанием
    showHerChoices([
        { label: 'Я вообще так обожаю тебяяя...', action: async () => {
            await sheSends('Я вообще так обожаю тебяяя. ты ваще такой родной, с тобой оч комфортно, я так благодарна миру, что нашла тебя вообще.', 800);
            await sheSends('ты такой хорошенький, такой добрый. вообще думаю таких людей больше нет в мире этом. спасибо, что ты есть у меня, я ценю каждую минуту проведенную с тобой и бесконечно благодарна, что ты общаешься со мной.', 600);
            await sheSends('это так чисто душевное, у меня прям прилив нежности. я даж когда гуляла думала как ты там, потерял меня наверное и ты так мило радуешься когда я захожу в сеть, ты правда лапочка.', 600);
            await sheSends('ты прям пиздатый, люблю тебя пиздец оч надеюсь на то что мы всю жизнь общаться будем. мхмхахаха ты от меня никуда не уйдешь, безумно скучаю без тебя, правда', 600);
            step1();
        }}
    ]);
}

// 2. Он: Спасибо большое❤️❤️❤️
async function step1() {
    const spsId = await heSends('Спасибо большое❤️❤️❤️', 1000);
    
    // 3. ЕЁ МЫСЛИ (реакция на его ответ)
    await sheThinks('Господи какой же он тупой, лучше бы я его заблокировала, надо вообще удалить сообщение это, но блин, я так люблю его...', 1000);
    
    // 4. ЕГО МЫСЛИ
    await heThinks('Она такая хорошая, я её сильно люблю, но мне кажется, у меня нет ни единого шанса...', 1200);
    
    // 5. Он: Ты там как?
    const kakId = await heSends('Ты там как?', 800);
    
    // 6. Она: норм
    showHerChoices([
        { label: 'норм', action: async () => {
            const normId = await sheSends('норм', 300, kakId);
            step2(normId);
        }}
    ]);
}

// 7. Он: Что делаеееешь?
async function step2(normId) {
    const chtoId = await heSends('Что делаеееешь?', 800, normId);
    
    // 8. Она: да ничего
    showHerChoices([
        { label: 'да ничего', action: async () => {
            const nichegoId = await sheSends('да ничего', 300, chtoId);
            step3(nichegoId);
        }}
    ]);
}

// 9. Он: У тебя настроение пропало?
async function step3(nichegoId) {
    const nastrId = await heSends('У тебя настроение пропало?', 800, nichegoId);
    
    // 10. ЕЁ МЫСЛИ
    await sheThinks('Ну конечно пропало, как так можно было ответить.. ты же мне нравишься идиот...', 1000);
    
    // 11. Она: нет
    showHerChoices([
        { label: 'нет', action: async () => {
            const netId = await sheSends('нет', 300, nastrId);
            step4(netId);
        }}
    ]);
}

// 12. Он: ну хорошоо, я пойду поиграю
async function step4(netId) {
    await heSends('ну хорошоо, я пойду поиграю', 800, netId);
    
    // 13. ЕЁ МЫСЛИ (финал)
    await sheThinks('Ну иди иди, пока я тебя не убила🤬🤬', 1000);
    
    // Конец
    setTimeout(() => {
        chatChoices.innerHTML = `
            <div style="text-align:center; color: rgba(255,255,255,0.4); padding: 20px; font-style: italic; width:100%;">
                ✨ Конец диалога ✨<br>
                <span style="font-size:12px;">18 мая 2025</span>
            </div>
        `;
        scrollToBottom();
    }, 1500);
}

// ===== ЗАПУСК =====
startChat();