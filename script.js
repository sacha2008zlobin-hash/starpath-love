const CONFIG = {
    anniversary: new Date('2026-05-29T00:00:00'),
    memories: [
        { date: '11.05.2025', text: 'Случайное, но самое удачное знакомство.', dialog: 'dialogs/dialog-11-05-2025.html' },
        { date: '18.05.2025', text: 'Спасибо большое...', dialog: 'dialogs/dialog-18-05-2025.html' },
        { date: '29.05.2025', text: 'Начало нашей любви.', dialog: 'dialogs/dialog-29-05-2025.html' },
        { date: '15.11.2025', text: 'Первая встреча.', dialog: 'dialogs/dialog-15-11-2025.html' },
        { date: '16.11.2025', text: 'Грустный отъезд.', dialog: 'dialogs/dialog-16-11-2025.html' },
        { date: '31.12.2025', text: 'Первый новый год вместе.', dialog: 'dialogs/dialog-31-12-2025.html' },
        { date: '23.02.2026', text: 'Стих посвященный мне.', dialog: 'dialogs/dialog-23-02-2026.html' },
        { date: '07.03.2026', text: 'Наша вторая встреча.', dialog: 'dialogs/dialog-07-03-2026.html' },
        { date: '16.03.2026', text: 'Твой первый день рождения вместе.', dialog: 'dialogs/dialog-16-03-2026.html' },
        { date: '01.04.2026', text: 'Наше первое апреля вместеее.', dialog: 'dialogs/dialog-01-04-2026.html' },
        { date: '26.05.2026', text: 'Скоро наше второе лето.', dialog: 'dialogs/dialog-26-05-2026.html' },
        { date: '29.05.2026', text: 'Наш первый год вместе.', dialog: 'dialogs/dialog-29-05-2026.html' },
    ]
};

const screens = {
    constellation: document.getElementById('constellation-screen'),
    portal: document.getElementById('portal-screen'),
    memories: document.getElementById('memories-screen'),
};

// ===== ДИАЛОГОВЫЙ ОВЕРЛЕЙ =====
const dialogOverlay = document.getElementById('dialog-overlay');
const dialogFrame = document.getElementById('dialog-frame');
const closeDialogBtn = document.getElementById('close-dialog');
const cursorDot = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

closeDialogBtn.addEventListener('click', () => {
    dialogOverlay.classList.add('hidden');
    dialogFrame.src = '';
    // Возвращаем кастомный курсор
    if (cursorDot) cursorDot.style.display = 'block';
    if (cursorRing) cursorRing.style.display = 'block';
    document.body.style.cursor = 'none';
});

function openDialog(url) {
    dialogFrame.src = url;
    dialogOverlay.classList.remove('hidden');
    // Показываем обычный курсор, скрываем кастомный
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
    document.body.style.cursor = 'auto';
}

// КУРСОР
function initCursor() {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if (!cursor || !ring) return;
    
    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    
    function animate() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        cursor.style.left = (mx - 5) + 'px';
        cursor.style.top = (my - 5) + 'px';
        ring.style.left = (rx - 18) + 'px';
        ring.style.top = (ry - 18) + 'px';
        requestAnimationFrame(animate);
    }
    animate();
}

