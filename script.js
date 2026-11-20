// ─── SOUNDS ──────────────────────────────────────────────
const bgMusic     = new Audio('sounds/mikrokosmos.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.7;
const sfxCongrats = new Audio('sounds/congratulations.mp3');
const sfxCheering = new Audio('sounds/cheering.mp3');
const sfxWhoosh   = new Audio('sounds/whoosh.mp3');
const sfxSelect   = new Audio('sounds/select.mp3');
const sfxAlert    = new Audio('sounds/alert.mp3');

// Evita que el navegador restaure el scroll anterior al recargar con F5
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

function enterPage() {
  window.scrollTo(0, 0);
  const overlay = document.getElementById('intro-overlay');
  overlay.classList.add('fade-out');
  setTimeout(() => overlay.remove(), 650);
  setTimeout(() => bgMusic.play().catch(() => {}), 1500);
}

// Cooky asoma desde una esquina aleatoria al hacer hover en el botón de la intro
(function () {
  const btn = document.getElementById('intro-btn');
  const cooky = document.getElementById('cooky-peek');
  if (!btn || !cooky) return;
  const corners = ['corner-tl', 'corner-tr', 'corner-bl', 'corner-br'];
  btn.addEventListener('mouseenter', () => {
    cooky.classList.remove('show', ...corners);
    cooky.classList.add(corners[Math.floor(Math.random() * corners.length)]);
    void cooky.offsetWidth; // reinicia la transición
    cooky.classList.add('show');
    sfxWhoosh.currentTime = 0;
    sfxWhoosh.play().catch(() => {});
  });
  btn.addEventListener('mouseleave', () => cooky.classList.remove('show'));
})();

// Sonido de selección al hacer hover sobre el título "¡Feliz Cumpleaños!" de la intro
(function () {
  const title = document.getElementById('intro-title');
  if (!title) return;
  title.addEventListener('mouseenter', () => {
    sfxSelect.currentTime = 0;
    sfxSelect.play().catch(() => {});
  });
})();

function playCongratsSound() {
    sfxCheering.currentTime = 0;
    sfxCheering.play().catch(() => { });
}

// ─── STARFIELD ───────────────────────────────────────────
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

for (let i = 0; i < 160; i++) {
    stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.8 + 0.3,
        speed: Math.random() * 0.3 + 0.05,
        alpha: Math.random()
    });
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
        s.alpha += (Math.random() - 0.5) * 0.05;
        s.alpha = Math.max(0.1, Math.min(1, s.alpha));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184,75,234,${s.alpha})`;
        ctx.fill();
        s.y += s.speed;
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(drawStars);
}
drawStars();

// ─── CONFETTI ────────────────────────────────────────────
const cc = document.getElementById('confetti-canvas');
const cx = cc.getContext('2d');
cc.width = window.innerWidth;
cc.height = window.innerHeight;
window.addEventListener('resize', () => { cc.width = window.innerWidth; cc.height = window.innerHeight; });

const COLORS = ['#FF87C3', '#FFE066', '#C89BFF', '#8f0cc7', '#FFB3D9', '#FF6B6B'];
let confetti = [];

function spawnConfetti(n = 60) {
    for (let i = 0; i < n; i++) {
        confetti.push({
            x: Math.random() * cc.width,
            y: -10,
            r: Math.random() * 7 + 4,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 1.5,
            rot: Math.random() * 360,
            vrot: (Math.random() - 0.5) * 8,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
            life: 1
        });
    }
}

function drawConfetti() {
    cx.clearRect(0, 0, cc.width, cc.height);
    confetti = confetti.filter(p => p.life > 0);
    confetti.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vrot;
        p.vy += 0.06;
        if (p.y > cc.height) p.life = 0;
        cx.save();
        cx.globalAlpha = p.life;
        cx.fillStyle = p.color;
        cx.translate(p.x, p.y);
        cx.rotate(p.rot * Math.PI / 180);
        if (p.shape === 'rect') {
            cx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        } else {
            cx.beginPath(); cx.arc(0, 0, p.r / 2, 0, Math.PI * 2); cx.fill();
        }
        cx.restore();
    });
    requestAnimationFrame(drawConfetti);
}
drawConfetti();

// Burst on load
spawnConfetti(120);

// ─── FLOATING EMOJIS ─────────────────────────────────────
const floaterEmojis = ['💖', '🎁', '💐', '⭐', '✨', '🌟', '🎊', '🎂', '🎀', '🌸'];
const floaterContainer = document.getElementById('floaters');
const floaterCount = 20;
// Posiciones repartidas en franjas iguales (con variación) para que no se amontonen a un lado
const floaterSlots = Array.from({ length: floaterCount }, (_, i) => i).sort(() => Math.random() - 0.5);
for (let i = 0; i < floaterCount; i++) {
    const el = document.createElement('div');
    el.classList.add('floater');
    el.textContent = floaterEmojis[i % floaterEmojis.length];
    el.style.left = ((floaterSlots[i] + Math.random()) / floaterCount) * 94 + 'vw';
    el.style.animationDuration = (Math.random() * 12 + 8) + 's';
    el.style.animationDelay = (Math.random() * 10) + 's';
    el.style.fontSize = (Math.random() * 1.5 + 1.2) + 'rem';
    floaterContainer.appendChild(el);
}

// ─── ORBITING ICONS ──────────────────────────────────────
const orbitIcons = ['💖', '🎁', '💐', '✨', '⭐', '🎀', '💖', '🎁', '💐', '🌟'];
const orbitContainer = document.getElementById('orbit-container');
const wrapperEl = document.querySelector('.name-wrapper');

function buildOrbit() {
    const w = wrapperEl.offsetWidth;
    const h = wrapperEl.offsetHeight;
    const rx = (w / 2) * 0.9;
    const ry = (h / 2) * 0.9;
    orbitContainer.innerHTML = '';
    orbitIcons.forEach((icon, i) => {
        const el = document.createElement('div');
        el.classList.add('orbit-icon');
        el.textContent = icon;
        const angle = (i / orbitIcons.length) * 360;
        const dur = 10 + (i % 3) * 3;
        const dir = i % 2 === 0 ? 1 : -1;
        el.style.cssText = `
      --start: ${angle}deg;
      --radius: ${Math.max(rx, ry) * 0.8}px;
      animation: orbitAnim ${dur}s linear infinite;
      ${dir < 0 ? 'animation-direction: reverse;' : ''}
    `;
        orbitContainer.appendChild(el);
    });
}
buildOrbit();
window.addEventListener('resize', buildOrbit);

// ─── CLICK PARTICLES ─────────────────────────────────────
document.addEventListener('click', e => {
    for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 10 + 5;
        const tx = (Math.random() - 0.5) * 200;
        const ty = (Math.random() - 0.5) * 200;
        p.style.cssText = `
      left: ${e.clientX}px; top: ${e.clientY}px;
      width: ${size}px; height: ${size}px;
      background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
      --tx: ${tx}px; --ty: ${ty}px;
      animation-duration: ${Math.random() * 0.5 + 0.6}s;
    `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1100);
    }
    spawnConfetti(20);
});

// ─── SURPRISE MESSAGES ───────────────────────────────────
const surpriseText = `🎓 UN MENSAJE DEL PROFE JARED:<br><br>
   "¡Muchas felicidades! Que cumplas muchos años más y que siempre estés rodeada de la gente que te ama.
   ¡Feliz cumpleaños!" 💐`;
