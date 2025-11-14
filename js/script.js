/* Shared JS for typed text, confetti, songs, poem, slideshow, riddles, simple transitions */

/* ---------- Typed text (welcome) ---------- */
(function(){
  const typedEl = document.getElementById('typed-text');
  const cursor = document.getElementById('cursor');
  const enterBtn = document.getElementById('enterBtn');
  if (!typedEl) return;

  const phrases = ["Welcome, Niha", "You are my light", "I love you"];
  let pIndex = 0, chIndex = 0, forward = true;

  function tick(){
    const current = phrases[pIndex];
    if (forward) {
      chIndex++;
      if (chIndex > current.length) { forward=false; setTimeout(tick, 900); return; }
    } else {
      chIndex--;
      if (chIndex < 0) { forward=true; pIndex=(pIndex+1)%phrases.length; setTimeout(tick, 300); return; }
    }
    typedEl.textContent = current.substring(0,chIndex);
    setTimeout(tick, forward ? 90 : 40);
  }
  tick();

  // Cursor blink
  setInterval(()=> { if(cursor) cursor.style.opacity = (cursor.style.opacity==0 ? 1 : 0); }, 500);

  /*// Enter button behavior + keyboard
  function doEnter(){
    // trigger confetti then navigate to home
    startConfetti(800);
    document.body.classList.add('fade-away');
    setTimeout(()=> window.location.href = 'home.html', 850);
  }
  enterBtn && enterBtn.addEventListener('click', doEnter);
  
  document.addEventListener('keydown', (e)=> { if (e.key === 'Enter') doEnter();});

  */
})();

/* ---------- Confetti (simple particles) ---------- */
function startConfetti(duration = 1000){
  const canvas = document.getElementById('confetti-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const count = Math.floor(window.innerWidth / 15);
  for(let i=0;i<count;i++){
    pieces.push({
      x: Math.random()*canvas.width,
      y: -Math.random()*canvas.height,
      r: Math.random()*6+4,
      dx: (Math.random()-0.5)*4,
      dy: Math.random()*3+2,
      color: (Math.random() > 0.5) ? '#8b1515' : '#f5e9e9'
    });
  }

  let start = null;
  function frame(ts){
    if(!start) start = ts;
    const t = ts - start;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.x += p.dx;
      p.y += p.dy;
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.rect(p.x, p.y, p.r, p.r*0.6);
      ctx.fill();
    });
    if (t < duration) requestAnimationFrame(frame);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  requestAnimationFrame(frame);
}

