// ═══════════════════════════════════════════
// ДИАЛОГ · 15.11.2025 — ПЕРВАЯ ВСТРЕЧА
// БЕЗ ДУБЛЕЙ СООБЩЕНИЙ
// ═══════════════════════════════════════════

const chatMessages = document.getElementById('chat-messages');
const chatChoices = document.getElementById('chat-choices');
const typingIndicator = document.getElementById('typing-indicator');
const headerName = document.getElementById('header-name');
const headerAvatarImg = document.getElementById('header-avatar-img');
const headerAvatarFallback = document.querySelector('.avatar-fallback');
const headerStatus = document.getElementById('header-status');
const tabLoved = document.getElementById('tab-loved');
const tabAlina = document.getElementById('tab-alina');
const tabAzamat = document.getElementById('tab-azamat');

let currentChat = 'loved';
let chatUnlocked = { loved: true, alina: false, azamat: false };
let chatStarted = { loved: false, alina: false, azamat: false };

const chatStorage = { loved: [], alina: [], azamat: [] };
const chatQueues = { loved: [], alina: [], azamat: [] };
const msgIds = { loved: 0, alina: 0, azamat: 0 };
const msgTexts = { loved: {}, alina: {}, azamat: {} };

const FAST = 600;
const NORM = 900;
const SLOW = 1200;
const THOUGHT = 1500;

function scrollToBottom() { requestAnimationFrame(() => { chatMessages.scrollTop = chatMessages.scrollHeight; }); }
function showTyping() { typingIndicator.classList.remove('hidden'); scrollToBottom(); }
function hideTyping() { typingIndicator.classList.add('hidden'); }
function saveCurrentChat() { chatStorage[currentChat] = Array.from(chatMessages.children); }
function loadChat(chat) { chatMessages.innerHTML = ''; chatStorage[chat].forEach(el => chatMessages.appendChild(el)); scrollToBottom(); }

function addToChat(chat, element) {
    if (currentChat === chat) { chatMessages.appendChild(element); scrollToBottom(); }
    chatStorage[chat].push(element);
}

function addDate(text) { const d = document.createElement('div'); d.className = 'message-date'; d.textContent = text; addToChat(currentChat, d); }
function addTimeSkip(text) { const s = document.createElement('div'); s.className = 'time-skip'; s.innerHTML = `<div class="time-skip-line"></div><div class="time-skip-text">${text}</div><div class="time-skip-line"></div>`; addToChat(currentChat, s); }

function enqueue(chat, fn) { chatQueues[chat].push(fn); processQueue(chat); }
function processQueue(chat) {
    if (chatQueues[chat].length === 0) return;
    const fn = chatQueues[chat].shift();
    fn().then(() => { if (chatQueues[chat].length > 0) processQueue(chat); });
}
function resumeQueue(chat) { if (chatQueues[chat].length > 0) processQueue(chat); }

function createMsg(text, type, chat, replyTo = null) {
    msgIds[chat]++;
    const id = msgIds[chat];
    msgTexts[chat][id] = text || '🖼️';
    const m = document.createElement('div');
    m.className = `message ${type}`;
    m.id = 'msg-' + chat + '-' + id;
    if (replyTo && msgTexts[chat][replyTo]) {
        const quote = document.createElement('div');
        quote.className = 'reply-preview';
        const qt = msgTexts[chat][replyTo];
        quote.textContent = qt.length > 35 ? qt.substring(0, 32) + '...' : qt;
        quote.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = document.getElementById('msg-' + chat + '-' + replyTo);
            if (target) { target.classList.add('highlighted'); target.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => target.classList.remove('highlighted'), 2500); }
        });
        m.appendChild(quote);
    }
    const span = document.createElement('span'); span.textContent = text; m.appendChild(span);
    return { el: m, id };
}

