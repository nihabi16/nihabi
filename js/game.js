/* Catch My Heart — external JS
   Features:
   - maroon/red/black/gold hearts
   - gift-box catcher drawn on canvas
   - score, missed count, overlay messages
   - sparkle effect and floating "+1 Love"
   - background music control
*/

(() => {
  // config
  const canvas = document.getElementById('heartCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const missEl = document.getElementById('missed');
  const overlay = document.getElementById('overlayMessage');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const restartBtn = document.getElementById('restartBtn');
  const musicBtn = document.getElementById('musicBtn');
  const bgMusic = document.getElementById('bgMusic');

  // responsive canvas real pixels
  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const styleWidth = Math.min(420, Math.max(260, Math.floor(window.innerWidth * 0.92)));
    canvas.style.width = styleWidth + 'px';
    const styleHeight = Math.floor(styleWidth * 520 / 360); // maintain approx aspect
    canvas.style.height = styleHeight + 'px';
    canvas.width = styleWidth * ratio;
    canvas.height = styleHeight * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // game state
  let hearts = [];
  let particles = [];
  let floats = [];
  let score = 0;
  let missed = 0;
  let running = false;
  let lastFrame = 0;
  let spawnTimer = 0;
  let spawnInterval = 800; // ms
  const MAX_MISSED = 7;

  // catcher (gift box)
  const catcher = {
    x: 140,
    y: 0, // will be set based on canvas height
    w: 70,
    h: 26,
    vx: 0,
    speed: 6
  };

  // colors palette
  const colors = ['#8b1515', '#b30a0a', '#0b0b0b', '#d4af37']; // maroon, red, black, gold

  // utility
  const rand = (min, max) => Math.random() * (max - min) + min;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // input
  const keys = {};
  window.addEventListener('keydown', e => keys[e.key] = true);
  window.addEventListener('keyup', e => keys[e.key] = false);

  // touch support: left / right tap zones
  canvas.addEventListener('touchstart', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    if (x < rect.width/2) keys['ArrowLeft'] = true;
    else keys['ArrowRight'] = true;
  });
  canvas.addEventListener('touchend', (e) => { keys['ArrowLeft'] = false; keys['ArrowRight'] = false; });

  // spawn heart
  function spawnHeart() {
    const w = clamp(rand(18, 36), 14, 44);
    hearts.push({
      x: rand(12, (canvas.width / (window.devicePixelRatio||1)) - 12 - w),
      y: -20,
      size: w,
      speed: rand(1.4, 3.2),
      color: colors[Math.floor(rand(0, colors.length))],
      wobble: rand(0, Math.PI*2),
      rot: rand(-0.2, 0.2)
    });
  }

  // draw heart using path (scaled)
  function drawHeart(x, y, size, color, alpha=1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, 1);
    ctx.beginPath();
    const s = size/2;
    ctx.moveTo(0, -s/2);
    ctx.bezierCurveTo(-s, -s*1.1, -s*1.2, s*0.6, 0, s);
    ctx.bezierCurveTo(s*1.2, s*0.6, s, -s*1.1, 0, -s/2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // draw catcher (gift box)
  function drawCatcher() {
    const { x, y, w, h } = catcher;
    // box
    ctx.save();
    ctx.fillStyle = '#2b0b0b';
    ctx.fillRect(x, y, w, h);
    // gradient face
    const grad = ctx.createLinearGradient(x, y, x+w, y+h);
    grad.addColorStop(0, '#8b1515');
    grad.addColorStop(1, '#b30a0a');
    ctx.fillStyle = grad;
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
    // ribbon vertical
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(x + w/2 - 6, y + 2, 12, h - 4);
    // ribbon horizontal
    ctx.fillRect(x + 2, y + h/2 - 6, w - 4, 12);
    // bow (simple)
    ctx.beginPath();
    ctx.ellipse(x + w/2 - 12, y + h/2 - 2, 8, 6, -0.6, 0, Math.PI*2);
    ctx.ellipse(x + w/2 + 12, y + h/2 - 2, 8, 6, 0.6, 0, Math.PI*2);
    ctx.fillStyle = '#d4af37';
    ctx.fill();
    ctx.restore();
  }

  // make sparkle particles on catch
  function makeSparkles(x, y, color) {
    for (let i=0;i<14;i++){
      particles.push({
        x, y,
        vx: rand(-2,2),
        vy: rand(-3,1),
        life: rand(500,1000),
        t: 0,
        size: rand(2,5),
        color
      });
    }
    // floating +1 text
    floats.push({ x, y, t:0, text:'+1 Love', life:1200, alpha:1 });
  }

  // update/draw particles
  function updateParticles(delta) {
    for (let i = particles.length-1; i>=0; i--){
      const p = particles[i];
      p.t += delta;
      p.x += p.vx;
      p.y += p.vy + 0.02 * p.t/16;
      p.vy += 0.06 * (delta/16);
      p.life -= delta;
      ctx.save();
      ctx.globalAlpha = clamp(p.life/1000,0,1);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
      if (p.life <= 0) particles.splice(i,1);
    }

    for (let i = floats.length-1; i>=0; i--){
      const f = floats[i];
      f.t += delta;
      f.y -= (delta/1000) * 30;
      f.alpha = clamp(1 - f.t / f.life, 0, 1);
      ctx.save();
      ctx.globalAlpha = f.alpha;
      ctx.fillStyle = '#ffdfe6';
      ctx.font = '16px "Dancing Script", cursive';
      ctx.fillText(f.text, f.x, f.y);
      ctx.restore();
      if (f.t > f.life) floats.splice(i,1);
    }
  }

  // check collision between heart and catcher
  function checkCatch(h) {
    const scale = 1.0;
    const hx = h.x;
    const hy = h.y;
    const hw = h.size;
    const cx = catcher.x;
    const cy = catcher.y;
    const cw = catcher.w;
    const ch = catcher.h;
    // simple box overlap using heart center
    if (hy + h.size * 0.4 >= cy && hy <= cy + ch) {
      if (hx >= cx - hw*0.2 && hx <= cx + cw + hw*0.2) return true;
    }
    return false;
  }

  // screen message
  function showOverlay(text, time=1600) {
    overlay.classList.remove('hidden');
    overlay.innerText = text;
    setTimeout(()=> overlay.classList.add('hidden'), time);
  }

  // main update loop
  function update(now) {
    if (!running) {
      lastFrame = now;
      requestAnimationFrame(update);
      return;
    }
    const delta = Math.min(40, now - lastFrame);
    lastFrame = now;

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // catcher position (bottom)
    const ch = canvas.height / (window.devicePixelRatio||1);
    catcher.y = ch - catcher.h - 14;

    // input movement
    if (keys['ArrowLeft']) catcher.x -= catcher.speed;
    if (keys['ArrowRight']) catcher.x += catcher.speed;
    // mouse movement
    // map pointer if exists
    // clamp
    catcher.x = clamp(catcher.x, 6, (canvas.width/(window.devicePixelRatio||1)) - catcher.w - 6);

    // draw hearts
    spawnTimer += delta;
    if (spawnTimer > spawnInterval) {
      spawnTimer = 0;
      // difficulty: reduce interval with score
      spawnInterval = clamp(800 - Math.floor(score*8), 320, 1000);
      spawnHeart();
    }

    for (let i = hearts.length-1; i>=0; i--) {
      const h = hearts[i];
      h.y += h.speed + Math.sin(h.wobble + now/600) * 0.5;
      h.x += Math.sin((h.y + now/200)/80) * 0.6;
      drawHeart(h.x, h.y, h.size, h.color);

      // if caught
      if (checkCatch(h)) {
        const caughtX = h.x;
        const caughtY = h.y;
        hearts.splice(i,1);
        score++;
        scoreEl.textContent = score;
        makeSparkles(caughtX, caughtY, h.color);
        // show a random love line briefly
        const messages = [
          "You caught my heart, hayati 💞",
          "My heart is yours ❤️",
          "Every catch = one more reason I love you",
          "Perfect catch — that's my Niha 💖",
          "You + me = forever"
        ];
        const msg = messages[Math.floor(rand(0, messages.length))];
        showOverlay(msg, 1200);
      } else if (h.y > (canvas.height/(window.devicePixelRatio||1)) + 40) {
        hearts.splice(i,1);
        missed++;
        missEl.textContent = missed;
        // gentle feedback
        showOverlay("Oh no, you missed one 😢", 900);
        if (missed >= MAX_MISSED) {
          running = false;
          showOverlay("Don't break my heart... Game Over 💔", 2200);
        }
      }
    }

    // draw particles & floats
    updateParticles(delta);

    // draw catcher last
    drawCatcher();

    requestAnimationFrame(update);
  }

  // controls
  function startGame() {
    if (!running) {
      running = true;
      lastFrame = performance.now();
      requestAnimationFrame(update);
    }
  }
  function pauseGame() { running = false; }
  function restartGame() {
    hearts = [];
    particles = [];
    floats = [];
    score = 0;
    missed = 0;
    scoreEl.textContent = score;
    missEl.textContent = missed;
    spawnInterval = 800;
    catcher.x = Math.floor((canvas.width/(window.devicePixelRatio||1) - catcher.w)/2);
    running = true;
    lastFrame = performance.now();
    requestAnimationFrame(update);
  }

  // music toggle
  let musicPlaying = false;
  musicBtn.addEventListener('click', () => {
    if (!musicPlaying) {
      bgMusic.play().catch(()=>{/* autoplay blocked — user must interact */});
      musicPlaying = true;
      musicBtn.textContent = "⏸️";
    } else {
      bgMusic.pause();
      musicPlaying = false;
      musicBtn.textContent = "Play Music";
    }
  });

  // start/pause/restart buttons
  startBtn.addEventListener('click', startGame);
  pauseBtn.addEventListener('click', () => { pauseGame(); showOverlay("Paused",700); });
  restartBtn.addEventListener('click', restartGame);

  // pointer move control
  let activePointer = false;
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    catcher.x = clamp(x - catcher.w/2, 6, rect.width - catcher.w - 6);
  });
  canvas.addEventListener('touchmove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    catcher.x = clamp(x - catcher.w/2, 6, rect.width - catcher.w - 6);
    e.preventDefault();
  }, {passive:false});

  // make sure catcher starts centered
  catcher.x = Math.floor((canvas.width/(window.devicePixelRatio||1) - catcher.w)/2);

  // initial small overlay
  overlay.classList.remove('hidden');
  overlay.innerText = "Tap Start • Use ← → or drag • Play Music";
  setTimeout(()=> overlay.classList.add('hidden'), 1600);

  // expose for debugging
  window.heartGame = {
    startGame, pauseGame, restartGame, spawnHeart
  };
})();
