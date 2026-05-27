// ═══════════════════════════════════════════
// ДИАЛОГ · 16.11.2025 — ГРУСТНЫЙ ОТЪЕЗД
// ВСЁ ОТ ЛИЦА О (ДЕВУШКИ)
// ОНА выбирает, её сообщения синие справа
// ЕГО сообщения серые слева
// ═══════════════════════════════════════════

const chatMessages = document.getElementById('chat-messages');
const chatChoices = document.getElementById('chat-choices');
const typingIndicator = document.getElementById('typing-indicator');

let msgId = 0;
const msgTexts = {};

const FAST = 500;
const NORM = 800;
const SLOW = 1100;
const THOUGHT = 1400;

function scrollToBottom() { requestAnimationFrame(() => { chatMessages.scrollTop = chatMessages.scrollHeight; }); }
function showTyping() { typingIndicator.classList.remove('hidden'); scrollToBottom(); }
function hideTyping() { typingIndicator.classList.add('hidden'); }

function createMsg(text, type, replyTo = null, thoughtAuthor = null) {
    msgId++;
    const id = msgId;
    msgTexts[id] = text || '🖼️';
    const m = document.createElement('div');
    m.className = `message ${type}`;
    m.id = 'msg-' + id;
    
    if (type === 'thought' && thoughtAuthor) {
        const authorDiv = document.createElement('div');
        authorDiv.className = `thought-author ${thoughtAuthor}`;
        authorDiv.textContent = thoughtAuthor === 'her-thought' ? '💭 Ты думаешь...' : '💭 Сашка думает...';
        m.appendChild(authorDiv);
    }
    
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

// Она отправляет (синие, справа)
function sheSends(text, delay = NORM, replyTo = null) {
    return new Promise(resolve => {
        setTimeout(() => { const { el, id } = createMsg(text, 'hers', replyTo); chatMessages.appendChild(el); scrollToBottom(); resolve(id); }, delay);
    });
}

// Он отправляет (серые, слева)
function heSends(text, delay = SLOW, replyTo = null) {
    return new Promise(resolve => {
        showTyping();
        setTimeout(() => { hideTyping(); const { el, id } = createMsg(text, 'his', replyTo); chatMessages.appendChild(el); scrollToBottom(); resolve(id); }, delay);
    });
}

// Его мысли
function heThinks(text, delay = THOUGHT) {
    return new Promise(resolve => {
        setTimeout(() => {
            const m = document.createElement('div'); m.className = 'message thought';
            m.innerHTML = `<div class="thought-author his-thought">💭 Сашка думает...</div><span>${text}</span>`;
            chatMessages.appendChild(m); scrollToBottom(); resolve();
        }, delay);
    });
}

function addDate(text) { const d = document.createElement('div'); d.className = 'message-date'; d.textContent = text; chatMessages.appendChild(d); scrollToBottom(); }
function addTimeSkip(text) { const s = document.createElement('div'); s.className = 'time-skip'; s.innerHTML = `<div class="time-skip-line"></div><div class="time-skip-text">${text}</div><div class="time-skip-line"></div>`; chatMessages.appendChild(s); scrollToBottom(); }

// ЕЁ ВЫБОРЫ
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
    addDate('16 ноября 2025');
    step1();
}

// Он: Кисуль, мы так хорошо провели эти 2 дня...
function step1() {
    heSends('Кисуль, мы так хорошо провели эти 2 дня, я тебя очень сильно люблю', SLOW).then(hisId => {
        herChoices([{ label: 'А я тебя люблю зай', next: (myId) => step2(myId, hisId) }]);
    });
}

// Она отвечает на его сообщение
function step2(myId, hisId) {
    sheSends('Я так не хочу, чтоб ты уезжал зай', NORM, hisId).then(myId2 => {
        heSends('Я тоже очень не хочу уезжать кис', SLOW, myId2).then(hisId2 => {
            step3(hisId2);
        });
    });
}

// Он продолжает
function step3(hisId2) {
    heSends('Я блин не знаю когда мы теперь встретимся', SLOW).then(() => {
        heSends('Я уже так хочу приехать назад к тебе, хотя даже еще не уехал', SLOW, hisId2).then(hisId3 => {
            herChoices([{ label: 'Зай, я тебя сильно люблю', next: (myId) => step4(myId, hisId3) }]);
        });
    });
}