// ЗВЁЗДНЫЙ ФОН
function initStarBackground() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let W, H;
    const stars = [];
    
    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            size: Math.random() * 2 + 0.5,
            twinkle: Math.random() * Math.PI * 2,
            speed: 0.01 + Math.random() * 0.03,
        });
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(6,6,18,0.2)';
        ctx.fillRect(0, 0, W, H);
        
        stars.forEach(star => {
            star.twinkle += star.speed;
            const opacity = 0.3 + Math.sin(star.twinkle) * 0.4 + 0.4;
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${opacity})`;
            ctx.fill();
            
            const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
            glow.addColorStop(0, `rgba(181,123,238,${opacity * 0.3})`);
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(draw);
    }
    draw();
}

// СОЗВЕЗДИЕ
function initConstellation() {
    const stars = document.querySelectorAll('.star-node');
    const linesGroup = document.getElementById('lines-group');
    const counter = document.getElementById('connected-count');
    const progress = document.getElementById('constellation-progress');
    
    let connectedCount = 0;
    
    const starDataArray = [];
    stars.forEach(star => {
        starDataArray.push({
            cx: parseFloat(star.getAttribute('cx')),
            cy: parseFloat(star.getAttribute('cy')),
            month: parseInt(star.getAttribute('data-month')),
            name: star.getAttribute('data-name'),
            element: star,
        });
    });
    
    starDataArray.sort((a, b) => a.month - b.month);
    
    function highlightNextAvailable() {
        stars.forEach(s => s.classList.remove('available'));
        const nextMonth = connectedCount + 1;
        const nextStar = starDataArray.find(s => s.month === nextMonth);
        if (nextStar) nextStar.element.classList.add('available');
    }
    
    function handleStarClick(starElement) {
        const month = parseInt(starElement.getAttribute('data-month'));
        
        if (month === connectedCount + 1) {
            connectStar(starElement);
            connectedCount++;
            updateUI();
            highlightNextAvailable();
            
            if (connectedCount === 12) {
                setTimeout(completeConstellation, 1500);
            }
        } else {
            shakeStar(starElement);
        }
    }
    
    stars.forEach(star => {
        star.addEventListener('click', () => handleStarClick(star));
    });
    
    function connectStar(starElement) {
        starElement.classList.remove('available');
        starElement.classList.add('connected');
        
        if (connectedCount > 0) {
            const prevData = starDataArray[connectedCount - 1];
            const currentData = starDataArray.find(s => s.month === parseInt(starElement.getAttribute('data-month')));
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', prevData.cx);
            line.setAttribute('y1', prevData.cy);
            line.setAttribute('x2', currentData.cx);
            line.setAttribute('y2', currentData.cy);
            line.classList.add('constellation-line');
            linesGroup.appendChild(line);
        }
        
        const currentMonth = parseInt(starElement.getAttribute('data-month'));
        if (currentMonth === 12) {
            const lastData = starDataArray.find(s => s.month === 12);
            const firstData = starDataArray.find(s => s.month === 1);
            
            const closingLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            closingLine.setAttribute('x1', lastData.cx);
            closingLine.setAttribute('y1', lastData.cy);
            closingLine.setAttribute('x2', firstData.cx);
            closingLine.setAttribute('y2', firstData.cy);
            closingLine.classList.add('constellation-line');
            closingLine.style.animationDelay = '1s';
            linesGroup.appendChild(closingLine);
        }
        
        createSparkle(starDataArray.find(s => s.month === currentMonth));
    }
    
    function updateUI() {
        counter.textContent = connectedCount;
        progress.style.width = (connectedCount / 12 * 100) + '%';
    }
    
    function shakeStar(starElement) {
        starElement.style.transition = 'transform 0.1s ease';
        let shakes = 0;
        const shakeInterval = setInterval(() => {
            starElement.style.transform = shakes % 2 === 0 ? 'translateX(-5px)' : 'translateX(5px)';
            shakes++;
            if (shakes > 6) {
                clearInterval(shakeInterval);
                starElement.style.transform = '';
                starElement.style.transition = 'all 0.3s ease';
            }
        }, 50);
    }
    
    function completeConstellation() {
        const svg = document.getElementById('constellation-svg');
        svg.style.animation = 'heartbeat 1.5s ease-in-out 3';
        
        stars.forEach((star, i) => {
            setTimeout(() => {
                star.style.filter = 'drop-shadow(0 0 35px rgba(255,215,0,1))';
                setTimeout(() => { star.style.filter = ''; }, 600);
            }, i * 80);
        });
        
        const instruction = document.querySelector('.instruction-text');
        instruction.textContent = '✨ Наше созвездие ✨';
        instruction.style.color = '#ffd700';
        instruction.style.textShadow = '0 0 40px rgba(255,215,0,0.8)';
        
        setTimeout(() => {
            screens.constellation.classList.remove('active');
            screens.portal.classList.add('active');
            initCountdown();
        }, 2000);
    }
    
    function createSparkle(starData) {
        const svg = document.getElementById('constellation-svg');
        const sparkle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        sparkle.setAttribute('cx', starData.cx);
        sparkle.setAttribute('cy', starData.cy);
        sparkle.setAttribute('r', '4');
        sparkle.setAttribute('fill', '#ffd700');
        sparkle.style.filter = 'drop-shadow(0 0 15px rgba(255,215,0,0.9))';
        sparkle.style.animation = 'sparkleBurst 1s ease forwards';
        svg.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }
    
    highlightNextAvailable();
}

let countdownInterval;
function initCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const messageEl = document.getElementById('daily-message');
    
    const messages = {
        4: '✦ Звёзды выстраиваются в ряд... ✦',
        3: '✦ Магия наполняет пространство... ✦',
        2: '✦ Портал почти готов открыться... ✦',
        1: '✦ Ещё совсем чуть-чуть... ✦',
        0: '✦ Портал открыт! ✦',
    };
    
    if (countdownInterval) clearInterval(countdownInterval);
    
    function update() {
        const now = new Date();
        const diff = CONFIG.anniversary - now;
        
        if (diff <= 0) {
            clearInterval(countdownInterval);
            openPortal();
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
        
        if (messages[days]) messageEl.textContent = messages[days];
    }
    
    update();
    countdownInterval = setInterval(update, 1000);
}

function openPortal() {
    const seal = document.getElementById('portal-seal');
    const gate = document.getElementById('portal-gate');
    
    seal.style.transition = 'all 1s ease';
    seal.style.opacity = '0';
    seal.style.transform = 'scale(1.5)';
    
    setTimeout(() => {
        gate.style.transition = 'all 2s ease';
        gate.style.boxShadow = '0 0 120px rgba(255,215,0,0.4), inset 0 0 80px rgba(255,215,0,0.2)';
        gate.style.borderColor = 'rgba(255,215,0,0.3)';
    }, 800);
    
    setTimeout(() => {
        screens.portal.classList.remove('active');
        screens.memories.classList.add('active');
        initMemories();
    }, 2500);
}

function initMemories() {
    const timelineMoments = document.getElementById('timeline-moments');
    const timelineFill = document.getElementById('timeline-fill');
    
    if (timelineMoments.children.length > 0) return;
    
    CONFIG.memories.forEach((memory, index) => {
        const moment = document.createElement('div');
        moment.className = 'timeline-moment';
        moment.innerHTML = `
            <div class="moment-date">${memory.date}</div>
            <div class="moment-label">★</div>
            <div class="moment-dot"></div>
        `;
        moment.addEventListener('click', () => {
            if (memory.dialog) {
                openDialog(memory.dialog);
            } else {
                highlightMemory(index);
            }
        });
        timelineMoments.appendChild(moment);
    });
    
    setTimeout(() => { timelineFill.style.width = '100%'; }, 500);
    
    const grid = document.getElementById('memories-grid');
    CONFIG.memories.forEach((memory, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.style.animationDelay = (index * 0.1) + 's';
        card.style.animation = 'fadeInUp 0.6s ease forwards';
        card.style.opacity = '0';
        card.innerHTML = `
            <div class="memory-date">${memory.date}</div>
            <div class="memory-text">${memory.text}</div>
        `;
        card.addEventListener('click', () => {
            if (memory.dialog) {
                openDialog(memory.dialog);
            } else {
                highlightMemory(index);
            }
        });
        grid.appendChild(card);
    });
}

function highlightMemory(index) {
    const cards = document.querySelectorAll('.memory-card');
    cards.forEach((card, i) => {
        if (i === index) {
            card.style.transform = 'scale(1.05)';
            card.style.borderColor = 'rgba(255,215,0,0.5)';
            card.style.boxShadow = '0 12px 40px rgba(255,215,0,0.3)';
            setTimeout(() => {
                card.style.transform = '';
                card.style.borderColor = '';
                card.style.boxShadow = '';
            }, 2000);
        }
    });
}


const animStyle = document.createElement('style');
animStyle.textContent = `
    @keyframes sparkleBurst {
        0% { r: 4; opacity: 1; }
        100% { r: 40; opacity: 0; }
    }
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(animStyle);

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initStarBackground();
    initConstellation();
    
    if (new Date() >= CONFIG.anniversary) {
        screens.constellation.classList.remove('active');
        screens.portal.classList.remove('active');
        screens.memories.classList.add('active');
        initMemories();
    }
});