/* ---------- Song list & Poem data (editable in script if you want) ---------- */
(function(){
  const songs = [
    {title:'ordinary', artist:'Alex Warren', file:'song/ordinary.mp3'},
    {title:'ፖስተኛው', artist:'YEMa', file:'song/ፖስተኛው.mp3'},
    {title:'Qusad Einy', artist:'Amr Diab', file:'song/Qusad Einy.mp3'},
    {title:'Kal Ho Na Ho', artist:'Shah RUkh Khan', file:'song/Kal Ho Na Ho'},
    {title:'ሠበቤ', artist:'ሚካያ በሀይሉ', file:'song/ሠበቤ.mp3'},
    {title:'Espresso', artist:'Sabrina Carpenter', file:'song/Espresso.mp3'},
    {title:'Save You A Seat', artist:'Alex Warren', file:'song/Save You A Seat.mp3'},
    {title:'አያ ጥራኝማ', artist:'ሳምራዊት አዘነ', file:'song/አያ ጥራኝማ.mp3'},
    {title:'የህልም ንግስት', artist:'ብዙአየው ደምሴ ', file:'song/የህልም ንግስት.mp3'},
    {title:'ሮዚና', artist:'ጆኒ ራጋ ft. ልጅ ሚካኤል', file:'song/ሮዚና.mp3'},
    {title:'Tujh Mein Rab Diktha', artist:'Shah Rukh Khan', file:'song/Tujh Mein Rab Dikhta.mp3'},
    {title:'Don‘t give up on me', artist:'Andy Grammer ', file:'song/Don‘t give up on me.mp3'},
  ];

  const poemLines = [
    "****** 🖤🖤🖤 *******",
    "አንዴ ለመጀመሪያ ጊዜ፣,",
    "ሳላስበው ፍቅር በያዘኝ ጊዜ።",
    "ውሳኔ ማነህ? አለኝ፣,",
    "እኔም በተራዬ ማነኝ?",
    "ጥያቄም መሰለኝ፣",
    "ልጅቷን ብታቃት እንዲ ብለህ ባልጠየከኝ፣",
    "አይደለም ለማሰብ ፍቅሯ ስለ ሳበኝ፣",
    "እንደፈሪ ምክኒያት ሊያስደረድረኝ፣",
    "ሆ ሆ! ሰውዬ ተወኝ፣",
    "እሺ ጥቂት ስለሷ በለኝ።",
    "እሷማ እሷ ማለት ለኔ፣",
    "እኔ፣",
    "ጅማሬ፣",
    "ክብሬ፣",
    "ፍቅሬ፣",
    "ያላት ጥልቅ ነገር፣",
    "የአሸን ሚስጥር፣",
    "ድብቅ ምክር፣",
    "ገሀድ ፍቅር፣",
    "የእውነት ክምር።",
    "አንድ ልዩነት፣",
    "ማይለወጥ መዓት፣",
    "እስቲ አስባት፣",
    "አንተ አታቅም እንጂ የምገርም ፍጡር ናት።",
    "አለ ደሞ ሌላ ሙቀት፣",
    "ፍራቻ አላት፣",
    "ልክም ናት፣ እውንውትም አላት።",
    "ምላሿም እንዲህ ነው፣",
    "አክብሬ ስለማይህ ነው።",
    "ፈጣሪ ያክብራት እድሜም ጤናም ይስጣት።",
    "በዝምታ ታፍኜ፣",
    "ራሴን አሳምኜ።",
    "ለመቼ! አሁን ይሁን ብዬ፣",
    "አሚኔን ተቀብዬ።",
    "ማን አባቱ ውሳኔ፣",
    "ይቻት የኔ አለም ከጎኔ።",
  "********🖤🖤🖤**********"

  ];

  /*// populate song page
  const songListEl = document.getElementById('songList');
  if (songListEl) {
    songs.forEach((s,i)=>{
      const item = document.createElement('div');
      item.className = 'song-item';
      item.innerHTML = `
        <div class="song-num">${i+1}</div>
        <div class="song-meta">
          <div class="song-title">${s.title}</div>
          <div class="song-artist">${s.artist}</div>
        </div>
        <button class="play-btn" data-file="${s.file}">Play</button>
      `;
      songListEl.appendChild(item);
    });

    // play button handler (just demo alert if no file)
    songListEl.addEventListener('click', (e)=>{
      const btn = e.target.closest('.play-btn');
      if(!btn) return;
      const file = btn.getAttribute('data-file');
      if(!file) return alert('No audio file attached. Place your mp3 and set its path in the script.');
      // otherwise create audio
      let audio = new Audio(file);
      audio.play();
    });
  }*/

let currentAudio = null;
let currentBtn = null;

// populate song page
const songListEl = document.getElementById('songList');
if (songListEl) {
  songs.forEach((s,i)=>{
    const item = document.createElement('div');
    item.className = 'song-item';
    item.innerHTML = `
      <div class="song-num">${i+1}</div>
      <div class="song-meta">
        <div class="song-title">${s.title}</div>
        <div class="song-artist">${s.artist}</div>
      </div>
      <button class="play-btn" data-file="${s.file}">Play</button>
    `;
    songListEl.appendChild(item);
  });

  // play button handler
  songListEl.addEventListener('click', (e)=>{
    const btn = e.target.closest('.play-btn');
    if(!btn) return;

    const file = btn.getAttribute('data-file');
    if(!file) return alert('No audio file attached. Place your mp3 and set its path in the script.');

    // If clicking the same button that's currently playing → stop
    if(currentAudio && currentBtn === btn) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      btn.textContent = 'Play';
      currentAudio = null;
      currentBtn = null;
      return;
    }

    // Stop previous audio if exists
    if(currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      if(currentBtn) currentBtn.textContent = 'Play';
    }

    // Play new audio
    currentAudio = new Audio(file);
    currentAudio.play();
    btn.textContent = 'Stop';
    currentBtn = btn;

    // Reset button text when song ends naturally
    currentAudio.addEventListener('ended', ()=>{
      btn.textContent = 'Play';
      currentAudio = null;
      currentBtn = null;
    });
  });
}


  // populate poem page
  const poemCard = document.getElementById('poemCard');
  if (poemCard) {
    poemCard.innerHTML = poemLines.map(l => `<p>${l}</p>`).join('');
  }

})();

/* ---------- Riddle reveal ---------- 
document.addEventListener('click', function(e){
  if (e.target && e.target.classList.contains('reveal')) {
    const ans = e.target.nextElementSibling;
    if (!ans) return;
    const showing = ans.style.display === 'block';
    ans.style.display = showing ? 'none' : 'block';
    e.target.textContent = showing ? 'Show answer' : 'Hide answer';
  }
});*/

// Riddle answers
const riddles = [
  { answer: "impasta" },
  { answer: "fsh" },
  { answer: "piano" }
];

const riddleSections = document.querySelectorAll(".riddle");

riddleSections.forEach((riddle, index) => {
  const input = riddle.querySelector(".riddle-input");
  const btn = riddle.querySelector(".check");
  const feedback = riddle.querySelector(".feedback");

  btn.addEventListener("click", () => {
    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = riddles[index].answer.toLowerCase();

    if(userAnswer === correctAnswer) {
      feedback.textContent = "That's correct, Hayati! 💖";
      feedback.style.color = "#ffcccc";
    } else {
      feedback.textContent = "Try again, Beb 😘";
      feedback.style.color = "#ff6666";
    }
  });
 
  // Optional: press Enter to check
  input.addEventListener("keypress", (e) => {
    if(e.key === "Enter") btn.click();
  });
});


