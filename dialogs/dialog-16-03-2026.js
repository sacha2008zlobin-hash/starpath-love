// ═══════════════════════════════════════════
// ДИАЛОГ · 16.03.2026 — ДЕНЬ РОЖДЕНИЯ
// ВСЁ ОТ ЛИЦА О (ДЕВУШКИ)
// ═══════════════════════════════════════════

const chatMessages = document.getElementById('chat-messages');
const chatChoices = document.getElementById('chat-choices');
const typingIndicator = document.getElementById('typing-indicator');

let msgId = 0;
const msgTexts = {};

const FAST = 500;
const NORM = 800;
const SLOW = 1100;

function scrollToBottom() { requestAnimationFrame(() => { chatMessages.scrollTop = chatMessages.scrollHeight; }); }
function showTyping() { typingIndicator.classList.remove('hidden'); scrollToBottom(); }
function hideTyping() { typingIndicator.classList.add('hidden'); }

function createMsg(text, type, replyTo = null) {
    msgId++;
    const id = msgId;
    msgTexts[id] = text || '';
    const m = document.createElement('div');
    m.className = `message ${type}`;
    m.id = 'msg-' + id;
    
    if (replyTo && msgTexts[replyTo]) {
        const quote = document.createElement('div');
        quote.className = 'reply-preview';
        const qt = msgTexts[replyTo];
        quote.textContent = qt.length > 35 ? qt.substring(0, 32) + '...' : qt;
        quote.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = document.getElementById('msg-' + replyTo);
            if (target) { target.classList.add('highlighted'); target.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => target.classList.remove('highlighted'), 2500); }
        });
        m.appendChild(quote);
    }
    
    const span = document.createElement('span'); span.textContent = text; m.appendChild(span);
    return { el: m, id };
}

function sheSends(text, delay = NORM, replyTo = null) {
    return new Promise(resolve => {
        setTimeout(() => { const { el, id } = createMsg(text, 'hers', replyTo); chatMessages.appendChild(el); scrollToBottom(); resolve(id); }, delay);
    });
}

function heSends(text, delay = SLOW, replyTo = null) {
    return new Promise(resolve => {
        showTyping();
        setTimeout(() => { hideTyping(); const { el, id } = createMsg(text, 'his', replyTo); chatMessages.appendChild(el); scrollToBottom(); resolve(id); }, delay);
    });
}

// Он отправляет стих
function heSendsPoem(text, delay = NORM) {
    return new Promise(resolve => {
        setTimeout(() => {
            const m = document.createElement('div');
            m.className = 'message poem';
            m.innerHTML = `<div class="poem-label">🎵 Стих</div><span>${text}</span>`;
            chatMessages.appendChild(m); scrollToBottom(); resolve();
        }, delay);
    });
}

function addDate(text) { const d = document.createElement('div'); d.className = 'message-date'; d.textContent = text; chatMessages.appendChild(d); scrollToBottom(); }

function herChoices(opts) {
    chatChoices.innerHTML = '';
    opts.forEach(o => { const b = document.createElement('button'); b.className = 'choice-btn'; b.textContent = o.label;
        b.onclick = () => { chatChoices.innerHTML = ''; sheSends(o.label, FAST).then(myId => o.next(myId)); };
        chatChoices.appendChild(b);
    }); scrollToBottom();
}

// ===== СТАРТ =====
function startChat() {
    chatMessages.innerHTML = ''; msgId = 0;
    for (const k in msgTexts) delete msgTexts[k];
    addDate('16 марта 2026');
    step1();
}

// Он отправляет стих
function step1() {
    heSendsPoem('Мой лучик солнца ясные\nСегодня день настал прекрасный\nДень рождения это твой\nПроведенный он со мной\n\nХоть не рядом я с тобой\nНо всей душой я близь тебя\nЛюблю тебя моя жена\nЛюбовь всей жизни ты моя\n\nТы прекрасна, дорога\nИ всегда ты мне нужна\nСведены судьбой с тобой\nВместе будем мы всегда\n\nИ пройдем пути все вместе\nЛюблю тебя, моя жена❤️', NORM).then(() => {
        herChoices([{ label: 'ОУ САШААА', next: (myId) => step2(myId) }]);
    });
}

function step2(myId) {
    sheSends('НУ САШААААА', FAST).then(() => {
        herChoices([{ label: 'НУ Я ПЛАЧУУУ', next: (myId2) => step3(myId2) }]);
    });
}

function step3(myId2) {
    heSends('ХВАХВАХ', SLOW, myId2).then(() => {
        heSends('КИШУЛЯЯЯ', SLOW).then(() => {
            heSends('НУ ТЫ ЧЕГО МОЯ ДЕВОЧКА', SLOW).then(hisId => step4(hisId));
        });
    });
}

function step4(hisId) {
    herChoices([{ label: 'НУ ТЫ ВАЩЕ КАПЕЦ', next: (myId) => {
        sheSends('СПАСИБО ТЕБЕ БОЛЬШОЕ', NORM, hisId).then(myId2 => step5(myId2));
    }}]);
}

function step5(myId2) {
    heSends('НУ МОЯ ДЕВОЧКААА', SLOW, myId2).then(() => {
        heSends('Я ТЕБЯ ЛЮБЛЮ СИЛЬНО', SLOW).then(() => {
            heSends('Заходи на этот сааайт', SLOW).then(hisId => step6(hisId));
        });
    });
}

function step6(hisId) {
    herChoices([{ label: 'не перехожу на скам ссылки', next: (myId) => {
        heSends('ну киис', SLOW, myId).then(hisId2 => step7(hisId2));
    }}]);
}

function step7(hisId2) {
    herChoices([{ label: 'ЕБАТЬ ТУТ ТЕСТ', next: (myId) => {
        heSends('ХАХАХАХАХ', SLOW, myId).then(() => step8());
    }}]);
}

function step8() {
    herChoices([{ label: 'АХУЕЕЕЕТЬ', next: (myId) => {
        sheSends('КАК ЭТО КРУТО ЗАААЙ', FAST).then(() => {
            sheSends('СПАСИБО ТЕБЕ ОГРОМНОЕ', FAST).then(() => step9());
        });
    }}]);
}

function step9() {
    herChoices([{ label: 'ТЫ САМ ЭТО ВСЕ ДЕЛАЛ?', next: (myId) => {
        heSends('ПОЖАВУСТАААА', SLOW, myId).then(() => {
            heSends('КИШУЛЕЧКА МООЯЯЯЯ', SLOW).then(() => {
                heSends('ДАААА', SLOW).then(() => {
                    heSends('Люблю тебя кисуль', SLOW).then(hisId => step10(hisId));
                });
            });
        });
    }}]);
}

function step10(hisId) {
    herChoices([{ label: 'очень красиво кот', next: (myId) => {
        sheSends('ты у меня умничка', NORM, hisId).then(myId2 => {
            heSends('Шпасиба большое кисуль', SLOW, myId2).then(() => {
                heSends('А ты у меня умничка', SLOW).then(() => {
                    heSends('самая моя любимая', SLOW).then(hisId2 => step11(hisId2));
                });
            });
        });
    }}]);
}

function step11(hisId2) {
    herChoices([{ label: 'А ты мой самый любимый', next: (myId) => {
        sheSends('А ты мой самый любимый', NORM, hisId2).then(() => {
            chatChoices.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.4);padding:20px;font-style:italic;width:100%;">✨ Твой первый день рождения вместе ✨<br><span style="font-size:12px;">16 марта 2026</span></div>';
        });
    }}]);
}

// ===== ЗАПУСК =====
startChat();