// ═══════════════════════════════════════════
// ДИАЛОГ · 11.05.2025 — ПОЛНЫЙ ФИНАЛ
// ═══════════════════════════════════════════

const screens = {
    loading: document.getElementById('loading-screen'),
    profile: document.getElementById('profile-screen'),
    myProfile: document.getElementById('my-profile-screen'),
    transition: document.getElementById('transition-screen'),
    fate: document.getElementById('fate-screen'),
    chat: document.getElementById('chat-screen'),
};

const chatMessages = document.getElementById('chat-messages');
const chatChoices = document.getElementById('chat-choices');
const typingIndicator = document.getElementById('typing-indicator');

let messageCounter = 0;
const messageTexts = {};

function hideAll() {
    Object.values(screens).forEach(s => s.classList.add('hidden'));
}

function showScreen(screen) {
    hideAll();
    screen.classList.remove('hidden');
}

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

function createMessageElement(text, type, replyTo = null) {
    const id = ++messageCounter;
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.id = 'msg-' + id;
    
    const displayText = text || '🖼️ Стикер';
    messageTexts[id] = displayText;
    
    if (replyTo !== null && messageTexts[replyTo]) {
        const replyPreview = document.createElement('div');
        replyPreview.className = 'reply-preview';
        const quoteText = messageTexts[replyTo];
        replyPreview.textContent = quoteText.length > 50 ? quoteText.substring(0, 47) + '...' : quoteText;
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

function sheSendsImage(src, delay = 400, replyTo = null) {
    return new Promise(resolve => {
        setTimeout(() => {
            const { element, id } = createMessageElement('', 'hers', replyTo);
            element.style.background = 'transparent';
            element.style.padding = '4px';
            element.style.borderRadius = '12px';
            const span = element.querySelector('span');
            if (span) span.remove();
            
            const img = document.createElement('img');
            img.src = src;
            img.style.width = '120px';
            img.style.height = '120px';
            img.style.objectFit = 'contain';
            img.style.borderRadius = '8px';
            img.onerror = function() {
                this.style.display = 'none';
                element.textContent = '🖼️ Стикер';
                element.style.background = '#4a76a8';
                element.style.padding = '10px 14px';
            };
            element.appendChild(img);
            
            messageTexts[id] = '🖼️ Стикер';
            
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

// ===== ЗАГРУЗКА → АНКЕТА =====
setTimeout(() => showScreen(screens.profile), 2000);

document.getElementById('like-btn').addEventListener('click', () => showScreen(screens.myProfile));
document.getElementById('dislike-btn').addEventListener('click', () => showScreen(screens.fate));
document.getElementById('retry-btn').addEventListener('click', () => showScreen(screens.profile));
document.getElementById('back-from-profile').addEventListener('click', () => showScreen(screens.profile));
document.getElementById('add-friend-btn').addEventListener('click', () => {
    showScreen(screens.transition);
    setTimeout(() => {
        showScreen(screens.chat);
        startChat();
    }, 2500);
});

// ===== ЧАТ =====
async function startChat() {
    chatMessages.innerHTML = '';
    messageCounter = 0;
    for (const key in messageTexts) delete messageTexts[key];
    
    addDate('11 мая 2025');
    
    // 1. Стикер лягушки
    const sticker1Id = await sheSendsImage('../photo/frog-sticker.png', 600);
    
    // 2. Он: Привет (не ответ — первое сообщение)
    const hiId = await heSends('Привет', 1000);
    
    // 3. Она: как ты? (ответ на Привет)
    showHerChoices([
        { label: 'как ты?', action: async () => {
            const kakId = await sheSends('как ты?', 200, hiId);
            step2(kakId);
        }}
    ]);
}

// 4. Он: да хуево всё + а ты как
async function step2(kakId) {
    const huId = await heSends('да хуево всё', 800, kakId);
    const akId = await heSends('а ты как', 600);
    
    // 5. Она: че так (ответ на да хуево всё) + еще два
    showHerChoices([
        { label: 'че так', action: async () => {
            const cheId = await sheSends('че так', 200, huId);
            await sheSends('тяжелый день?', 400);
            const horoshId = await sheSends('да хорошо все', 400, akId);
            step3(cheId);
        }}
    ]);
}

// 6. Он: завтра проект сдавать + нихуя не готовил + о ну это кайф
async function step3(cheId) {
    const projId = await heSends('завтра проект сдавать', 800, cheId);
    const negId = await heSends('нихуя не готовил', 600);
    const kfId = await heSends('о ну это кайф', 600);
    
    // 7. Она: в 10? (ответ на завтра проект сдавать)
    showHerChoices([
        { label: 'в 10?', action: async () => {
            const v10Id = await sheSends('в 10?', 200, projId);
            step4(v10Id);
        }}
    ]);
}

// 8. Он: 1 курс (ответ на в 10?)
async function step4(v10Id) {
    const kursId = await heSends('1 курс', 600, v10Id);
    
    // 9. Она: аа (ответ на 1 курс)
    showHerChoices([
        { label: 'аа', action: async () => {
            const aaId = await sheSends('аа', 200, kursId);
            step5();
        }}
    ]);
}

// 10. Она: успехов тебе → Он: спасибо
async function step5() {
    await sheSends('успехов тебе', 500);
    const spsId = await heSends('спасибо', 600);
    
    // 11. Она: удача для лохов (ответ на спасибо)
    showHerChoices([
        { label: 'удача для лохов', action: async () => {
            const udachaId = await sheSends('удача для лохов', 200, spsId);
            step6(udachaId);
        }}
    ]);
}

// 12. Он: ахха по факту (ответ на удача для лохов)
async function step6(udachaId) {
    const factId = await heSends('ахха по факту', 600, udachaId);
    
    // 13. Она: проект хоть есть (ответ на ахха по факту)
    showHerChoices([
        { label: 'проект хоть есть', action: async () => {
            const proektId = await sheSends('проект хоть есть', 200, factId);
            step7(proektId);
        }}
    ]);
}

// 14. Он: имеется (ответ на проект хоть есть) + мне тут немного сделать надо
async function step7(proektId) {
    const imId = await heSends('имеется', 500, proektId);
    const nemnId = await heSends('мне тут немного сделать надо', 600);
    
    // 15. Она: так уже нехуево (ответ на мне тут немного сделать надо)
    showHerChoices([
        { label: 'так уже нехуево', action: async () => {
            const nehId = await sheSends('так уже нехуево', 200, nemnId);
            step8();
        }}
    ]);
}

// 16. Он расписывает что делать
async function step8() {
    await heSends('опрос надо сделать, накрутить там прохождения', 800);
    await heSends('потом добавить в презентацию', 600);
    await heSends('ну не долго', 500);
    await heSends('час или два', 500);
    const gotId = await heSends('и всё готово', 500);
    
    // 17. Она: сложно у вас все (ответ на и всё готово)
    showHerChoices([
        { label: 'сложно у вас все', action: async () => {
            const slozhnoId = await sheSends('сложно у вас все', 200, gotId);
            step9(slozhnoId);
        }}
    ]);
}

// 18. Она: я подруге рефераты делаю → Он: ахахахаха кайф + а ты где учишься
async function step9(slozhnoId) {
    const podrugeId = await sheSends('я подруге рефераты и презентации делаю', 600);
    const kf2Id = await heSends('ахахахаха кайф', 600, podrugeId);
    const uchId = await heSends('а ты где учишься', 600);
    
    // 19. Она: так я в 9 (ответ на а ты где учишься)
    showHerChoices([
        { label: 'так я в 9', action: async () => {
            const v9Id = await sheSends('так я в 9', 200, uchId);
            step10(v9Id);
        }}
    ]);
}

// 20. Она: а она на 1 курсе → Он: а норм + а ты кста с какого города + интересно
async function step10(v9Id) {
    await sheSends('а она на 1 курсе', 500);
    const normId = await heSends('а норм', 500, v9Id);
    const gorId = await heSends('а ты кста с какого города', 600);
    await heSends('интересно', 500);
    
    // 21. Она: такое чувство... (ответ на а ты кста с какого города)
    showHerChoices([
        { label: 'такое чувство, что я с ней заочно обучение прохожу', action: async () => {
            const chuvstvoId = await sheSends('такое чувство, что я с ней заочно обучение прохожу', 200, gorId);
            step11(chuvstvoId);
        }}
    ]);
}

// 22. Она: хвахавхв → Он: хвахвах (ответ на хвахавхв)
async function step11(chuvstvoId) {
    const hva1Id = await sheSends('хвахавхв', 400);
    const hva2Id = await heSends('хвахвах', 500, hva1Id);
    
    // 23. Она: ну сука
    showHerChoices([
        { label: 'ну сука', action: async () => {
            await sheSends('ну сука', 200, hva2Id);
            step12();
        }}
    ]);
}

// 24. Она: саратов → Он: ахереть (ответ на саратов)
async function step12() {
    const saratovId = await sheSends('саратов', 400);
    const ahId = await heSends('ахереть', 500, saratovId);
    
    // 25. Она: стикер мышки (ответ на ахереть)
    showHerChoices([
        { label: '😔 (отправить стикер)', action: async () => {
            const sticker2Id = await sheSendsImage('../photo/mouse.png', 200, ahId);
            step13(sticker2Id);
        }}
    ]);
}

// 26. Он: у меня там кент поживает (ответ на стикер)
async function step13(sticker2Id) {
    const kentId = await heSends('у меня там кент поживает', 700, sticker2Id);
    
    // 27. Она: хахах (ответ на кент поживает) + мой земляк → Он: да + как то сбегал + я в шоке
    showHerChoices([
        { label: 'хахах', action: async () => {
            const hahahId = await sheSends('хахах', 400, kentId);
            const zemlyakId = await sheSends('мой земляк', 400);
            const daId = await heSends('да', 400, zemlyakId);
            await heSends('как то сбегал из саратова он', 600);
            const shokId = await heSends('я в шоке', 500);
            step14(shokId);
        }}
    ]);
}

// 28. Она: мой старший брат тоже сбежал (ответ на я в шоке)
function step14(shokId) {
    showHerChoices([
        { label: 'мой старший брат тоже сбежал', action: async () => {
            const bratId = await sheSends('мой старший брат тоже сбежал', 500, shokId);
            const ah2Id = await heSends('ахереть', 500, bratId);
            await heSends('как такое возможно', 600);
            step15();
        }}
    ]);
}

// 29. Она: он в тихоряя + пока никто не видит → Он: хахаха + культурно
function step15() {
    showHerChoices([
        { label: 'он в тихоряя', action: async () => {
            await sheSends('он в тихоряя', 400);
            await sheSends('пока никто не видит', 400);
            await heSends('хахаха', 400);
            const cultId = await heSends('культурно', 400);
            step16(cultId);
        }}
    ]);
}

// 30. Она: да (ответ на культурно) → Он: вот чисто вопрос...
function step16(cultId) {
    showHerChoices([
        { label: 'да', action: async () => {
            const daId = await sheSends('да', 300, cultId);
            await heSends('вот чисто вопрос, давно в дв сидишь?', 700);
            step17();
        }}
    ]);
}

// 31. Она: первый день → Он: понял (ответ на первый день)
function step17() {
    showHerChoices([
        { label: 'первый день', action: async () => {
            const pdId = await sheSends('первый день', 400);
            const ponyalId = await heSends('понял', 400, pdId);
            step18();
        }}
    ]);
}

// 32. Она: а что → Он: да просто интересно (ответ на а что)
function step18() {
    showHerChoices([
        { label: 'а что', action: async () => {
            const chtoId = await sheSends('а что', 300);
            await heSends('да просто интересно', 500, chtoId);
            step19();
        }}
    ]);
}

// 33. Она: ну в смысле с перерывами + давно → Он: а (ответ на давно)
function step19() {
    showHerChoices([
        { label: 'ну в смысле с перерывами', action: async () => {
            await sheSends('ну в смысле с перерывами', 500);
            const davnoId = await sheSends('давно', 300);
            const aId = await heSends('а', 300, davnoId);
            step20();
        }}
    ]);
}

// 34. Она: а так → Он: ну а парень у тебя был с дв?
function step20() {
    showHerChoices([
        { label: 'а так', action: async () => {
            await sheSends('а так', 300);
            const parId = await heSends('ну а парень у тебя был с дв?', 600);
            step21(parId);
        }}
    ]);
}

// 35. Она: месяц два не заходила даже (ответ на вопрос про парня)
function step21(parId) {
    showHerChoices([
        { label: 'месяц два не заходила даже', action: async () => {
            await sheSends('месяц два не заходила даже', 500, parId);
            step22();
        }}
    ]);
}

// 36. Она: нууу + честно не помню → Он: ахха лан
function step22() {
    showHerChoices([
        { label: 'нууу', action: async () => {
            await sheSends('нууу', 300);
            await sheSends('честно, не помню', 400);
            await heSends('ахха лан', 400);
            step23();
        }}
    ]);
}

// 37. Она: я с лучшим другом + в дв познакомилась → Он: о норм (ответ на в дв познакомилась)
function step23() {
    showHerChoices([
        { label: 'я с лучшим другом', action: async () => {
            await sheSends('я с лучшим другом', 500);
            const dvId = await sheSends('в дв познакомилась', 400);
            const norm2Id = await heSends('о норм', 400, dvId);
            step24();
        }}
    ]);
}

// 38. Она: два года дружим уже → Он: по кайфу (ответ)
function step24() {
    showHerChoices([
        { label: 'два года дружим уже', action: async () => {
            const dvaId = await sheSends('два года дружим уже', 400);
            const kf3Id = await heSends('по кайфу', 400, dvaId);
            step25(kf3Id);
        }}
    ]);
}

// 39. Она: бля такой он даун (ответ на по кайфу)
function step25(kf3Id) {
    showHerChoices([
        { label: 'бля такой он даун', action: async () => {
            const daunId = await sheSends('бля такой он даун', 400, kf3Id);
            step26(daunId);
        }}
    ]);
}

// 40. Она: хахахаха → Он: хахаха (ответ) + почему
function step26(daunId) {
    showHerChoices([
        { label: 'хахахаха', action: async () => {
            await sheSends('хахахаха', 400, daunId);
            const haha3Id = await heSends('хахаха', 300);
            const pochId = await heSends('почему', 400);
            step27(pochId);
        }}
    ]);
}

// 41. Она: он угарный пиздец (ответ на почему) + ну иногда обижаюсь
function step27(pochId) {
    showHerChoices([
        { label: 'он угарный пиздец', action: async () => {
            const ugarniyId = await sheSends('он угарный пиздец', 500, pochId);
            const obizhId = await sheSends('ну иногда обижаюсь на него', 500);
            step28(obizhId);
        }}
    ]);
}

// 42. Он: жалко добряка (ответ на ну иногда обижаюсь) — АВТОМАТ
async function step28(obizhId) {
    const jalkoId = await heSends('жалко добряка', 400, obizhId);
    
    // 43. Она: потому что на телок меняет (ответ на жалко добряка)
    showHerChoices([
        { label: 'потому что на телок меняет', action: async () => {
            const menyaetId = await sheSends('потому что на телок меняет', 500, jalkoId);
            const haha4Id = await heSends('хахахаха', 400, menyaetId);
            step29();
        }}
    ]);
}

// 44. Она: 🙄🙄🙄 → Он: да блять (ответ)
function step29() {
    showHerChoices([
        { label: '🙄🙄🙄', action: async () => {
            const smailId = await sheSends('🙄🙄🙄', 400);
            const dbId = await heSends('да блять', 400, smailId);
            step30(dbId);
        }}
    ]);
}

// 45. Она: щас более менее (ответ на да блять)
function step30(dbId) {
    showHerChoices([
        { label: 'щас более менее', action: async () => {
            const boleeId = await sheSends('щас более менее', 400, dbId);
            step31(boleeId);
        }}
    ]);
}

// 46. Он: только не эти смайлики + только не это + господи — АВТОМАТ
async function step31(boleeId) {
    await heSends('только не эти смайлики', 500, boleeId);
    await heSends('только не это', 400);
    const gosId = await heSends('господи', 400);
    
    // 47. Она: хоть гуляем (ответ на господи)
    showHerChoices([
        { label: 'хоть гуляем', action: async () => {
            const gulyaemId = await sheSends('хоть гуляем', 400, gosId);
            step32(gulyaemId);
        }}
    ]);
}

// 48. Он: пощадите меня (ответ на хоть гуляем) — АВТОМАТ
async function step32(gulyaemId) {
    const poshId = await heSends('пощадите меня', 400, gulyaemId);
    
    // 49. Она: да я в рофл юзаю (ответ на пощадите меня)
    showHerChoices([
        { label: 'да я в рофл юзаю', action: async () => {
            const roflId = await sheSends('да я в рофл юзаю', 400, poshId);
            step33();
        }}
    ]);
}

// 50. Она: нет → Он: мне от них страшно становится уже (ответ на нет)
function step33() {
    showHerChoices([
        { label: 'нет', action: async () => {
            const netId = await sheSends('нет', 300);
            const strashId = await heSends('мне от них страшно становится уже', 500, netId);
            step34(strashId);
        }}
    ]);
}

// 51. Она: 😏😏😏 (ответ на страшно) → Он: у меня тут пиздец + меня как бомжа керят + 0 уважения
function step34(strashId) {
    showHerChoices([
        { label: '😏😏😏', action: async () => {
            const smail2Id = await sheSends('😏😏😏', 400, strashId);
            await heSends('у меня тут пиздец', 500, smail2Id);
            await heSends('меня как бомжа керят', 500);
            const uvId = await heSends('0 уважения', 400);
            step35(uvId);
        }}
    ]);
}

// 52. Она: ХАХАХАХА (ответ на 0 уважения) + клевета + и провокация
function step35(uvId) {
    showHerChoices([
        { label: 'ХАХАХАХА', action: async () => {
            const haha5Id = await sheSends('ХАХАХАХА', 400, uvId);
            await sheSends('клевета', 400);
            await sheSends('и провокация', 400);
            step36();
        }}
    ]);
}

// 53. Он: нононо (ответ на и провокация) — АВТОМАТ
async function step36() {
    const nonoId = await heSends('нононо', 300);
    
    // 54. Она: чо англичанин типо (ответ на нононо)
    showHerChoices([
        { label: 'чо англичанин типо', action: async () => {
            const anglichId = await sheSends('чо англичанин типо', 400, nonoId);
            const neId = await heSends('не', 300, anglichId);
            await heSends('там свои дела', 400);
            await heSends('блатные привычки', 500);
            const tgId = await heSends('у тебя тгшка есть?', 500);
            step37(tgId);
        }}
    ]);
}

// 55. Она: кнш (ответ на у тебя тгшка есть) → Он: дай тг + там удобнее
function step37(tgId) {
    showHerChoices([
        { label: 'кнш', action: async () => {
            const knshId = await sheSends('кнш', 300, tgId);
            await heSends('дай тг', 400, knshId);
            await heSends('там удобнее', 500);
            step38();
        }}
    ]);
}

// 56. Она: я в вк вщ не сижу → Он: я этого вк рот ебал (ответ) + а кто тут сидит то
function step38() {
    showHerChoices([
        { label: 'я в вк вщ не сижу', action: async () => {
            const neSizhuId = await sheSends('я в вк вщ не сижу', 500);
            const rotId = await heSends('я этого вк рот ебал', 500, neSizhuId);
            const ktoId = await heSends('а кто тут сидит то', 400);
            step39(ktoId);
        }}
    ]);
}

// 57. Она: @neloverska (ответ на а кто тут сидит то)
function step39(ktoId) {
    showHerChoices([
        { label: '@neloverska', action: async () => {
            const nickId = await sheSends('@neloverska', 400, ktoId);
            step40(nickId);
        }}
    ]);
}

// 58. Она: да меня сука в тг просто никто не лайкает + я даже вк скачала → Он: ХАХАХАХАХА (ответ)
function step40(nickId) {
    showHerChoices([
        { label: 'да меня сука в тг просто никто не лайкает', action: async () => {
            await sheSends('да меня сука в тг просто никто не лайкает', 600);
            const skachalaId = await sheSends('я даже вк скачала', 500);
            await heSends('ХАХАХАХАХА', 600, skachalaId);
            
            chatChoices.innerHTML = `
                <div style="text-align:center; color: rgba(255,255,255,0.5); padding: 20px; font-style: italic; width:100%;">
                    ✨ Конец первого диалога ✨<br>
                    <span style="font-size:12px;">11 мая 2025</span>
                </div>
            `;
            scrollToBottom();
        }}
    ]);
}