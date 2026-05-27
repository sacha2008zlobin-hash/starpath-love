// ═══════════════════════════════════════════
// ДИАЛОГ · 29.05.2025 — НАЧАЛО НАШЕЙ ЛЮБВИ
// ПОЛНАЯ ВЕРСИЯ С ПЕРЕМОТКОЙ ВРЕМЕНИ
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

// Перемотка времени
function addTimeSkip(text) {
    const skip = document.createElement('div');
    skip.className = 'time-skip';
    skip.innerHTML = `
        <div class="time-skip-line"></div>
        <div class="time-skip-text">${text}</div>
        <div class="time-skip-line"></div>
    `;
    chatMessages.appendChild(skip);
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
    
    addDate('29 мая 2025');
    
    // ═══ ЧАСТЬ 1: ПРИЗНАНИЕ ═══
    
    showHerChoices([
        { label: 'Сашаааа, что делаешь?', action: async () => {
            const chtoId = await sheSends('Сашаааа, что делаешь?', 500);
            part1_step1(chtoId);
        }}
    ]);
}

async function part1_step1(chtoId) {
    await heSends('Да ничегоо, лежу просто, а ты там чтооо?', 800, chtoId);
    
    showHerChoices([
        { label: 'Да я тоже ничегооо...', action: async () => {
            await sheSends('Да я тоже ничегооо, я тебя вообще так сильна люблю ты не представляешь', 600);
            part1_step2();
        }}
    ]);
}

async function part1_step2() {
    await heSends('Блин', 600);
    await heSends('Я тебе вообще давно сказать хотел', 700);
    const neznayuId = await heSends('Я не знаю что мне делать', 700);
    
    showHerChoices([
        { label: 'Что такое?', action: async () => {
            const chto2Id = await sheSends('Что такое?', 400, neznayuId);
            part1_step3(chto2Id);
        }}
    ]);
}

async function part1_step3(chto2Id) {
    const lublyuId = await heSends('Я тебя очень люблю', 1000, chto2Id);
    
    showHerChoices([
        { label: 'я тебя тоже люблю сильнооо', action: async () => {
            const tozheId = await sheSends('я тебя тоже люблю сильнооо', 500, lublyuId);
            part1_step4(tozheId);
        }}
    ]);
}

async function part1_step4(tozheId) {
    const vstrechaemsyaId = await heSends('Получаетсяя мы теперь встречаемся?', 800, tozheId);
    
    showHerChoices([
        { label: 'Нуу вроде как', action: async () => {
            const vrodeId = await sheSends('Нуу вроде как', 400, vstrechaemsyaId);
            part1_step5(vrodeId);
        }}
    ]);
}

async function part1_step5(vrodeId) {
    const tochnoId = await heSends('Точно? А то ты так написала будто не хочешь', 800, vrodeId);
    
    showHerChoices([
        { label: 'Ввхвхвх да я же шучу дурак, я тебя люблю очень сильно', action: async () => {
            const shutkaId = await sheSends('Ввхвхвх да я же шучу дурак, я тебя люблю очень сильно', 600, tochnoId);
            part1_step6(shutkaId);
        }}
    ]);
}

async function part1_step6(shutkaId) {
    const pizdecId = await heSends('Я тебя пиздец как люблю', 700, shutkaId);
    await heSends('Я так рад, что наконец то признался, я тебя так люблюююю', 700);
    
    showHerChoices([
        { label: 'Дурак, я тебя очень сильно люблю', action: async () => {
            const durakId = await sheSends('Дурак, я тебя очень сильно люблю', 500, pizdecId);
            part1_step7(durakId);
        }}
    ]);
}

async function part1_step7(durakId) {
    const beibiId = await heSends('Ну все ты моя бейби как бы теперь, моя малышечка', 800, durakId);
    
    await heThinks('Ну ахуеееть, она реально согласилась, она теперь правда моя девушка, я не могу ее потерять, я хочу прожить с ней всю жизнь, я ее очень сильно люблю', 1200);
    
    await sheThinks('Наконец то он мне признался, как же я этого ждалааа, ну какой он тормоз, ну наконец то он додумался, люблю его', 1200);
    
    showHerChoices([
        { label: 'Может пойдем в репо поиграем?', action: async () => {
            const repoId = await sheSends('Может пойдем в репо поиграем?', 500);
            part1_step8(repoId);
        }}
    ]);
}

