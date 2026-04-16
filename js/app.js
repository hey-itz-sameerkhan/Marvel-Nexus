/* ═══════════════════════════════════════════════
   DEVICE CHECK + AUDIO SYSTEM
═══════════════════════════════════════════════ */
let currentAudio = null;
let currentIndex = null;
let hasUserInteracted = false;
let isPlaying = false;

const isMobile = window.innerWidth <= 768;


/* ═══════════════════════════════════════════════
   HERO DATA
═══════════════════════════════════════════════ */
const heroes = [
  {
    name: "IRON MAN",
    subtitle: "Tony Stark",
    color: "#ff6a00",
    shadow: "rgba(255,106,0,0.55)",
    gradient: "linear-gradient(160deg,#1a0800 0%,#6b2200 55%,#ff6a00 100%)",
    symbol: "⚙",
    imgSrc: "images/ironman.webp",
    audio: "assets/audio/IronMan_bgm.mp3"
  },
  {
    name: "THOR",
    subtitle: "God of Thunder",
    color: "#4a90e2",
    shadow: "rgba(74,144,226,0.55)",
    gradient: "linear-gradient(160deg,#00071a 0%,#003580 55%,#4a90e2 100%)",
    symbol: "⚡",
    imgSrc: "images/thor.webp",
    audio: "assets/audio/Thor_bgm.mp3"
  },
  {
    name: "HULK",
    subtitle: "Bruce Banner",
    color: "#39d353",
    shadow: "rgba(57,211,83,0.55)",
    gradient: "linear-gradient(160deg,#001500 0%,#005020 55%,#39d353 100%)",
    symbol: "☢",
    imgSrc: "images/hulk.webp",
    audio: "assets/audio/Hulk_bgm.mp3"
  },
  {
    name: "BLACK PANTHER",
    subtitle: "T'Challa",
    color: "#a855f7",
    shadow: "rgba(168,85,247,0.55)",
    gradient: "linear-gradient(160deg,#080010 0%,#360060 55%,#a855f7 100%)",
    symbol: "◆",
    imgSrc: "images/blackpanther.webp",
    audio: "assets/audio/BlackPanther_bgm.mp3"
  },
  {
    name: "GHOST RIDER",
    subtitle: "Johnny Blaze",
    color: "#ff4500",
    shadow: "rgba(255,69,0,0.55)",
    gradient: "linear-gradient(160deg,#0d0000 0%,#6b1000 55%,#ff4500 100%)",
    symbol: "🔥",
    imgSrc: "images/ghostrider.webp",
    audio: "assets/audio/GhostRider_bgm.mp3"
  },
  {
    name: "MOON KNIGHT",
    subtitle: "Marc Spector",
    color: "#dce0ff",
    shadow: "rgba(220,224,255,0.55)",
    gradient: "linear-gradient(160deg,#05050f 0%,#161640 55%,#dce0ff 100%)",
    symbol: "☽",
    imgSrc: "images/moonknight.webp",
    audio: "assets/audio/MoonKnight_bgm.mp3"
  }
];


/* ═══════════════════════════════════════════════
   BUILD SLIDES
═══════════════════════════════════════════════ */
const wrapper = document.getElementById("swiperWrapper");

heroes.forEach(hero => {
  const slide = document.createElement("div");
  slide.className = "swiper-slide";

  slide.innerHTML = `
    <div class="card-img-wrap" style="background:${hero.gradient}">
      <img src="${hero.imgSrc}" alt="${hero.name}" />
      <div class="card-symbol" style="color:${hero.color}">
        ${hero.symbol}
      </div>
    </div>
    <div class="card-overlay"></div>
    <div class="card-info">
      <div class="card-name">${hero.name}</div>
      <div class="card-sub">${hero.subtitle}</div>
    </div>
  `;

  wrapper.appendChild(slide);
});


/* ═══════════════════════════════════════════════
   AUDIO FUNCTIONS
═══════════════════════════════════════════════ */
function playMusic(index) {
  const hero = heroes[index];
  if (!hero || !hasUserInteracted) return;

  if (currentAudio && currentIndex === index) {
    currentAudio.play();
    isPlaying = true;
    return;
  }

  if (currentAudio) currentAudio.pause();

  currentAudio = new Audio(hero.audio);
  currentAudio.loop = true;
  currentAudio.volume = 0.8;
  currentAudio.play().catch(() => {});

  currentIndex = index;
  isPlaying = true;
}

function pauseMusic() {
  if (currentAudio) {
    currentAudio.pause();
    isPlaying = false;
  }
}

function stopMusic() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
    currentIndex = null;
    isPlaying = false;
  }
}


/* USER INTERACTION */
document.body.addEventListener("click", () => {
  hasUserInteracted = true;
}, { once: true });


/* ═══════════════════════════════════════════════
   SWIPER
═══════════════════════════════════════════════ */
const swiper = new Swiper("#marvelSwiper", {

  slidesPerView: 3,
  centeredSlides: true,
  spaceBetween: 28,

  effect: "coverflow",
  coverflowEffect: {
    rotate: 35,
    depth: 180,
    slideShadows: true
  },

  loop: true,
  speed: 750,

  autoplay: {
    delay: 4000,
    disableOnInteraction: false
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },

  on: {
    slideChange: function () {
      updateTheme(this.realIndex);
      stopMusic(); // 🔥 important
    }
  }
});


/* ═══════════════════════════════════════════════
   HOVER + NAME ANIMATION (DESKTOP)
═══════════════════════════════════════════════ */
const swiperEl = document.querySelector("#marvelSwiper");
const heroPanel = document.querySelector(".hero-panel");
const heroCenterName = document.getElementById("heroCenterName");

if (!isMobile) {

  swiperEl.addEventListener("mouseover", (e) => {
    const activeSlide = document.querySelector(".swiper-slide-active");

    if (activeSlide && activeSlide.contains(e.target)) {

      swiper.autoplay.stop();

      const hero = heroes[swiper.realIndex];

      // 🎯 NAME SHOW
      heroCenterName.textContent = hero.name;
      heroCenterName.style.color = hero.color;

      heroCenterName.classList.add("active");
      heroPanel.classList.add("hide");

      // 🎧 MUSIC
      playMusic(swiper.realIndex);
    }
  });

  swiperEl.addEventListener("mouseout", (e) => {
    const activeSlide = document.querySelector(".swiper-slide-active");

    if (activeSlide && !activeSlide.contains(e.relatedTarget)) {

      swiper.autoplay.start();

      // ❌ NAME HIDE
      heroCenterName.classList.remove("active");
      heroPanel.classList.remove("hide");

      pauseMusic();
    }
  });

}


/* ═══════════════════════════════════════════════
   MOBILE TAP
═══════════════════════════════════════════════ */
if (isMobile) {

  swiperEl.addEventListener("click", () => {

    if (!hasUserInteracted) return;

    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic(swiper.realIndex);
    }
  });

}


/* ═══════════════════════════════════════════════
   THEME + MOBILE NAME
═══════════════════════════════════════════════ */
function updateTheme(index) {
  const hero = heroes[index];
  if (!hero) return;

  document.documentElement.style.setProperty("--active-color", hero.color);
  document.documentElement.style.setProperty("--glow", hero.shadow);

  const centerName = document.getElementById("heroCenterName");

  // 📱 MOBILE → always visible
  if (centerName && isMobile) {
    centerName.textContent = hero.name;
    centerName.style.color = hero.color;
    centerName.classList.add("active");
  }
}