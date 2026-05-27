// ═══════════════════════════════════════════
// ДИАЛОГ · 31.12.2025 — ПЕРВЫЙ НОВЫЙ ГОД
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

// Она отправляет (синие, справа)
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

// Он отправляет (серые, слева)
function heSends(text, delay = SLOW, replyTo = null) {
    return new Promise(resolve => {
        showTyping();
        setTimeout(() => { hideTyping(); const { el, id } = createMsg(text, 'his', replyTo); chatMessages.appendChild(el); scrollToBottom(); resolve(id); }, delay);
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
    addDate('31 декабря 2025');
    step1();
}

// Он: Кисуль, уже считай сегодня будет новый год
function step1() {
    heSends('Кисуль, уже считай сегодня будет новый год', SLOW).then(hisId => {
        herChoices([{ label: 'Дааа, зай, я так рада, что я именно с тобой в этот новый год', next: (myId) => step2(myId, hisId) }]);
    });
}

// Она отвечает, он радуется
function step2(myId, hisId) {
    heSends('А я безумно сильно рад, что с тобой', SLOW, myId).then(() => {
        heSends('Честно, я даже не представлял, что все так будет кисуль', SLOW).then(hisId2 => {
            herChoices([{ label: 'А я знала что все будет именно так', next: (myId2) => step3(myId2, hisId2) }]);
        });
    });
}

// Она продолжает
function step3(myId2, hisId2) {
    sheSends('Я тебя люблю дурак', NORM, hisId2).then(() => {
        sheThinks('По другому и быть не могло, я изначально знала как все будет, ты из моих рук не уйдешь, ты только мой', THOUGHT).then(() => {
            heSends('А я тебя люблю кисуль, сильно сильно люблю', SLOW, myId2).then(hisId3 => {
                step4(hisId3);
            });
        });
    });
}

// Он про время
function step4(hisId3) {
    heSends('Точно, у тебя же новый год еще раньше на час настанет', SLOW).then(hisId4 => {
        herChoices([{ label: 'Дааа, так что буду раньше тебя начинать праздновать, а ты лооох', next: (myId3) => step5(myId3, hisId4) }]);
    });
}

// Шутливая перепалка
function step5(myId3, hisId4) {
    heSends('Ээээ', SLOW, myId3).then(() => {
        heSends('Ну так нечестно', SLOW).then(hisId5 => {
            herChoices([{ label: 'вахвхаавх', next: (myId4) => step6(myId4, hisId5) }]);
        });
    });
}

function step6(myId4, hisId5) {
    sheSends('А вот и все честно', NORM, hisId5).then(myId5 => {
        heSends('Ну неет', SLOW, myId5).then(() => {
            heSends('Ну давай я приеду', SLOW).then(() => {
                heSends('Вдвоем будем праздновать', SLOW).then(hisId6 => {
                    herChoices([{ label: 'Давай котенок', next: (myId6) => step7(myId6, hisId6) }]);
                });
            });
        });
    });
}

function step7(myId6, hisId6) {
    sheSends('Я тебя очень жду', NORM, hisId6).then(() => {
        // Полночь
        addTimeSkip('✦ Настало 23:00 ✦');
        setTimeout(() => {
            heSends('Кисуль, любимая, у тебя уже настал новый год, я тебя очень сильно люблю, я безумно сильно рад, что встречаю этот новый год с тобой, он уже наступил у тебя, но у меня еще нет', SLOW).then(() => {
                heSends('я хочу сказать кисуль, это наш первый год, но ни в коем случае не последний, последнего у нас не будет кис, мы будем вместе всегда, я тебя очень сильно люблю', SLOW).then(hisId7 => {
                    herChoices([{ label: 'А я тебя люблю зай, я очень рада, что ты со мной в этот год, что я встречаю его с тобой', next: (myId7) => step8(myId7, hisId7) }]);
                });
            });
        }, 2000);
    });
}

function step8(myId7, hisId7) {
    sheSends('Я так рада, что ты есть у меня котенок', NORM, hisId7).then(myId8 => {
        heSends('А я рад, что ты есть у меня кисуль', SLOW, myId8).then(() => {
            // Спустя несколько часов
            addTimeSkip('✦ Спустя несколько часов ✦');
            setTimeout(() => {
                herChoices([{ label: 'Зай, я устала сильно', next: (myId9) => step9(myId9) }]);
            }, 2000);
        });
    });
}

function step9(myId9) {
    sheSends('Пойдем ложится мой котенок любимый', NORM).then(myId10 => {
        heSends('Пойдем моя любимая', SLOW, myId10).then(() => {
            heSends('Я тебя очень люблю', SLOW).then(() => {
                heSends('сладких снов моя любимая, безумно сильно тебя люблю, ты самая лучшая в мире❤️❤️❤️', SLOW).then(hisId8 => {
                    herChoices([{ label: 'А я тебя люблю мой котенок сильно, спасибо, что в этот год, ты рядом со мной, сладких снов любимый❤️❤️❤️', next: (myId11) => {
                        sheSends('А я тебя люблю мой котенок сильно, спасибо, что в этот год, ты рядом со мной, сладких снов любимый❤️❤️❤️', NORM, hisId8).then(() => {
                            chatChoices.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.4);padding:20px;font-style:italic;width:100%;">✨ Первый новый год вместе ✨<br><span style="font-size:12px;">31 декабря 2025</span></div>';
                        });
                    }}]);
                });
            });
        });
    });
}

// ===== ЗАПУСК =====
startChat();