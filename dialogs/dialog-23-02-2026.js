// ═══════════════════════════════════════════
// ДИАЛОГ · 23.02.2026 — СТИХ ПОСВЯЩЕННЫЙ МНЕ
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
const THOUGHT = 1400;

function scrollToBottom() { requestAnimationFrame(() => { chatMessages.scrollTop = chatMessages.scrollHeight; }); }
function showTyping() { typingIndicator.classList.remove('hidden'); scrollToBottom(); }
function hideTyping() { typingIndicator.classList.add('hidden'); }

function createMsg(text, type, replyTo = null, thoughtAuthor = null) {
    msgId++;
    const id = msgId;
    msgTexts[id] = text || '';
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

// Она отправляет
function sheSends(text, delay = NORM, replyTo = null) {
    return new Promise(resolve => {
        setTimeout(() => { const { el, id } = createMsg(text, 'hers', replyTo); chatMessages.appendChild(el); scrollToBottom(); resolve(id); }, delay);
    });
}

// Она отправляет мысль
function sheThinks(text, delay = THOUGHT) {
    return new Promise(resolve => {
        setTimeout(() => {
            const { el } = createMsg(text, 'thought', null, 'her-thought');
            chatMessages.appendChild(el); scrollToBottom(); resolve();
        }, delay);
    });
}

// Она отправляет стих (специальный блок)
function sheSendsPoem(text, delay = NORM) {
    return new Promise(resolve => {
        setTimeout(() => {
            const m = document.createElement('div');
            m.className = 'message poem';
            m.innerHTML = `<div class="poem-label">🎵 Стих</div><span>${text}</span>`;
            chatMessages.appendChild(m); scrollToBottom(); resolve();
        }, delay);
    });
}

// Он отправляет
function heSends(text, delay = SLOW, replyTo = null) {
    return new Promise(resolve => {
        showTyping();
        setTimeout(() => { hideTyping(); const { el, id } = createMsg(text, 'his', replyTo); chatMessages.appendChild(el); scrollToBottom(); resolve(id); }, delay);
    });
}

// Он отправляет мысль
function heThinks(text, delay = THOUGHT) {
    return new Promise(resolve => {
        setTimeout(() => {
            const { el } = createMsg(text, 'thought', null, 'his-thought');
            chatMessages.appendChild(el); scrollToBottom(); resolve();
        }, delay);
    });
}

// Вставка автора
function authorNote(text, delay = NORM) {
    return new Promise(resolve => {
        setTimeout(() => {
            const m = document.createElement('div');
            m.className = 'message author-note';
            m.innerHTML = `<div class="author-note-label">✍️ Автор</div><span>${text}</span>`;
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
    addDate('23 февраля 2026');
    step1();
}

// Она поздравляет
function step1() {
    herChoices([{ label: 'Любимыыый, поздравляю тебяяяя', next: (myId) => {
        heSends('Шпасиба большое кисуляяя', SLOW, myId).then(() => {
            heSends('Я тебя очень сильно люблю', SLOW).then(hisId => {
                step2(hisId);
            });
        });
    }}]);
}

function step2(hisId) {
    herChoices([{ label: 'А я то тебя как люблю мой мужчина', next: (myId) => {
        sheSends('Мой защитник', NORM, hisId).then(() => {
            sheThinks('Ну мои защитничек, отымей меня жоска умоляю', THOUGHT).then(() => {
                step3();
            });
        });
    }}]);
}

function step3() {
    herChoices([{ label: 'Заааай, я по тебе соскучилась', next: (myId) => {
        heSends('А я по тебе соскучился моя дорогая', SLOW, myId).then(hisId => {
            step4(hisId);
        });
    }}]);
}

function step4(hisId) {
    herChoices([{ label: 'А у меня для тебя подарочек еееесть', next: (myId) => {
        heSends('ООООО', SLOW, myId).then(() => {
            heSends('КАКОЙ?', SLOW).then(hisId2 => {
                step5(hisId2);
            });
        });
    }}]);
}

function step5(hisId2) {
    herChoices([{ label: 'ваххвахва', next: (myId) => {
        sheSends('А вот смотрииии', NORM, hisId2).then(myId2 => {
            heSends('ТАААК', SLOW, myId2).then(() => {
                heThinks('Что же там щас будеееет, мне так интереснооо, что же будееет', THOUGHT).then(() => {
                    step6();
                });
            });
        });
    }}]);
}

// Стих!
function step6() {
    sheSendsPoem('Любиый мой, защитник мой,\nлюблю тебя я сильно,\nмой саша, будь всегда со мной,\nлюблю тебя ты мой родной', NORM).then(() => {
        authorNote('К сожалению у меня не сохранился стих, поэтому блин что то по памяти понаписал', NORM).then(() => {
            step7();
        });
    });
}

function step7() {
    heSends('ОГООООО КИСАААА', SLOW).then(() => {
        heSends('Я ТЕБЯ ЛЮБЛЮ СИЛЬНООО', SLOW).then(() => {
            heSends('СПАСИБО ОГРОМНОЕ МОЯ ЛЮБИМАЯ', SLOW).then(() => {
                heThinks('АХУЕТЬ МОЯ ЛЮБИМАЯ ВОТ ЭТО ОНА ДЛЯ МЕНЯ ПОСТАРАЛАСЬ Я ТАК РАД', THOUGHT).then(() => {
                    herChoices([{ label: 'ХВАХВАХ', next: (myId) => step8(myId) }]);
                });
            });
        });
    });
}

function step8(myId) {
    sheSends('Я ТЕБЯ ЛЮБЛЮ ЗАЙ СИЛЬНО', NORM).then(myId2 => {
        heSends('А Я ТЕБЯ ЛЮБЛЮ КИСУЛЬ СИЛЬНО', SLOW, myId2).then(() => {
            sheThinks('надеюсь ему очень понравилось, я так старалась', THOUGHT).then(() => {
                step9();
            });
        });
    });
}

function step9() {
    heSends('Кисуль спасибо огромноееее, я так рад', SLOW).then(hisId => {
        herChoices([{ label: 'А я тоже рада вообще то, что у меня такой защитник есть', next: (myId) => {
            heSends('Я тебя люблю кисуль', SLOW, myId).then(hisId2 => {
                herChoices([{ label: 'А я тебя люблю зай', next: (myId2) => {
                    sheSends('А я тебя люблю зай', NORM, hisId2).then(() => {
                        chatChoices.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.4);padding:20px;font-style:italic;width:100%;">✨ Стих посвященный мне ✨<br><span style="font-size:12px;">23 февраля 2026</span></div>';
                    });
                }}]);
            });
        }}]);
    });
}

// ===== ЗАПУСК =====
startChat();