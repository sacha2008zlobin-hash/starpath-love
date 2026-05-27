// ═══════════════════════════════════════════
// ДИАЛОГ · 29.05.2026 — ФИНАЛ
// ═══════════════════════════════════════════

const chatScreen = document.getElementById('chat-screen');
const yearScreen = document.getElementById('year-screen');
const chatMessages = document.getElementById('chat-messages');
const chatChoicesEl = document.getElementById('chat-choices');
const typingIndicator = document.getElementById('typing-indicator');

const FAST = 400; const NORM = 700; const SLOW = 1000;

function scrollToBottom() { requestAnimationFrame(() => { chatMessages.scrollTop = chatMessages.scrollHeight; }); }
function showTyping() { typingIndicator.classList.remove('hidden'); scrollToBottom(); }
function hideTyping() { typingIndicator.classList.add('hidden'); }

function addMsg(text, type) {
    const m = document.createElement('div'); m.className = `message ${type}`; m.textContent = text;
    chatMessages.appendChild(m); scrollToBottom(); return m;
}
function she(text, d = NORM) { return new Promise(r => { setTimeout(() => { addMsg(text, 'hers'); r(); }, d); }); }
function he(text, d = SLOW) { return new Promise(r => { showTyping(); setTimeout(() => { hideTyping(); addMsg(text, 'his'); r(); }, d); }); }
function addDate(text) { const d = document.createElement('div'); d.className = 'message-date'; d.textContent = text; chatMessages.appendChild(d); scrollToBottom(); }

function showChoices(opts) {
    chatChoicesEl.innerHTML = '';
    opts.forEach(o => { const b = document.createElement('button'); b.className = o.cls || 'choice-btn'; b.textContent = o.label;
        b.onclick = () => { chatChoicesEl.innerHTML = ''; if (o.action) o.action(); };
        chatChoicesEl.appendChild(b);
    }); scrollToBottom();
}

// ===== ЧАТ =====
function startChat() {
    chatMessages.innerHTML = ''; addDate('29 мая 2026');
    he('Кис, мы дошли до этого').then(() => {
        showChoices([{ label: 'Да зай', action: () => she('Да зай').then(() => {
            he('Надеюсь мы проведем все время вместе').then(() => {
                showChoices([{ label: 'Конечно зай, я люблю тебя', action: () => she('Конечно зай, я люблю тебя').then(step2) }]);
            });
        }) }]);
    });
}

async function step2() {
    await he('Кисуль, спасибо за то, что ты есть у меня');
    await he('Когда все это происходит');
    await he('У тебя только настал этот день');
    await he('И то как мы проведем его');
    await he('Зависит только от нас');
    await he('Для меня это очень важная дата, как и для тебя');
    await he('Кисуль, давай пожалуйста весь день проведем вместе, я люблю тебя');
    await he('Твой ответ будет уже в нашем с тобой чате дорогая');
    
    showChoices([{ label: 'Продолжить ✨', cls: 'choice-btn continue-btn', action: () => {
        chatScreen.classList.add('hidden');
        yearScreen.classList.remove('hidden');
        initYearScreen();
    }}]);
}

// ===== ЭКРАН ГОДА =====
function initYearScreen() {
    initStars();
    drawMonthMarks();
    animateCircle();
}

function initStars() {
    const c = document.getElementById('stars-bg');
    const ctx = c.getContext('2d');
    c.width = window.innerWidth; c.height = window.innerHeight;
    const stars = Array.from({length:120}, () => ({ x:Math.random()*c.width, y:Math.random()*c.height, r:Math.random()*1.5+0.3, a:Math.random(), s:0.005+Math.random()*0.02 }));
    (function draw() {
        ctx.fillStyle = 'rgba(6,6,18,0.25)'; ctx.fillRect(0,0,c.width,c.height);
        stars.forEach(s => { s.a+=s.s; const o=0.2+Math.sin(s.a)*0.3+0.3;
            ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle=`rgba(255,255,255,${o})`; ctx.fill(); });
        requestAnimationFrame(draw);
    })();
}