async function part1_step8(repoId) {
    await heSends('Пойдем любимая', 700, repoId);
    const lublyu2Id = await heSends('Люблю тебя', 600);
    
    showHerChoices([
        { label: 'Я тебя тоже люблю', action: async () => {
            await sheSends('Я тебя тоже люблю', 500, lublyu2Id);
            
            // ПЕРЕМОТКА ВРЕМЕНИ
            setTimeout(() => part2_start(), 1500);
        }}
    ]);
}

// ═══ ЧАСТЬ 2: ВЕЧЕР ═══
async function part2_start() {
    addTimeSkip('✦ Несколько часов спустя... ✦');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    addDate('29 мая 2025 · вечер');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Она: Мы так хорошо поиграли зай
    showHerChoices([
        { label: 'Мы так хорошо поиграли зай', action: async () => {
            const zaikaId = await sheSends('Мы так хорошо поиграли зай', 500);
            part2_step1(zaikaId);
        }}
    ]);
}

async function part2_step1(zaikaId) {
    await heSends('Даааа, я тебя так сильно люблю', 700, zaikaId);
    
    showHerChoices([
        { label: 'Я тебя тоже люблю мой сладкий', action: async () => {
            const sladkiyId = await sheSends('Я тебя тоже люблю мой сладкий', 500);
            part2_step2(sladkiyId);
        }}
    ]);
}

async function part2_step2(sladkiyId) {
    const tormozId = await heSends('Я так рад, что наконец то признался, я вообще такой тормоз, прости меняяяя', 800, sladkiyId);
    
    await sheThinks('Ну ты еще тот тормоз, еще бы чуть чуть, и я бы вообще тебя нафиг послала', 1000);
    
    showHerChoices([
        { label: 'А я рада, что ты наконец то признался мне, я так ждала этого', action: async () => {
            const radaId = await sheSends('А я рада, что ты наконец то признался мне, я так ждала этого', 600, tormozId);
            part2_step3(radaId);
        }}
    ]);
}

async function part2_step3(radaId) {
    await heSends('вхвххвхв', 500, radaId);
    
    showHerChoices([
        { label: 'Не смешно дурак, вот тянул бы дальше, я бы не согласилась', action: async () => {
            const nesmeshnoId = await sheSends('Не смешно дурак, вот тянул бы дальше, я бы не согласилась', 600);
            part2_step4(nesmeshnoId);
        }}
    ]);
}

async function part2_step4(nesmeshnoId) {
    await heSends('Эээээ', 400, nesmeshnoId);
    await heSends('Так нечестно', 400);
    
    showHerChoices([
        { label: 'Все честно, нечего тормозить', action: async () => {
            const chestnoId = await sheSends('Все честно, нечего тормозить', 500);
            part2_step5(chestnoId);
        }}
    ]);
}

async function part2_step5(chestnoId) {
    await heThinks('Фуухх, слава богу я успел признаться, я не знаю, что было бы, если бы я потерял ее, я ее очень сильно люблю', 1000);
    
    const prostiId = await heSends('Ну прости пожалуйста, ну я очень переживал, мне было очень страшно', 800, chestnoId);
    
    showHerChoices([
        { label: 'Да не извиняйся, ну я же люблю тебяяя, ну не тормози ты так', action: async () => {
            const neizvinyaysyaId = await sheSends('Да не извиняйся, ну я же люблю тебяяя, ну не тормози ты так', 600, prostiId);
            part2_step6(neizvinyaysyaId);
        }}
    ]);
}

async function part2_step6(neizvinyaysyaId) {
    await sheSends('Я сколько ждала это ужас', 500);
    await sheSends('Я тебе постоянно такие намеки делала', 500);
    await sheSends('А тебе хоть бы что', 500);
    const otshivalId = await sheSends('Ты меня только и отшивал', 500);
    
    part2_step7(otshivalId);
}

