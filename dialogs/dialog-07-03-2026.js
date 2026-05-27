// ═══════════════════════════════════════════
// ДИАЛОГ · 07.03.2026 — НАША ВТОРАЯ ВСТРЕЧА
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

function sheSends(text, delay = NORM, replyTo = null) {
    return new Promise(resolve => {
        setTimeout(() => { const { el, id } = createMsg(text, 'hers', replyTo); chatMessages.appendChild(el); scrollToBottom(); resolve(id); }, delay);
    });
}

function sheThinks(text, delay = THOUGHT) {
    return new Promise(resolve => {
        setTimeout(() => {
            const { el } = createMsg(text, 'thought', null, 'her-thought');
            chatMessages.appendChild(el); scrollToBottom(); resolve();
        }, delay);
    });
}

function heSends(text, delay = SLOW, replyTo = null) {
    return new Promise(resolve => {
        showTyping();
        setTimeout(() => { hideTyping(); const { el, id } = createMsg(text, 'his', replyTo); chatMessages.appendChild(el); scrollToBottom(); resolve(id); }, delay);
    });
}

function addDate(text) { const d = document.createElement('div'); d.className = 'message-date'; d.textContent = text; chatMessages.appendChild(d); scrollToBottom(); }
function addTimeSkip(text) { const s = document.createElement('div'); s.className = 'time-skip'; s.innerHTML = `<div class="time-skip-line"></div><div class="time-skip-text">${text}</div><div class="time-skip-line"></div>`; chatMessages.appendChild(s); scrollToBottom(); }

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
    addDate('7 марта 2026');
    step1();
}

// Она спрашивает про прилёт
function step1() {
    herChoices([{ label: 'Зай, ты прилетел?', next: (myId) => {
        heSends('ДААА КИСУЛЬ МЫ УЖЕ ПРИЗЕМЛИЛИСЬ', SLOW, myId).then(() => {
            heSends('МНЕ ТАК СТРАШНО БЫЛО', SLOW).then(hisId => step2(hisId));
        });
    }}]);
}

function step2(hisId) {
    herChoices([{ label: 'хвахваха, ну чего бояться', next: (myId) => {
        sheSends('Ты уже здесь, у меня', NORM, hisId).then(myId2 => {
            step3(myId2);
        });
    }}]);
}

function step3(myId2) {
    herChoices([{ label: 'Ты через сколько будешь', next: (myId) => {
        heSends('Нуу, мы вот щас выйдем', SLOW, myId).then(() => {
            heSends('Закажем такси', SLOW).then(() => {
                heSends('Ну и примерно к пол 4 или 4 приедем', SLOW).then(() => {
                    heSends('Хорошо кисуль?', SLOW).then(hisId => step4(hisId));
                });
            });
        });
    }}]);
}

function step4(hisId) {
    herChoices([{ label: 'Нет', next: (myId) => {
        sheSends('Быстрее', NORM, hisId).then(() => {
            sheThinks('Ну блииин, ну что он так долго, уже почти весь день прошел(', THOUGHT).then(() => step5());
        });
    }}]);
}

function step5() {
    heSends('Кис стараюсь быстрее', SLOW).then(hisId => {
        herChoices([{ label: 'Давай еще быстрее', next: (myId) => {
            // 20 минут
            addTimeSkip('✦ Спустя 20 минут ✦');
            setTimeout(() => {
                heSends('Кисуль, мы уже едем в такси', SLOW, myId).then(hisId2 => step6(hisId2));
            }, 1800);
        }}]);
    });
}

function step6(hisId2) {
    herChoices([{ label: 'Ну быстрее давай', next: (myId) => {
        heSends('Всее, щас ногами буду такси помогать', SLOW, myId).then(() => {
            heSends('Подталкивать буду', SLOW).then(() => {
                // 30 минут
                addTimeSkip('✦ Спустя 30 минут ✦');
                setTimeout(() => {
                    heSends('Кисуль мы приехали', SLOW).then(hisId => step7(hisId));
                }, 1800);
            });
        });
    }}]);
}

