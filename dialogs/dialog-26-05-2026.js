// ═══════════════════════════════════════════
// ДИАЛОГ · 26.05.2026 — СКОРО ВТОРОЕ ЛЕТО
// КОЛЕСО СУДЬБЫ
// ═══════════════════════════════════════════

const chatScreen = document.getElementById('chat-screen');
const wheelScreen = document.getElementById('wheel-screen');
const chatMessages = document.getElementById('chat-messages');
const chatChoicesEl = document.getElementById('chat-choices');
const typingIndicator = document.getElementById('typing-indicator');
const wheelCanvas = document.getElementById('wheel-canvas');
const spinBtn = document.getElementById('spin-btn');
const wheelResult = document.getElementById('wheel-result');
const ctx = wheelCanvas.getContext('2d');

let msgId = 0;
const msgTexts = {};

const FAST = 500;
const NORM = 800;
const SLOW = 1100;

// ═══ ЧАТ ═══
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

function addDate(text) { const d = document.createElement('div'); d.className = 'message-date'; d.textContent = text; chatMessages.appendChild(d); scrollToBottom(); }

function herChoices(opts) {
    chatChoicesEl.innerHTML = '';
    opts.forEach(o => { const b = document.createElement('button'); b.className = 'choice-btn'; b.textContent = o.label;
        b.onclick = () => { chatChoicesEl.innerHTML = ''; sheSends(o.label, FAST).then(myId => o.next(myId)); };
        chatChoicesEl.appendChild(b);
    }); scrollToBottom();
}

// ===== СТАРТ ЧАТА =====
function startChat() {
    chatMessages.innerHTML = ''; msgId = 0;
    for (const k in msgTexts) delete msgTexts[k];
    addDate('26 мая 2026');
    step1();
}

function step1() {
    heSends('Кисуль, у нас уже так скоро год, мне не верится', SLOW).then(hisId => {
        herChoices([{ label: 'Да зай, люблю тебя', next: (myId) => {
            heSends('А я тебя люблю кисуль', SLOW, myId).then(() => {
                // Переход к колесу
                setTimeout(() => {
                    chatScreen.classList.add('hidden');
                    wheelScreen.classList.remove('hidden');
                    initWheel();
                }, 1500);
            });
        }}]);
    });
}

// ═══ КОЛЕСО СУДЬБЫ ═══
const SEGMENTS = 8;
const colors = ['#ff2d55', '#ff6b9d', '#ff2d55', '#ff6b9d', '#ff2d55', '#ff6b9d', '#ff2d55', '#ff6b9d'];
let spinning = false;
let currentAngle = 0;

function drawWheel(angle) {
    const cx = wheelCanvas.width / 2;
    const cy = wheelCanvas.height / 2;
    const radius = Math.min(cx, cy) - 10;
    const arcSize = (2 * Math.PI) / SEGMENTS;
    
    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    
    // Сегменты
    for (let i = 0; i < SEGMENTS; i++) {
        const startAngle = angle + i * arcSize;
        const endAngle = startAngle + arcSize;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = '#1a1a2e';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Текст
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + arcSize / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillText('Выйди за меня', radius - 20, 5);
        ctx.fillText('замуж ❤️', radius - 20, 22);
        ctx.restore();
    }
    
    // Центр
    ctx.beginPath();
    ctx.arc(cx, cy, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('🎡', cx, cy + 5);
}

function initWheel() {
    drawWheel(currentAngle);
    wheelResult.classList.add('hidden');
    spinBtn.disabled = false;
    spinBtn.textContent = 'КРУТИТЬ КОЛЕСО';
}

spinBtn.addEventListener('click', () => {
    if (spinning) return;
    spinning = true;
    spinBtn.disabled = true;
    spinBtn.textContent = 'Крутится...';
    wheelResult.classList.add('hidden');
    
    // Случайное количество оборотов
    const spins = 5 + Math.random() * 5;
    const targetAngle = currentAngle + spins * 2 * Math.PI;
    const duration = 4000;
    const startAngle = currentAngle;
    const startTime = performance.now();
    
    function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Замедление в конце
        const ease = 1 - Math.pow(1 - progress, 3);
        currentAngle = startAngle + (targetAngle - startAngle) * ease;
        drawWheel(currentAngle);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Колесо остановилось
            spinning = false;
            spinBtn.disabled = false;
            spinBtn.textContent = 'КРУТИТЬ ЕЩЁ РАЗ';
            
            // Показываем результат
            wheelResult.classList.remove('hidden');
            wheelResult.innerHTML = `
                <div class="result-text">💍 Выйди за меня замуж 💍</div>
                <div class="result-sub">Судьба решена! Ты должна выполнить!</div>
            `;
        }
    }
    
    requestAnimationFrame(animate);
});

// ===== ЗАПУСК =====
startChat();