function me(text, delay = NORM, replyTo = null) {
    return new Promise(resolve => {
        setTimeout(() => { const { el, id } = createMsg(text, 'hers', currentChat, replyTo); addToChat(currentChat, el); resolve(id); }, delay);
    });
}
function mePhoto(src, delay = NORM) {
    return new Promise(resolve => {
        setTimeout(() => {
            const m = document.createElement('div'); m.className = 'message hers'; m.style.cssText = 'padding:4px;background:transparent;';
            const img = document.createElement('img'); img.src = src; img.style.cssText = 'width:200px;border-radius:14px;display:block;';
            img.onerror = () => { img.alt = '📷'; m.style.padding = '10px 14px'; m.style.background = '#766ac8'; m.textContent = '📷 Фото'; };
            m.appendChild(img); addToChat(currentChat, m); resolve();
        }, delay);
    });
}
function meVideo(src, delay = NORM) {
    return new Promise(resolve => {
        setTimeout(() => {
            const m = document.createElement('div'); m.className = 'message hers'; m.style.cssText = 'padding:4px;background:transparent;';
            const v = document.createElement('video'); v.src = src; v.controls = true; v.playsInline = true; v.style.cssText = 'width:200px;border-radius:14px;display:block;';
            v.onerror = () => { m.textContent = '🎥 Видео'; m.style.padding = '10px 14px'; m.style.background = '#766ac8'; };
            m.appendChild(v); addToChat(currentChat, m); resolve();
        }, delay);
    });
}
function myThought(text, delay = THOUGHT) {
    return new Promise(resolve => {
        setTimeout(() => {
            const m = document.createElement('div'); m.className = 'message thought';
            m.innerHTML = `<div class="thought-author his-thought">💭 Ты думаешь...</div><span>${text}</span>`; addToChat(currentChat, m); resolve();
        }, delay);
    });
}
function her(text, delay = SLOW, replyTo = null) {
    return new Promise(resolve => {
        if (currentChat === 'loved') showTyping();
        setTimeout(() => { if (currentChat === 'loved') hideTyping(); const { el, id } = createMsg(text, 'his', 'loved', replyTo); addToChat('loved', el); resolve(id); }, delay);
    });
}
function herThought(text, delay = THOUGHT) {
    return new Promise(resolve => {
        setTimeout(() => {
            const m = document.createElement('div'); m.className = 'message thought';
            m.innerHTML = `<div class="thought-author her-thought">💭 Она думает...</div><span>${text}</span>`; addToChat('loved', m); resolve();
        }, delay);
    });
}
function other(text, delay = SLOW, replyTo = null) {
    return new Promise(resolve => {
        if (currentChat === 'alina' || currentChat === 'azamat') showTyping();
        setTimeout(() => { if (currentChat === 'alina' || currentChat === 'azamat') hideTyping(); const { el, id } = createMsg(text, 'his', currentChat, replyTo); addToChat(currentChat, el); resolve(id); }, delay);
    });
}

// ИСПРАВЛЕННАЯ: myChoices принимает myId в next
function myChoices(opts) {
    const chat = currentChat; chatChoices.innerHTML = '';
    opts.forEach(o => { const b = document.createElement('button'); b.className = 'choice-btn'; b.textContent = o.label;
        b.onclick = () => { 
            chatChoices.innerHTML = ''; 
            enqueue(chat, () => me(o.label, FAST).then(myId => { o.next(myId); }));
        };
        chatChoices.appendChild(b);
    }); scrollToBottom();
}

function lockTab(chat) { chatUnlocked[chat] = false; const tab = chat === 'loved' ? tabLoved : chat === 'alina' ? tabAlina : tabAzamat; tab.classList.add('locked'); if (!tab.querySelector('.tab-lock')) { const l = document.createElement('div'); l.className = 'tab-lock'; l.textContent = '🔒'; tab.appendChild(l); } }
function unlockTab(chat) { chatUnlocked[chat] = true; const tab = chat === 'alina' ? tabAlina : tabAzamat; tab.classList.remove('locked'); const l = tab.querySelector('.tab-lock'); if (l) l.remove(); }