function step7(hisId) {
    herChoices([{ label: 'Быстро к алине иди', next: (myId) => {
        heSends('Все, щас вещи оставлю и бегу', SLOW, myId).then(hisId2 => step8(hisId2));
    }}]);
}

function step8(hisId2) {
    herChoices([{ label: 'Жду тебя', next: (myId) => {
        heSends('Я подошел вы где?', SLOW, myId).then(hisId3 => step9(hisId3));
    }}]);
}

function step9(hisId3) {
    herChoices([{ label: 'щас спустимсяяя, жди', next: (myId) => {
        heSends('Жду кисуль', SLOW, myId).then(() => {
            // Тем же вечером
            addTimeSkip('✦ Тем же вечером ✦');
            setTimeout(() => step10(), 2000);
        });
    }}]);
}

function step10() {
    heSends('кисуль', SLOW).then(() => {
        heSends('блин, так грустно что я так поздно приехал', SLOW).then(hisId => step11(hisId));
    });
}

function step11(hisId) {
    herChoices([{ label: 'Да зай, но что поделать', next: (myId) => {
        heSends('Да, но надеюсь завтра хорошо день проведем', SLOW, myId).then(hisId2 => step12(hisId2));
    }}]);
}

function step12(hisId2) {
    herChoices([{ label: 'Я тоже надеюсь кот', next: (myId) => {
        sheSends('Люблю тебя', NORM, hisId2).then(() => {
            // На следующий день
            addTimeSkip('✦ На следующий день ✦');
            setTimeout(() => step13(), 2000);
        });
    }}]);
}

function step13() {
    heSends('Кисууль ты где', SLOW).then(hisId => step14(hisId));
}

function step14(hisId) {
    herChoices([{ label: 'Я уже приехала, иди ко мне на встречу', next: (myId) => {
        heSends('Хорошоооо', SLOW, myId).then(() => {
            heSends('Я уже вижу тебя кисуль', SLOW).then(hisId2 => step15(hisId2));
        });
    }}]);
}

function step15(hisId2) {
    herChoices([{ label: 'Я тебя тоже вижу зай', next: (myId) => {
        // Тем же вечером
        addTimeSkip('✦ Тем же вечером ✦');
        setTimeout(() => step16(), 2000);
    }}]);
}

function step16() {
    heSends('КИСАА АФИГЕТЬ', SLOW).then(() => {
        heSends('СКОЛЬКО ВСЕГО МЫ СДЕЛАЛИ', SLOW).then(() => {
            heSends('Я ТЕБЯ ОЧЕНЬ ЛЮБЛЮ КИС', SLOW).then(hisId => step17(hisId));
        });
    });
}

function step17(hisId) {
    herChoices([{ label: 'А Я ТЕБЯ ЛЮБЛЮ ЗАЯЯЯ', next: (myId) => {
        heSends('Кисуль, мы завтра уезжаем, давай щас спатки уже, сладких снов любимая❤️❤️❤️', SLOW, myId).then(hisId2 => step18(hisId2));
    }}]);
}

function step18(hisId2) {
    herChoices([{ label: 'Сладких снов зай, люблю тебя❤️❤️❤️', next: (myId) => {
        // На следующий день
        addTimeSkip('✦ На следующий день ✦');
        setTimeout(() => {
            heSends('Кисуль, пока родная, мы уже сели в поезд, люблю тебя', SLOW, myId).then(hisId3 => step19(hisId3));
        }, 2000);
    }}]);
}

function step19(hisId3) {
    herChoices([{ label: 'А я тебя люблю зай, напиши как сможешь', next: (myId) => {
        heSends('Хорошо кисуль, люблю сильно', SLOW, myId).then(() => {
            chatChoices.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.4);padding:20px;font-style:italic;width:100%;">✨ Наша вторая встреча ✨<br><span style="font-size:12px;">7 марта 2026</span></div>';
        });
    }}]);
}

// ===== ЗАПУСК =====
startChat();