// Она отвечает
function step4(myId, hisId3) {
    sheSends('Я бы хотела, чтоб ты остался со мной навсегда кот', NORM, hisId3).then(myId2 => {
        heSends('Я хочу остаться любимая, я хочу просто быть с тобой', SLOW, myId2).then(hisId4 => {
            step5(hisId4);
        });
    });
}

function step5(hisId4) {
    heSends('Я хочу отдыхать с тобой моя девочка', SLOW).then(() => {
        heSends('Я тебя очень люблю', SLOW, hisId4).then(hisId5 => {
            herChoices([{ label: 'Надеюсь ты сможешь хотя бы до лета приехать', next: (myId) => step6(myId, hisId5) }]);
        });
    });
}

function step6(myId, hisId5) {
    heSends('Я очень постараюсь кисуль', SLOW, myId).then(hisId6 => {
        heSends('Ну у нас все только впереди моя дорогая', SLOW).then(() => {
            herChoices([{ label: 'Даа, вот представь, вдруг у нас скоро доча появится', next: (myId2) => step7(myId2, hisId6) }]);
        });
    });
}

function step7(myId2, hisId6) {
    heThinks('Вот вдруг правда у нас появится наша дочааа, наша кошечка, и назовем мы ее мусей', THOUGHT).then(() => {
        heSends('Даааа, будет так хорошо', SLOW, myId2).then(() => {
            heSends('Будем любить ее очень сильно', SLOW).then(() => {
                heSends('Так же сильно как любим друг друга', SLOW).then(hisId7 => {
                    herChoices([{ label: 'Да зай, люблю тебя', next: (myId3) => step8(myId3, hisId7) }]);
                });
            });
        });
    });
}

function step8(myId3, hisId7) {
    heSends('А я тебя люблю дорогая', SLOW, myId3).then(() => {
        heSends('Ну все кис, мы собираемся в дорогу, будем щас к поезду выезжать уже все дела', SLOW).then(hisId8 => {
            herChoices([{ label: 'Хорошо коть', next: (myId4) => step9(myId4, hisId8) }]);
        });
    });
}

function step9(myId4, hisId8) {
    addTimeSkip('✦ Спустя 40 минут ✦');
    setTimeout(() => {
        heSends('Кисуль, мы приехали, садимся в поезд', SLOW).then(() => {
            heSends('Я тебя очень люблю', SLOW).then(() => {
                heSends('Щас интернета уже не будет', SLOW).then(() => {
                    heSends('Пока моя любимая', SLOW).then(hisId9 => {
                        heSends('Напишу как смогу', SLOW).then(() => {
                            herChoices([{ label: 'Пока мой дорогой', next: (myId5) => step10(myId5, hisId9) }]);
                        });
                    });
                });
            });
        });
    }, 2000);
}

function step10(myId5, hisId9) {
    sheSends('Сильно по тебе скучаю', NORM, hisId9).then(myId6 => {
        heSends('А я по тебе сильно скучаю', SLOW, myId6).then(() => {
            heSends('Люблю тебя сильно', SLOW).then(() => {
                heSends('Надеюсь сможем скоро встретится', SLOW).then(hisId10 => {
                    herChoices([{ label: 'Я тоже надеюсь', next: (myId7) => step11(myId7, hisId10) }]);
                });
            });
        });
    });
}

function step11(myId7, hisId10) {
    heSends('Ладно пока кисуль, люблю тебя', SLOW, myId7).then(hisId11 => {
        herChoices([{ label: 'Пока зай, я тебя тоже безумно сильно люблю', next: (myId8) => {
            sheSends('Пока зай, я тебя тоже безумно сильно люблю', NORM, hisId11).then(() => {
                chatChoices.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.4);padding:20px;font-style:italic;width:100%;">✨ Грустный отъезд ✨<br><span style="font-size:12px;">16 ноября 2025</span></div>';
            });
        }}]);
    });
}

// ===== ЗАПУСК =====
startChat();