function switchChat(chat) {
    if (!chatUnlocked[chat]) return; if (chat === currentChat) return;
    saveCurrentChat(); currentChat = chat;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if (chat === 'loved') { headerName.textContent = 'Любимая❤️❤️❤️'; headerAvatarImg.src = '../photo/lybov.jpg'; headerAvatarImg.style.display = 'block'; if (headerAvatarFallback) headerAvatarFallback.style.display = 'none'; headerStatus.textContent = 'была недавно'; tabLoved.classList.add('active'); loadChat('loved'); resumeQueue('loved'); }
    else if (chat === 'alina') { headerName.textContent = 'Алина'; headerAvatarImg.src = '../photo/alina.jpg'; headerAvatarImg.style.display = 'block'; if (headerAvatarFallback) headerAvatarFallback.style.display = 'none'; headerStatus.textContent = 'онлайн'; tabAlina.classList.add('active'); loadChat('alina'); if (!chatStarted.alina) { chatStarted.alina = true; startAlinaChat(); } else resumeQueue('alina'); }
    else if (chat === 'azamat') { headerName.textContent = 'Азамат'; headerAvatarImg.style.display = 'none'; if (headerAvatarFallback) { headerAvatarFallback.style.display = 'flex'; headerAvatarFallback.textContent = 'А'; headerAvatarFallback.style.background = '#c0392b'; } headerStatus.textContent = 'был недавно'; tabAzamat.classList.add('active'); loadChat('azamat'); if (!chatStarted.azamat) { chatStarted.azamat = true; startAzamatChat(); } else resumeQueue('azamat'); }
}
tabLoved.onclick = () => switchChat('loved');
tabAlina.onclick = () => switchChat('alina');
tabAzamat.onclick = () => switchChat('azamat');

function startChat() {
    chatMessages.innerHTML = ''; currentChat = 'loved';
    chatStarted = { loved: false, alina: false, azamat: false };
    chatUnlocked = { loved: true, alina: false, azamat: false };
    chatStorage.loved = []; chatStorage.alina = []; chatStorage.azamat = [];
    chatQueues.loved = []; chatQueues.alina = []; chatQueues.azamat = [];
    msgIds.loved = 0; msgIds.alina = 0; msgIds.azamat = 0;
    msgTexts.loved = {}; msgTexts.alina = {}; msgTexts.azamat = {};
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('locked'));
    document.querySelectorAll('.tab-lock').forEach(l => l.remove());
    tabLoved.classList.add('active'); tabAlina.classList.add('locked'); tabAzamat.classList.add('locked');
    { const l = document.createElement('div'); l.className = 'tab-lock'; l.textContent = '🔒'; tabAlina.appendChild(l); }
    { const l = document.createElement('div'); l.className = 'tab-lock'; l.textContent = '🔒'; tabAzamat.appendChild(l); }
    headerName.textContent = 'Любимая❤️❤️❤️'; headerAvatarImg.src = '../photo/lybov.jpg'; headerAvatarImg.style.display = 'block';
    if (headerAvatarFallback) headerAvatarFallback.style.display = 'none';
    headerStatus.textContent = 'была недавно';
    chatStarted.loved = true; startLovedChat();
}

// ═══ ЛЮБИМАЯ ═══
function startLovedChat() { addDate('15 ноября 2025'); enqueue('loved', () => new Promise(r => { loved1(); r(); })); }