// Рисуем 12 точек-месяцев на круге
function drawMonthMarks() {
    const g = document.getElementById('month-marks');
    const cx = 200, cy = 200, r = 155;
    const months = ['Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек','Янв','Фев','Мар','Апр'];
    for (let i = 0; i < 12; i++) {
        const angle = -Math.PI/2 + (i / 12) * 2 * Math.PI;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const dot = document.createElementNS('http://www.w3.org/2000/svg','circle');
        dot.setAttribute('cx', x); dot.setAttribute('cy', y); dot.setAttribute('r', '4');
        dot.setAttribute('fill', 'rgba(255,255,255,0.15)');
        dot.classList.add('month-dot'); dot.dataset.index = i;
        g.appendChild(dot);
        // Подпись
        const txt = document.createElementNS('http://www.w3.org/2000/svg','text');
        txt.setAttribute('x', cx + (r+16) * Math.cos(angle));
        txt.setAttribute('y', cy + (r+16) * Math.sin(angle));
        txt.setAttribute('fill', 'rgba(255,255,255,0.25)');
        txt.setAttribute('font-size', '9'); txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('dominant-baseline', 'middle'); txt.setAttribute('font-family', 'Inter');
        txt.textContent = months[i]; g.appendChild(txt);
    }
}

function animateCircle() {
    const circle = document.getElementById('progress-circle');
    const markerStart = document.getElementById('marker-start');
    const markerEnd = document.getElementById('marker-end');
    const startLabel = document.getElementById('start-label');
    const endLabel = document.getElementById('end-label');
    const dots = document.querySelectorAll('.month-dot');
    
    // Показываем старт
    setTimeout(() => { startLabel.classList.remove('hidden'); markerStart.classList.remove('hidden'); }, 400);
    
    // Заполняем круг и месяцы
    setTimeout(() => {
        circle.style.strokeDashoffset = '0';
        // Зажигаем точки по очереди
        dots.forEach((dot, i) => {
            setTimeout(() => { dot.classList.add('filled'); }, i * 400);
        });
    }, 1200);
    
    // Показываем конец
    setTimeout(() => {
        markerEnd.classList.remove('hidden');
        endLabel.classList.remove('hidden');
    }, 6000);
    
    // Фразы
    setTimeout(showPhrases, 6500);
}

function showPhrases() {
    const phrases = [
        "Я люблю тебя","Ты все что нужно для меня","Ты мое все","Ты моя любовь",
        "Без тебя, меня нет","Ты станешь моей женой","Ты безумно красивая",
        "Безумно люблю вас с дочкой","Вы мое все","Без тебя я не могу"
    ];
    const container = document.getElementById('floating-phrases');
    const positions = [
        {top:'4%',left:'5%'},{top:'4%',right:'5%'},{top:'20%',left:'2%'},{top:'20%',right:'2%'},
        {top:'40%',left:'3%'},{top:'40%',right:'3%'},{top:'60%',left:'2%'},{top:'60%',right:'2%'},
        {top:'80%',left:'5%'},{top:'80%',right:'5%'}
    ];
    
    phrases.forEach((p, i) => {
        setTimeout(() => {
            const el = document.createElement('div'); el.className = 'float-phrase'; el.textContent = p;
            if (positions[i].top) el.style.top = positions[i].top;
            if (positions[i].left) el.style.left = positions[i].left;
            if (positions[i].right) el.style.right = positions[i].right;
            container.appendChild(el);
            requestAnimationFrame(() => el.classList.add('visible'));
            // Исчезновение через 6 сек
            setTimeout(() => { el.classList.add('fading'); setTimeout(() => el.remove(), 1500); }, 6000);
        }, i * 350);
    });
    
    // Финал
    setTimeout(() => { document.getElementById('final-message').classList.remove('hidden'); }, 5000);
}

// ===== ЗАПУСК =====
startChat();