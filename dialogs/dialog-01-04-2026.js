// ═══════════════════════════════════════════
// ДИАЛОГ · 01.04.2026 — ПЕРВОЕ АПРЕЛЯ
// БЛИЦ-ОПРОС + ПЕРЕПИСКА
// ═══════════════════════════════════════════

const loadingScreen = document.getElementById('loading-screen');
const quizScreen = document.getElementById('quiz-screen');
const chatScreen = document.getElementById('chat-screen');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizProgress = document.getElementById('quiz-progress');
const chatMessages = document.getElementById('chat-messages');
const chatChoicesEl = document.getElementById('chat-choices');
const typingIndicator = document.getElementById('typing-indicator');

let msgId = 0;
const msgTexts = {};

const FAST = 500;
const NORM = 800;
const SLOW = 1100;
const THOUGHT = 1400;

// ═══ БЛИЦ-ОПРОС ═══
const quizData = [
    {
        question: 'Как зовут нашу дочу?',
        options: ['Муся', 'Маня', 'Маша', 'Мила'],
        correct: [0]
    },
    {
        question: 'Как зовут твоего любимого мужа?',
        options: ['Саня', 'Александр', 'Саша', 'Шурик'],
        correct: [0, 1, 2, 3]
    },
    {
        question: 'С кем ты проживешь всю жизнь?',
        options: ['С котом', 'С Сашей', 'Одна', 'С Сашей и дочей'],
        correct: [1, 3]
    },
    {
        question: 'На что я тебе скидывал деньги, когда ехал встречать Илью с армии?',
        options: ['На пиццу', 'На подик', 'На такси', 'На цветы'],
        correct: [1]
    },
    {
        question: 'Что я пытался приготовить с тобой по вебке?',
        options: ['Борщ', 'Булдак', 'Пельмени', 'Омлет'],
        correct: [1]
    }
];

let currentQuiz = 0;

function showQuiz() {
    if (currentQuiz >= quizData.length) {
        quizScreen.classList.add('hidden');
        chatScreen.classList.remove('hidden');
        startChat();
        return;
    }
    
    const q = quizData[currentQuiz];
    quizQuestion.textContent = q.question;
    quizOptions.innerHTML = '';
    quizProgress.textContent = `${currentQuiz + 1} / ${quizData.length}`;
    
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
            if (q.correct.includes(i)) {
                btn.classList.add('correct');
                setTimeout(() => {
                    currentQuiz++;
                    showQuiz();
                }, 600);
            } else {
                btn.classList.add('wrong');
                setTimeout(() => {
                    btn.classList.remove('wrong');
                }, 500);
            }
        });
        quizOptions.appendChild(btn);
    });
}

// ═══ ЧАТ ═══
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
    chatChoicesEl.innerHTML = '';
    opts.forEach(o => { const b = document.createElement('button'); b.className = 'choice-btn'; b.textContent = o.label;
        b.onclick = () => { chatChoicesEl.innerHTML = ''; sheSends(o.label, FAST).then(myId => o.next(myId)); };
        chatChoicesEl.appendChild(b);
    }); scrollToBottom();
}

// ===== СТАРТ =====
setTimeout(() => {
    loadingScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    showQuiz();
}, 3000);

// ===== ЧАТ =====
function startChat() {
    chatMessages.innerHTML = ''; msgId = 0;
    for (const k in msgTexts) delete msgTexts[k];
    addDate('1 апреля 2026');
    step1();
}

function step1() {
    herChoices([{ label: 'Доброе утро зай, люблю тебя❤️', next: (myId) => {
        heSends('Доброе утро кисуль, а я тебя сильна люблю❤️', SLOW, myId).then(() => {
            heSends('Кис, представляешь, я стал суперменом и теперь летаю по миру', SLOW).then(hisId => step2(hisId));
        });
    }}]);
}

function step2(hisId) {
    herChoices([{ label: 'ОГО ЭТО ПРАВДА?', next: (myId) => {
        heSends('ДААА, Я СУПЕРГЕРОЙ', SLOW, myId).then(hisId2 => step3(hisId2));
    }}]);
}

function step3(hisId2) {
    sheThinks('отжарь меня мой супергерой', THOUGHT).then(() => {
        herChoices([{ label: 'ПРИЛЕТИ КО МНЕ ЖИВА', next: (myId) => {
            heSends('ЛЕЧУУУ', SLOW, myId).then(() => {
                addTimeSkip('✦ Прошло 10 минут ✦');
                setTimeout(() => step4(), 1800);
            });
        }}]);
    });
}

function step4() {
    herChoices([{ label: 'зай ты там где летишь, не вижу тебя что то', next: (myId) => {
        heSends('Ойй...', SLOW, myId).then(hisId => step5(hisId));
    }}]);
}

function step5(hisId) {
    herChoices([{ label: 'Ау', next: (myId) => {
        heSends('Кисуль', SLOW, myId).then(() => {
            heSends('С 1 апреля, я не супермен...', SLOW).then(() => {
                heSends('Я...', SLOW).then(() => {
                    heSends('Я....', SLOW).then(() => {
                        heSends('Я человек паук', SLOW).then(hisId2 => step6(hisId2));
                    });
                });
            });
        });
    }}]);
}

function step6(hisId2) {
    herChoices([{ label: 'УРАААА ТАК ДАЖЕ ЛУЧШЕЕЕ', next: (myId) => {
        sheThinks('ЗАЛЕЙ МЕНЯ СВОЕЙ ПАУТИНКОЙ', THOUGHT).then(() => {
            sheSends('Я ТЕБЯ ЛЮБЛЮ ЗАЯЯ', NORM, hisId2).then(myId2 => {
                heSends('А Я ТЕБЯ ЛЮБЛЮ КИСААА', SLOW, myId2).then(() => {
                    chatChoicesEl.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.4);padding:20px;font-style:italic;width:100%;">✨ Первое апреля ✨<br><span style="font-size:12px;">1 апреля 2026</span></div>';
                });
            });
        });
    }}]);
}