function part2_step7(otshivalId) {
    showHerChoices([
        { label: 'Ну нееет (ответ Сашки)', action: async () => {
            // Он оправдывается
            await heSends('Ну нееет', 500, otshivalId);
            await heSends('Мне просто правда было страшно и я переживал', 700);
            const dumalId = await heSends('Я думал ну, то что ты нууу, ну то что это все не правда', 700);
            
            // Её мысли
            await sheThinks('Ага, конечно неправда, дурак блин', 1000);
            
            part2_step8(dumalId);
        }}
    ]);
}

function part2_step8(dumalId) {
    showHerChoices([
        { label: 'Дурак, я тебя люблю', action: async () => {
            const durak2Id = await sheSends('Дурак, я тебя люблю', 500, dumalId);
            part2_step9(durak2Id);
        }}
    ]);
}

async function part2_step9(durak2Id) {
    await heSends('А я тебя люблю очень сильнооо', 700, durak2Id);
    
    showHerChoices([
        { label: 'А ты вообще то говорил, что мы кенты просто', action: async () => {
            const kentiId = await sheSends('А ты вообще то говорил, что мы кенты просто', 600);
            part2_step10(kentiId);
        }}
    ]);
}

async function part2_step10(kentiId) {
    await heSends('Ну нет, ну я не специально', 500, kentiId);
    
    showHerChoices([
        { label: 'А я что ли специально', action: async () => {
            const spetsialnoId = await sheSends('А я что ли специально', 400);
            part2_step11(spetsialnoId);
        }}
    ]);
}

async function part2_step11(spetsialnoId) {
    await heThinks('Ну что же я говорииил, какой я тупооой', 1000);
    
    const netId = await heSends('Ну нееет, ну прости дурака меня, я тебя люблююю', 700, spetsialnoId);
    
    showHerChoices([
        { label: 'И я тебя', action: async () => {
            const iyaId = await sheSends('И я тебя', 400, netId);
            part2_step12(iyaId);
        }}
    ]);
}

async function part2_step12(iyaId) {
    await heThinks('А где люблююю, можна полностью и я тебя люблюююю', 800);
    
    showHerChoices([
        { label: 'Пойдем спатки зай, очень устала', action: async () => {
            const spatkiId = await sheSends('Пойдем спатки зай, очень устала', 500);
            part2_step13(spatkiId);
        }}
    ]);
}

async function part2_step13(spatkiId) {
    await heSends('Пойдем любимая', 700, spatkiId);
    
    showHerChoices([
        { label: 'Сладких снов котенок, я тебя очень сильно люблю...', action: async () => {
            const snovId = await sheSends('Сладких снов котенок, я тебя очень сильно люблю, я рада, что ты появился у меня❤️❤️❤️', 600);
            part2_final(snovId);
        }}
    ]);
}

async function part2_final(snovId) {
    await heSends('Сладких снов кисуль, безумно люблю тебя, ты самая лучшая девочка на свете, спасибо за то что появилась у меня❤️❤️❤️', 800, snovId);
    
    await sheThinks('Наконец то он мой, я его люблю, у нас все будет хорошо, я знаю, что мы будем встречаться всегда, и поженимся, люблю его', 1200);
    
    await heThinks('КАК ЖЕ Я ЕЕ ЛЮБЛЮЮЮ ОНА НАКОНЕЦ ТО МОЯ, Я ТАК ЕЕ ЛЮБЛЮ, КАК МНЕ УСНУТЬ ВООБЩЕ АХУЕТЬ, Я ЖЕ ЕЕ ТАК ЛЮБЛЮ УРАААААААА', 1200);
    
    setTimeout(() => {
        chatChoices.innerHTML = `
            <div style="text-align:center; color: rgba(255,255,255,0.4); padding: 20px; font-style: italic; width:100%;">
                ✨ Начало нашей любви ✨<br>
                <span style="font-size:12px;">29 мая 2025</span>
            </div>
        `;
        scrollToBottom();
    }, 2000);
}

// ===== ЗАПУСК =====
startChat();