let surpriseShown = false;

function showSurprise() {
    if (surpriseShown) return;
    surpriseShown = true;
    sfxAlert.currentTime = 0;
    sfxAlert.play().catch(() => { });
    const msg = document.getElementById('surprise-msg');
    msg.innerHTML = surpriseText;
    msg.classList.add('show');
    spawnConfetti(80);
    setTimeout(() => msg.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);

    // A los 7 segundos aparece la foto de BTS debajo del mensaje
    setTimeout(() => {
        const pic = document.getElementById('surprise-pic');
        pic.classList.add('show');
        spawnConfetti(60);
        setTimeout(() => pic.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }, 7000);
}

// ─── CARTA DE JULI Y MILI ────────────────────────────────
let letterOpened = false;
function openLetter() {
    if (letterOpened) return;
    letterOpened = true;
    sfxAlert.currentTime = 0;
    sfxAlert.play().catch(() => { });
    spawnConfetti(80);
    document.getElementById('envelope').classList.add('hide');
    const letter = document.getElementById('letter');
    // La sección reserva altura para poder hacer scroll hasta la carta antes de que crezca
    letter.parentElement.classList.add('opened');
    letter.classList.add('open');
    // Scroll suave que deja la carta a ~35% desde arriba, sin bajar de más
    setTimeout(() => {
        const top = letter.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35;
        window.scrollTo({ top, behavior: 'smooth' });
    }, 50);

    // Primero la foto de Mili, luego la de Juli y después la razón 1 con el botón
    const photos = letter.querySelectorAll('.letter-photos figure');
    photos.forEach((fig, i) => setTimeout(() => fig.classList.add('show'), 900 + i * 900));
    // Luego el título y, un momento después, cae la razón 1 con el botón justo debajo
    const titleDelay = 900 + photos.length * 900;
    setTimeout(() => letter.querySelector('.letter-title').classList.add('show'), titleDelay);
    setTimeout(() => {
        revealReason();
        document.getElementById('next-reason').classList.add('visible');
    }, titleDelay + 1200);
}

let reasonIndex = 0;
function revealReason() {
    const letter = document.getElementById('letter');
    const reasons = letter.querySelectorAll('.letter-reasons li');
    if (reasonIndex >= reasons.length) return;
    const li = reasons[reasonIndex++];
    li.classList.add('show');
    setTimeout(() => li.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);

    // Al llegar a la razón 10: desaparece el botón y sale la dedicatoria sola
    if (reasonIndex === reasons.length) {
        document.getElementById('next-reason').classList.remove('visible');
        const closing = letter.querySelector('.letter-closing');
        const sign = letter.querySelector('.letter-sign');
        setTimeout(() => closing.classList.add('show'), 1500);
        setTimeout(() => {
            sign.classList.add('show');
            spawnConfetti(120);
        }, 3000);
    }
}

function nextReason() {
    revealReason();
}

// ─── KONAMI CODE EASTER EGG ──────────────────────────────
const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let kIndex = 0;
document.addEventListener('keydown', e => {
    if (e.key === konami[kIndex]) { kIndex++; }
    else { kIndex = 0; }
    if (kIndex === konami.length) {
        kIndex = 0;
        for (let i = 0; i < 5; i++) setTimeout(() => spawnConfetti(100), i * 200);
        alert('🎉 ¡KONAMI CODE! Itzel encontró el Easter Egg secreto. +1000 puntos de brillo. ✨');
    }
});