/* ---------- Slideshow ---------- */
/*(function(){
  const slidesEl = document.getElementById('slides');
  if (!slidesEl) return;
  const imgs = slidesEl.querySelectorAll('img');
  const dotsEl = document.getElementById('dots');
  let idx = 0;
  const total = imgs.length;

  function buildDots(){
    dotsEl.innerHTML = '';
    for(let i=0;i<total;i++){
      const d = document.createElement('span');
      d.className = 'dot' + (i===0 ? ' active' : '');
      d.addEventListener('click', ()=> goto(i));
      dotsEl.appendChild(d);
    }
  }
  function goto(i){
    idx = (i+total) % total;
    slidesEl.style.transform = `translateX(-${idx*100}%)`;
    Array.from(dotsEl.children).forEach((d,ii)=> d.className = 'dot' + (ii===idx ? ' active' : ''));
  }

  document.getElementById('nextBtn')?.addEventListener('click', ()=> goto(idx+1));
  document.getElementById('prevBtn')?.addEventListener('click', ()=> goto(idx-1));
  buildDots();
  let autoplay = setInterval(()=> goto(idx+1), 4000);
  slidesEl.addEventListener('mouseenter', ()=> clearInterval(autoplay));
  slidesEl.addEventListener('mouseleave', ()=> { autoplay = setInterval(()=> goto(idx+1), 4000); });
})();*/

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('#slides img');
  const dotsContainer = document.getElementById('dots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentIndex = 0;

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    if (index === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  showSlide(currentIndex);
});



/* ---------- Simple page nav highlight (if needed) ---------- */
/*(function(){
  const links = document.querySelectorAll('a.menu-btn, a[href$=".html"]');
  const path = location.pathname.split('/').pop();
  links.forEach(a=>{
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active-link');
  });
})();

// Floating hearts animation
const heartsContainer = document.querySelector(".hearts");

function createHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = "💖";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = (Math.random() * 20 + 20) + "px";
  heartsContainer.appendChild(heart);

  // remove after animation
  setTimeout(() => {
    heart.remove();
  }, 4000);
}

// generate hearts continuously
setInterval(createHeart, 400);

const videos = document.querySelectorAll('video');
videos.forEach(video => {
  video.addEventListener('play', () => {
    videos.forEach(v => {
      if(v !== video) v.pause();
    });
  });
});




const canvas = document.getElementById("heartGame");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

let score = 0;
let hearts = [];
let catcher = { x: 180, y: 550, width: 40, height: 20, speed: 25 };
let gameInterval;

function createHeart() {
  hearts.push({
    x: Math.random() * (canvas.width - 20),
    y: 0,
    size: 20 + Math.random() * 10,
    speed: 2 + Math.random() * 2,
  });
}

function drawHeart(x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  ctx.fillStyle = "red";
  ctx.fill();
}

function drawCatcher() {
  ctx.fillStyle = "#ffb6c1";
  ctx.fillRect(catcher.x, catcher.y, catcher.width, catcher.height);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  hearts.forEach((heart, i) => {
    heart.y += heart.speed;
    drawHeart(heart.x, heart.y, heart.size);

    if (
      heart.y + heart.size > catcher.y &&
      heart.x > catcher.x &&
      heart.x < catcher.x + catcher.width
    ) {
      hearts.splice(i, 1);
      score++;
      scoreEl.textContent = score;
    }

    if (heart.y > canvas.height) {
      hearts.splice(i, 1);
    }
  });

  drawCatcher();
}

function gameLoop() {
  update();
  if (Math.random() < 0.03) createHeart();
}

function startGame() {
  score = 0;
  scoreEl.textContent = score;
  hearts = [];
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 30);
}

restartBtn.addEventListener("click", startGame);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && catcher.x > 0) catcher.x -= catcher.speed;
  if (e.key === "ArrowRight" && catcher.x < canvas.width - catcher.width)
    catcher.x += catcher.speed;
});

startGame();

const video = document.querySelectorAll('video');
videos.forEach(video => {
  video.preload = "metadata"; // only load metadata initially
  video.addEventListener('play', () => {
    videos.forEach(v => {
      if (v !== video) v.pause();
    });
  });
});
*/

/*document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("enterBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      const input = document.getElementById("magicWord").value.trim().toLowerCase();
      const message = document.getElementById("message");

      if (input === "nihabi") { // <-- your magic word here
        message.textContent = "Welcome, my love 💖";
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1000);
      } else {
        message.textContent = "Try again, hayati 😘";
      }
    });
  }
});*/




/*document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('magicWord');
  const button = document.getElementById('enterBtn');
  const msg = document.getElementById('errorMsg');

  function checkWord() {
    const val = input.value.trim().toLowerCase();
    if (val === 'nihabi') {
      msg.style.color = 'lightgreen';
      msg.textContent = 'Yes';
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 700);
    } else {
      msg.style.color = 'pink';
      msg.textContent = 'Try again';
      input.classList.add('shake');
      input.value = '';
      setTimeout(() => input.classList.remove('shake'), 300);
    }
  }

  button.addEventListener('click', checkWord);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkWord();
  });
});*/
 

// get the button