function loved1() { myChoices([{ label: 'Кисуль, любимая, я приехал', next: (myId) => { enqueue('loved', () => her('УРААААА, НАКОНЕЦ ТООО', SLOW, myId).then(() => loved2())); } }]); }
function loved2() { myChoices([{ label: 'ДАААА', next: (myId) => { enqueue('loved', () => her('НУ Я ТАК ЖДАЛААА', SLOW, myId).then(() => loved3())); } }]); }
function loved3() { myChoices([{ label: 'Я ТОЖЕ ЖДАЛ ДОЛГАА ОЧЕЕЕЕНЬ', next: (myId) => { enqueue('loved', () => her('Зай, я скоро приеду', SLOW, myId).then(() => loved4())); } }]); }
function loved4() { myChoices([{ label: 'Ховошооо', next: (myId) => { enqueue('loved', async () => { await myThought('Мне не верится, я уже здесь...'); addTimeSkip('✦ Прошло 30 минут ✦'); await new Promise(r => setTimeout(r, 2000)); await her('Зай, я щас уже скоро буду подъезжать, выходи потихоньку, иди в сторону тц облаков', SLOW).then(() => loved5()); }); } }]); }
function loved5() { myChoices([{ label: 'Хорошо кисуль, это мне куда идти то, давай я тебе буду путь показывать', next: (myId) => { enqueue('loved', async () => { const hId = await her('Хорошоо, скидывай кружки, буду говорить куда идти', SLOW, myId); await her('Ну там вообще просто как выйдешь, прямо идешь', SLOW); await her('Да и все, а там увидишь тц', SLOW); loved6(); }); } }]); }
function loved6() { myChoices([{ label: 'Ну хорошо кисуль, но я все равно лучше поскидываю тебе кружки', next: (myId) => { enqueue('loved', async () => { const myId2 = await me('Ну все я иду кисуль', FAST); const hId = await her('Хорошо', NORM, myId2); const hId2 = await her('Ты там гдеее', SLOW, hId); loved7(hId2); }); } }]); }
function loved7(hId2) { myChoices([{ label: '(Отправить фото)', next: (myId) => { enqueue('loved', async () => { await mePhoto('../photo/fotka1.jpg', NORM); const myId2 = await me('Ну я вот иду только кисуль, недалеко отошел', FAST, hId2); const hId3 = await her('А вижу зай, ну ты просто прямо иди', SLOW, myId2); await her('Там если что еще скинешь, скажу куда идти', SLOW); loved8(hId3); }); } }]); }
function loved8(hId3) { myChoices([{ label: 'Хорошо кисуль', next: (myId) => { enqueue('loved', async () => { await me('Кииис', FAST); await me('Я правильно иду?', FAST); await mePhoto('../photo/fotka2.jpg', NORM); const hId4 = await her('Да все правильно, иди дальше', SLOW, myId); loved9(hId4); }); } }]); }
function loved9(hId4) { myChoices([{ label: 'Хорошооо', next: (myId) => { enqueue('loved', async () => { await me('Уже устал идти', FAST); const myId2 = await me('Пипец много', FAST); const hId5 = await her('Нормально', NORM, myId2); await her('Я уже почти приехала', SLOW); loved10(); }); } }]); }
function loved10() { myChoices([{ label: 'Хорошоо', next: (myId) => { enqueue('loved', () => her('Зай ну что ты там, пришел?', SLOW, myId).then(() => loved11())); } }]); }
function loved11() { myChoices([{ label: 'Нуу, вроде как подхожу', next: (myId) => { enqueue('loved', async () => { await me('Вот посмотри кисуль', FAST); await mePhoto('../photo/fotka3.jpg', NORM); const hId = await her('Дааа', NORM, myId); await her('Ты пришел', NORM); await her('Заходи внутрь, жди меня', SLOW); loved12(hId); }); } }]); }
function loved12(hId) { myChoices([{ label: 'Хорошооо', next: (myId) => { enqueue('loved', async () => { const myId2 = await me('Я зашел, хожу тут пока что', FAST, hId); const hId2 = await her('Хорошо зай, люблю тебя', SLOW, myId2); loved13(hId2); }); } }]); }
function loved13(hId2) { myChoices([{ label: 'А я тебя люблю', next: (myId) => { enqueue('loved', async () => { await myThought('Мне так страшно, я переживаю...'); const myId2 = await me('Я тут на фудкорт сел, буду тебя ждать', FAST, hId2); const hId3 = await her('Хорошо', NORM, myId2); await herThought('Наконец то мы встретимсяяя...'); loved14(hId3); }); } }]); }
function loved14(hId3) { myChoices([{ label: 'Мне страшно очень', next: (myId) => { enqueue('loved', () => her('Почему?', SLOW, myId).then(() => loved15())); } }]); }
function loved15() { myChoices([{ label: 'Я переживаю сильно', next: (myId) => { enqueue('loved', async () => { const hId = await her('Не надо переживать', SLOW, myId); await her('Все же хорошо', NORM); loved16(); }); } }]); }
function loved16() { myChoices([{ label: 'Ну все хорошо но мне страшно очень', next: (myId) => { enqueue('loved', async () => { await me('А вдруг ну блин', FAST); const myId2 = await me('А вдруг я буду не таким каким ты меня представляла', SLOW); const hId = await her('Ты что дурак что ли блин', SLOW, myId2); await her('Каким я могу тебя представлять', SLOW); loved17(); }); } }]); }
function loved17() { myChoices([{ label: 'Ну не знаю, я очень волнуюсь', next: (myId) => { enqueue('loved', () => her('Уже нечего волноваться, я почти подошла', SLOW, myId).then(() => loved18())); } }]); }
function loved18() { myChoices([{ label: 'Хорошо, но я очень волнуюсь', next: (myId) => { enqueue('loved', () => her('Тебе там кстати Азамат не писал?', SLOW, myId).then(() => loved19())); } }]); }
function loved19() { myChoices([{ label: 'Писал, он щас сюда придет', next: (myId) => { enqueue('loved', () => her('О боже', NORM, myId).then(() => loved20())); } }]); }
function loved20() { myChoices([{ label: 'ВХХВХВХВ', next: (myId) => { enqueue('loved', async () => { const myId2 = await me('Да все нормально же', FAST); const hId = await her('Да понятно дело', NORM, myId2); await her('Ну пусть придет', NORM); loved21(); }); } }]); }
function loved21() { myChoices([{ label: 'О а вот и он', next: (myId) => { enqueue('loved', async () => { const myId2 = await me('Кисуль, ты где, мне страшно', FAST); const hId = await her('Я уже подхожу, спускайся ко мне', SLOW, myId2); await herThought('Надо бы вот тут спрятаться, напугаю его'); loved22(hId); }); } }]); }
function loved22(hId) { myChoices([{ label: 'Я уже иду кисуль, люблю тебя', next: (myId) => { enqueue('loved', async () => { await myThought('Ну вот наконец то мы и встретимся'); lockTab('loved'); unlockTab('alina'); chatChoices.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.5);padding:10px;font-size:13px;width:100%;">✅ Чат с Алиной разблокирован!</div>'; }); } }]); }

// ═══ АЛИНА ═══
function startAlinaChat() { addDate('15 ноября 2025'); enqueue('alina', () => new Promise(r => { alina1(); r(); })); }
function alina1() { myChoices([{ label: 'Все', next: (myId) => enqueue('alina', () => alina2(myId)) }]); }
async function alina2(myId) {
    const myId2 = await me('Инет наконец то нахуй', FAST);
    const aid = await other('Ты где ее встретишь?', SLOW, myId2);
    alina3(aid);
}
function alina3(aid) { myChoices([{ label: 'Мы в облаках встречаемся', next: (myId) => enqueue('alina', () => alina4(myId, aid)) }]); }
async function alina4(myId, aid) {
    await me('Я уже тут', FAST);
    await me('Жду её', FAST);
    await me('Мне страшно', FAST);
    const myId2 = await me('Я даже голову еще не помыл', FAST);
    const aid2 = await other('Ты с бабушкой?', SLOW, myId2);
    alina5(aid2);
}
function alina5(aid2) { myChoices([{ label: 'Нет', next: (myId) => enqueue('alina', () => alina6(myId, aid2)) }]); }
async function alina6(myId, aid2) {
    const aid3 = await other('Помой в туалете', SLOW, myId);
    const aid4 = await other('А где бабушка', SLOW);
    alina7(aid4);
}
function alina7(aid4) { myChoices([{ label: 'Она в другом тц', next: (myId) => enqueue('alina', () => alina8(myId, aid4)) }]); }
async function alina8(myId, aid4) {
    const aid5 = await other('В лазурном?', SLOW, myId);
    alina9(aid5);
}
function alina9(aid5) { myChoices([{ label: 'Да', next: (myId) => enqueue('alina', () => alina10(myId, aid5)) }]); }
async function alina10(myId, aid5) {
    const aid6 = await other('Возле дома крч', SLOW, myId);
    alina11(aid6);
}
function alina11(aid6) { myChoices([{ label: 'Да ну не эт хуйня', next: (myId) => enqueue('alina', () => alina12(myId, aid6)) }]); }
async function alina12(myId, aid6) {
    await me('Я не смогу вытереть нормально и тд, а мне бы не заболеть', SLOW);
    await me('Перед операцией', FAST);
    await me('А то пизда', FAST);
    const myId2 = await me('в 14:00 она пойдет к репетитору', FAST);
    const aid7 = await other('Пиздуй ко мне мой голову и пиздуй обратно', SLOW, myId2);
    alina13(aid7);
}
function alina13(aid7) { myChoices([{ label: 'Я на заселение', next: (myId) => enqueue('alina', () => alina14(myId, aid7)) }]); }
async function alina14(myId, aid7) {
    await me('И там помою', FAST);
    await me('Ххвахвах', FAST);
    await me('Да ну не все так плачевно вроде', FAST);
    await me('Но не идеально', FAST);
    await me('Вчера то помыл ее', FAST);
    await me('перед отъездом', FAST);
    await me('Но все равно пиздец уже', FAST);
    await me('ужас', FAST);
    const myId2 = await me('страшно', FAST);
    await other('Да не бойся', SLOW);
    const aid8 = await other('Она не очень больно кусается', SLOW, myId2);
    alina15(aid8);
}
function alina15(aid8) { myChoices([{ label: 'Блять точно', next: (myId) => enqueue('alina', () => alina16(myId, aid8)) }]); }
async function alina16(myId, aid8) {
    await me('Чувствую будет доброта', FAST);
    await me('Меня схавают', FAST);
    await me('Мне страшно', FAST);
    const myId2 = await me('Я как обрыган выгляжу', FAST);
    const aid9 = await other('Покажи', SLOW, myId2);
    alina17(aid9);
}
function alina17(aid9) { myChoices([{ label: '(Отправить фото)', next: (myId) => enqueue('alina', () => alina18(myId, aid9)) }]); }
async function alina18(myId, aid9) {
    await mePhoto('../photo/ytro.jpg', NORM);
    await me('Вот так я утром выглядел, еще более менее по человечески', FAST);
    const myId2 = await me('Но щас я уже не человек', FAST);
    await other('Да нормально', SLOW);
    const aid10 = await other('Только глаза опухшие чуть чуть', SLOW, myId2);
    alina19(aid10);
}
function alina19(aid10) { myChoices([{ label: 'Да я не выспался нихуя', next: (myId) => enqueue('alina', () => alina20(myId, aid10)) }]); }
async function alina20(myId, aid10) {
    await me('Вообще ужас', FAST);
    const aid11 = await other('А я как будто много слишком поспала', SLOW, myId);
    alina21(aid11);
}
function alina21(aid11) { myChoices([{ label: 'Ужас', next: (myId) => enqueue('alina', () => alina22(myId, aid11)) }]); }
async function alina22(myId, aid11) {
    await meVideo('../video/kryjok.mp4', NORM);
    await me('Щас я так выгляжу', FAST);
    await me('Уже и волосам пизда пришла', FAST);
    const myId2 = await me('И всему', FAST);
    await other('Да нормально', SLOW);
    const aid12 = await other('Хули тебе не нравится', SLOW, myId2);
    alina23(aid12);
}
function alina23(aid12) { myChoices([{ label: 'Да мне страшно просто', next: (myId) => enqueue('alina', () => alina24(myId, aid12)) }]); }
async function alina24(myId, aid12) {
    await me('Очень страшно', FAST);
    await me('О ЕБАТЬ', FAST);
    await me('ЗАСЕЛЕНИЕ ПЕРЕНЕСЛИ', FAST);
    const myId2 = await me('УЖЕ СЕЙЧАС', FAST);
    const aid13 = await other('Ну нихуя', SLOW, myId2);
    alina25(aid13);
}
function alina25(aid13) { myChoices([{ label: 'Кайф вообще', next: (myId) => enqueue('alina', () => alina26(myId, aid13)) }]); }
async function alina26(myId, aid13) {
    const aid14 = await other('И что ты пойдешь селится?', SLOW, myId);
    alina27(aid14);
}
function alina27(aid14) { myChoices([{ label: 'Нет', next: (myId) => enqueue('alina', () => alina28(myId, aid14)) }]); }
async function alina28(myId, aid14) {
    await me('Бабушка пойдет', FAST);
    await me('Я то с Лерой буду', FAST);
    const myId2 = await me('Потом она к репетитору', FAST);
    const aid15 = await other('И что вы делать будете', SLOW, myId2);
    alina29(aid15);
}
function alina29(aid15) { myChoices([{ label: 'Я не знаю', next: (myId) => enqueue('alina', () => alina30(myId, aid15)) }]); }
async function alina30(myId, aid15) {
    const aid16 = await other('Я тоже вообще то увидеться хочу', SLOW, myId);
    await other('Ты первый мужик', SLOW);
    const aid17 = await other('Которого я одобряю', SLOW);
    alina31(aid17);
}
function alina31(aid17) { myChoices([{ label: 'Ххвхвхв', next: (myId) => enqueue('alina', () => alina32(myId, aid17)) }]); }
async function alina32(myId, aid17) {
    await me('Ну я рад', FAST);
    const myId2 = await me('Надеюсь кстати что и последний', FAST);
    const aid18 = await other('Я тоже надеюсь на это', SLOW, myId2);
    alina33(aid18);
}
async function alina33(aid18) {
    addTimeSkip('✦ Прошло 3 часа ✦');
    await new Promise(r => setTimeout(r, 2000));
    await other('Ну что', SLOW, aid18);
    await other('Не страшно?', SLOW);
    const aid19 = await other('Не съели тебя?', SLOW);
    alina34(aid19);
}
function alina34(aid19) { myChoices([{ label: 'Нет', next: (myId) => enqueue('alina', () => alina35(myId, aid19)) }]); }
async function alina35(myId, aid19) {
    await me('Неа', FAST);
    await me('Все норм, но какой то пиздец был', FAST);
    const myId2 = await me('Какие то 2 цыганки познакомится подошли', SLOW);
    const aid20 = await other('Да я знаю', SLOW, myId2);
    await other('ХАХВАХВАХВХАВХВАХВАХВА', SLOW);
    const aid21 = await other('Ты сейчас с Виталиком или домой пошел?', SLOW);
    alina36(aid21);
}
function alina36(aid21) { myChoices([{ label: 'Дома уже', next: (myId) => enqueue('alina', () => alina37(myId, aid21)) }]); }
async function alina37(myId, aid21) {
    const myId2 = await me('Помылся', FAST);
    await other('Ну все с кайфом', SLOW, myId2);
    const aid22 = await other('Лерка во сколько освободится', SLOW);
    alina38(aid22);
}
function alina38(aid22) { myChoices([{ label: 'ой не знаю', next: (myId) => enqueue('alina', () => alina39(myId, aid22)) }]); }
async function alina39(myId, aid22) {
    await me('она сказала ей 3 задачи осталось', FAST);
    const aid23 = await other('что она там', SLOW, myId);
    alina40(aid23);
}
function alina40(aid23) { myChoices([{ label: 'выходит уже', next: (myId) => enqueue('alina', () => alina41(myId, aid23)) }]); }
async function alina41(myId, aid23) {
    const aid24 = await other('А ты где', SLOW, myId);
    alina42(aid24);
}
function alina42(aid24) { myChoices([{ label: 'Выхожу тоже', next: (myId) => { enqueue('alina', async () => { lockTab('alina'); unlockTab('azamat'); chatChoices.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.5);padding:10px;font-size:13px;width:100%;">✅ Чат с Азаматом разблокирован!</div>'; }); } }]); }

// ═══ АЗАМАТ ═══
function startAzamatChat() { enqueue('azamat', () => new Promise(r => { azamat1(); r(); })); }
function azamat1() { myChoices([{ label: 'Азаматик', next: (myId) => enqueue('azamat', () => azamat2(myId)) }]); }
async function azamat2(myId) {
    const myId2 = await me('Мне страшно', FAST);
    await other('ХАХАХАХАХ', SLOW);
    const aid = await other('ТЫ ГДЕ ?', SLOW, myId2);
    azamat3(aid);
}
function azamat3(aid) { myChoices([{ label: 'Я в облаках нахуй', next: (myId) => enqueue('azamat', () => azamat4(myId, aid)) }]); }
async function azamat4(myId, aid) {
    const aid2 = await other('ХАХАХАХААХ', SLOW, myId);
    azamat5(aid2);
}
function azamat5(aid2) { myChoices([{ label: 'Ебать я тут на очке сижу', next: (myId) => enqueue('azamat', () => azamat6(myId, aid2)) }]); }
async function azamat6(myId, aid2) {
    const aid3 = await other('Она еще не пришла?', SLOW, myId);
    azamat7(aid3);
}
function azamat7(aid3) { myChoices([{ label: 'Ты не представляешь нахуй', next: (myId) => enqueue('azamat', () => azamat8(myId, aid3)) }]); }
async function azamat8(myId, aid3) {
    await me('Нет', FAST);
    const myId2 = await me('Я жду', FAST);
    const aid4 = await other('А где она?', SLOW, myId2);
    azamat9(aid4);
}
function azamat9(aid4) { myChoices([{ label: 'Она едет', next: (myId) => enqueue('azamat', () => azamat10(myId, aid4)) }]); }
async function azamat10(myId, aid4) {
    const aid5 = await other('где?', SLOW, myId);
    azamat11(aid5);
}
function azamat11(aid5) { myChoices([{ label: 'Она не говорит еще где', next: (myId) => enqueue('azamat', () => azamat12(myId, aid5)) }]); }
async function azamat12(myId, aid5) {
    await me('Она меня щас нахуй', FAST);
    await me('С спины', FAST);
    const myId2 = await me('подойдет', FAST);
    const aid6 = await other('Погоди', SLOW, myId2);
    azamat13(aid6);
}
function azamat13(aid6) { myChoices([{ label: 'Я обосрусь', next: (myId) => enqueue('azamat', () => azamat14(myId, aid6)) }]); }
async function azamat14(myId, aid6) {
    const aid7 = await other('Она писала что уже там', SLOW, myId);
    azamat15(aid7);
}
function azamat15(aid7) { myChoices([{ label: 'ОЙ БЛЯТЬ', next: (myId) => enqueue('azamat', () => azamat16(myId, aid7)) }]); }
async function azamat16(myId, aid7) {
    const myId2 = await me('Когда это было', FAST);
    await other('Минут 5', SLOW);
    const aid8 = await other('Я сказал приду', SLOW, myId2);
    azamat17(aid8);
}
function azamat17(aid8) { myChoices([{ label: 'Ебучий случай', next: (myId) => enqueue('azamat', () => azamat18(myId, aid8)) }]); }
async function azamat18(myId, aid8) {
    const aid9 = await other('Поздороваюсь и уйду', SLOW, myId);
    azamat19(aid9);
}
function azamat19(aid9) { myChoices([{ label: 'Азаматик', next: (myId) => enqueue('azamat', () => azamat20(myId, aid9)) }]); }
async function azamat20(myId, aid9) {
    await me('Мне страшно', FAST);
    const myId2 = await me('Приходи быстрее', FAST);
    await other('ХАХАХАХА', SLOW);
    const aid10 = await other('ЦЕЛОВАТЬСЯ БУДЕТЕ???', SLOW, myId2);
    azamat21(aid10);
}
function azamat21(aid10) { myChoices([{ label: 'Я тебя жду', next: (myId) => enqueue('azamat', () => azamat22(myId, aid10)) }]); }
async function azamat22(myId, aid10) {
    const myId2 = await me('Да ты че ебу дал', FAST);
    const aid11 = await other('Жди', SLOW, myId2);
    azamat23(aid11);
}
function azamat23(aid11) { myChoices([{ label: 'Мне страшно нахуй', next: (myId) => enqueue('azamat', () => azamat24(myId, aid11)) }]); }
async function azamat24(myId, aid11) {
    const myId2 = await me('хахахаха', FAST);
    const aid12 = await other('хахахаха', SLOW, myId2);
    azamat25(aid12);
}
function azamat25(aid12) { myChoices([{ label: 'Быстрее азаматик, быстрее нахуй', next: (myId) => enqueue('azamat', () => azamat26(myId, aid12)) }]); }
async function azamat26(myId, aid12) {
    const myId2 = await me('Я у ростикса сижу', FAST);
    const aid13 = await other('Сам еще лечу', SLOW, myId2);
    azamat27(aid13);
}
function azamat27(aid13) { myChoices([{ label: 'Давай давай', next: (myId) => enqueue('azamat', () => azamat28(myId, aid13)) }]); }
async function azamat28(myId, aid13) {
    await me('Беги дорогая беги', FAST);
    await me('Давай быстрее блять', FAST);
    await me('Азаматик', FAST);
    const myId2 = await me('Айталиев', FAST);
    const aid14 = await other('Уже рядом', SLOW, myId2);
    lockTab('azamat');
    chatChoices.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.4);padding:20px;font-style:italic;width:100%;">✨ Первая встреча ✨</div>';
}

// ===== ЗАПУСК =====
startChat();