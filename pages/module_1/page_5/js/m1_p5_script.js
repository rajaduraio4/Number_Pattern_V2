// ---------- setting start ---------------
var _preloadData, _pageData;
var _pagePreloadArray = {
  image: 1,
  audio: -1,
  video: 1,
  data: -1,
}; // item not availble please assign value 1.
var jsonSRC = "pages/module_1/page_5/data/m1_p5_data.json?v=";
_pageAudioSync = true;
_forceNavigation = false;
_audioRequired = true;
_videoRequired = false;
storeCurrentAudioTime = 0;
_popupAudio = false;
_reloadRequired = true;
_globalCicked = 0;
_currentAudio = null;
_isPlayed = false;
_checkAudioFlag = false;
_tweenTimeline = null;
_popTweenTimeline = null;
var lastPatternId = null;
var _isSimulationPaused = false;
var gameStarted = false;

var _audioIndex = 0;
_videoId = null;
_audioId = null;
// ---------- setting end ---------------
var sectionCnt = 0;
var totalSection = 0;
var prevSectionCnt = -1;
var sectionTopPos = [];
var playMainAudio = false;
// ------------------ common function start ------------------------------------------------------------------------
$(document).ready(function () {
  //console.log('Page ready')
  _preloadData = new PagePreload();
  _preloadData.initObj(_pagePreloadArray, jsonSRC);
  _preloadData.addCustomEvent("ready", _pageLoaded);
  //console.log('Page ready 1', _preloadData)
});

function _pageLoaded() {
  //console.log('_pageLoaded')
  _pageData = _preloadData.jsonData;
  if (_audioRequired) {
    _audioId = _pageData.mainAudio.audioSRC;
    _audioIndex = _pageData.mainAudio.audioIndex;
  }

  if (_videoRequired) _videoId = "courseVideo";

  //addSlideData();
  // console.log(_pageData.sections, _pageData.sections[0].backBtnSrc, "pageDAtat")
  addSectionData();
  // console.log(_controller._globalMusicPlaying, "asldkfjasldkj")
  // if (_controller._globalMusicPlaying) {
  //   $(".music").addClass("playing")
  // } else {
  //   $(".music").addClass("mute")
  // }
  $(".playPause").show();
  appState.pageCount = _controller.pageCnt - 1;
  $('.introInfo').attr('data-popup', 'introPopup-10');
  $("#f_header").css({ backgroundImage: `url(${_pageData.sections[0].headerImg})` });
  $("#f_header").find("#f_courseTitle").css({ backgroundImage: `url(${_pageData.sections[0].headerText})` });
  $(".home_btn").css({ backgroundImage: `url(${_pageData.sections[0].backBtnSrc})` });
  $(".home_btn").attr("data-tooltip", "Back");
  // playBtnSounds(_pageData.sections[sectionCnt - 1].endAudio);
  //   showEndAnimations();
  // checkGlobalAudio();
  assignAudio(
    _audioId,
    _audioIndex,
    _pageAudioSync,
    _forceNavigation,
    _videoId,
    _popupAudio,
    _reloadRequired
  );
  pagePreLoad();
}

// ------------------ common function end ------------------------------------------------------------------------

// -------- adding slide data ------------
function addSectionData() {
  totalSection = _pageData.sections.length;
  for (let n = 0; n < _pageData.sections.length; n++) {
    sectionCnt = n + 1;
    if (sectionCnt == 1) {

      playBtnSounds(_pageData.sections[sectionCnt - 1].content.replayAudios[0], function () {
        $("#wrapTextaudio_0").addClass("paused");
        $("#wrapTextaudio_1").addClass("playing");
        // This runs when Audio 1 ends
        $('.inst p:first-child').hide();
        $('p:nth-child(2)').show();

        playBtnSounds(_pageData.sections[sectionCnt - 1].content.replayAudios[1], function () {
          // This runs when Audio 2 ends
          gameStarted = true;
          resetSimulationAudio();
          $(".wrapTextaudio").removeClass("playing").addClass("paused")
          // $(".wrapTextaudio").addClass("paused");
          window.enableCaterpillarMovement();
        });

        // playBtnSounds(_pageData.sections[sectionCnt - 1].content.replayAudios[1], function () {
        //   // This runs when Audio 2 ends
        //   // gameStarted = true;
        //   // resetSimulationAudio();

        //   $('p:nth-child(2)').hide();
        //   $('p:nth-child(3)').show();
        //   $("#wrapTextaudio_1").addClass("paused");
        //   $("#wrapTextaudio_2").addClass("playing");
        //   // $(".wrapTextaudio").addClass("paused");
        //   // window.enableCaterpillarMovement();
        // });

      });

      let instText = '';
      for (let k = 0; k < _pageData.sections[sectionCnt - 1].iText.length; k++) {
        instText += `<p tabindex="0" id="inst_${k + 1}" aria-label="${removeTags(_pageData.sections[sectionCnt - 1].iText[k])}">${_pageData.sections[sectionCnt - 1].iText[k]} <button class="wrapTextaudio playing" id="wrapTextaudio_${k}" onClick="replayLastAudio(this)"></button></p>`
      }
      $("#section-" + sectionCnt)
        .find(".content-holder")
        .find(".col-left")
        .find(".content")
        .find(".content-bg")
        .find(".content-style")
        .append(
          '<div class="inst">' + instText + '</div>'
        );

      const numberObjects =
        _pageData.sections[sectionCnt - 1].content.numberObjects;

      let headerConent = "";
      let popupDiv = "";

      headerConent += `<div class="confetti"></div>`;

      popupDiv += '<div class="popup">';
      popupDiv += '<div class="popup-wrap">';
      popupDiv += '<div class="popBtns">';
      popupDiv += '<button id="refresh" data-tooltip="Replay"></button>';
      popupDiv += '<button id="homeBack" data-tooltip="Back"></button>';
      popupDiv += "</div>";
      popupDiv += "</div>";
      popupDiv += "</div>";

      popupDiv += '<div class="greetingsPop">';
      popupDiv += '<div class="popup-wrap">';
      popupDiv += "</div>";
      popupDiv += "</div>";

      // ⭐ FIXED: Removed extra 'popupDiv +=' here
      popupDiv += `<div id="introPopup-10"><div class="popup-content">
      <button class="introPopAudio mute" onclick="togglePopAudio(this, '${_pageData.sections[sectionCnt - 1].infoAudio}')"></button>
      <button class="introPopclose" data-tooltip="Close" onClick="closeIntroPop('introPopup-10')"></button>
      <img src="${_pageData.sections[sectionCnt - 1].infoImg}" alt="">
      </div>
      </div>`;

      popupDiv += `<div id="home-popup" class="popup-home" role="dialog" aria-label="Exit confirmation" aria-hidden="false">
    <div class="popup-content modal-box">
      <h2 class="modal-title">Oops!</h2>
      <div class="modal-message">
        <p>If you leave the number pattern simulation then you have to start from beginning.</p>     
        <p class="modal-question">Are you sure you want to leave?</p>   
      </div>      
      <div class="modal-buttons">
        <button id="stay-btn" class="modal-btn" onClick="stayPage()">Stay</button>
        <button id="leave-btn" class="modal-btn" onClick="leavePage()">Leave</button>
      </div>
    </div>
  </div>`;

      $("#section-" + sectionCnt)
        .find(".content-holder")
        .find(".col-left")
        .find(".content")
        .find(".content-bg")
        .find(".content-style")
        .append(
          popupDiv +
          headerConent +
          '<div class="body"><div class="animations"></div><div class="animat-container"> <div class="dummy-patch"></div></div> </div>'
        );

      const mountEl = $("#section-" + sectionCnt)
        .find(".content-holder")
        .find(".col-left")
        .find(".content")
        .find(".content-bg")
        .find(".content-style")
        .find(".body")
        .find(".animat-container")[0];

      initSnakeGameAtMount(mountEl);

      $("#refresh").on("click", function () {
        jumtoPage(_controller.pageCnt);
        console.log("working");
        // initCaterpillarGame();
      });

      $("#homeBack").on("click", function () {
        playClickThen();
        $(".playPause").hide();

        setPopupOpenState(true);

        // ✅ Stop idle timer on leave
        if (typeof window.caterpillarIdleStop === 'function') {
          window.caterpillarIdleStop();
        }

        var audio = document.getElementById("simulationAudio");
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }

        if (typeof isManuallyPaused !== 'undefined') {
          isManuallyPaused = false;
        }
        if (typeof simulationWasPlaying !== 'undefined') {
          simulationWasPlaying = false;
        }
        jumtoPage(2)

      });

      // $(".flipTextAudio").on("click", replayLastAudio);
    }
  }
  // var courseAudio = document.getElementById("courseAudio")
  // $(courseAudio).off("ended")
  // $(courseAudio).on("ended", function () {
  //   // resetSimulationAudio();
  //   // $(".wrapTextaudio").addClass("paused");
  //   // window.enableCaterpillarMovement();
  // })
}


function initSnakeGameAtMount(mountEl) {
  if (!mountEl || !mountEl.appendChild) {
    throw new Error("Invalid mount element");
  }

  const originalBody = document.body;

  try {
    Object.defineProperty(document, "body", {
      value: mountEl,
      configurable: true
    });

    // 🔽 this runs your existing game code
    initCaterpillarGame();

  } finally {
    Object.defineProperty(document, "body", {
      value: originalBody,
      configurable: true
    });
  }
}


function initCaterpillarGame() {

  const BOARD_PADDING = 20; // space around grid (important)
  const MAX_TILE_SIZE = 60;
  /* =========================
     DOM CREATION
  ========================= */
  function createElement(tag, className, parent) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (parent) parent.appendChild(el);
    return el;
  }

  let numberSequence = [];
  const app = createElement("div", "game-container", document.body);
  const gameWrapper = createElement("div", "game-wrapper", app);
  const canvas = createElement("canvas", null, gameWrapper);
  const ctx = canvas.getContext("2d");

  // ✅ Enable high-quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.webkitImageSmoothingEnabled = true;
  ctx.mozImageSmoothingEnabled = true;
  ctx.msImageSmoothingEnabled = true;

  // Visual Configuration
  let headScale = 1;
  let eatingAnimation = null;

  // ✅ Wrong food animation state
  let wrongFoodAnimation = null;
  let wrongFoodData = null;

  // ✅ Food animation control
  let foodAnimationEnabled = true;

  /* =========================
     GAME CONFIG & STATE
  ========================= */
  let shouldDrawVictoryLine = false;
  const BASE_TILE_COUNT = 10;
  let tileCountX = 10;
  let tileCountY = 10;
  let tileSize = 0;
  let particles = [];
  let dpr = 1;

  // Idle System
  let idleTimer = null;
  let isIdle = false;
  const IDLE_DURATION = 5000;
  let idleAudioInstance = null;

  // Offsets
  let gridOffsetX = 0;
  let gridOffsetY = 0;

  const PATTERNS = [
    { start: 1, end: 10 },
    { start: 11, end: 20 }
  ];

  let currentPattern;
  let nextValue;
  let foods = [];

  // Snake Data
  let snake = [];
  let prevSnake = [];

  // State Flags
  let isGameActive = false;
  let isGameEnded = false;
  let foodsSpawned = false;
  let victoryTriggered = false;

  const MOVE_DURATION = 250;
  let moveStartTime = 0;
  let isMoving = false;
  let pendingMove = null;

  // ✅ FIX: Track current audio src being played so stayPage can resume it
  let currentAudioSrc = null;
  let currentAudioTime = 0;

  /* =========================
     CONTROLS DOM
  ========================= */
  const mount = document.body;
  const outerContainer = createElement("div", "outer-container", mount);
  const controls = createElement("div", "controls", outerContainer);

  function createButton(dir, parent = controls) {
    const btn = createElement("button", null, parent);
    btn.dataset.dir = dir;
    const img = document.createElement("img");
    img.src = `pages/module_1/page_5/images/${dir}.png`;
    img.style.height = "auto";
    btn.appendChild(img);
    return btn;
  }

  createButton("up");
  const mid = createElement("div", "middle", controls);
  createButton("left", mid);
  createButton("right", mid);
  createButton("down");

  /* =========================
     AUDIO HANDLERS
  ========================= */
  function playIdleSoundNow() {
    if (!isIdle || !isGameActive || isGameEnded) return;

    if (idleAudioInstance) {
      idleAudioInstance.pause();
      idleAudioInstance.currentTime = 0;
      idleAudioInstance = null;
    }

    const audioPath = _pageData.sections[sectionCnt - 1].idleAudio;
    idleAudioInstance = new Audio(audioPath);

    idleAudioInstance.onended = () => {
      idleAudioInstance = null;

      // ✅ Only continue loop if still idle
      if (!isIdle || !isGameActive || isGameEnded) return;

      // ✅ Wait 5 seconds after audio ends, then play again
      if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = null;
      }

      idleTimer = setTimeout(() => {
        if (isIdle && isGameActive && !isGameEnded) {
          playIdleSoundNow(); // Play audio again
        }
      }, 5000); // 5 second delay before next play
    };

    idleAudioInstance.play().catch(e => console.log("Idle audio error:", e));
  }

  function stopIdleSoundNow() {
    if (idleAudioInstance) {
      idleAudioInstance.pause();
      idleAudioInstance.currentTime = 0;
      idleAudioInstance = null;
    }
  }

  /* =========================
     PARTICLES
  ========================= */
  function createParticles(x, y, color) {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const speed = Math.random() * 5 + 2;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0, color: color
      });
    }
  }

  function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
      if (p.life <= 0) {
        particles.splice(i, 1);
      } else {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, tileSize * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }
  }

  /* =========================
     CANVAS HELPERS
  ========================= */
  function resizeCanvas() {

    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const rect = gameWrapper.getBoundingClientRect();

    if (!rect.width || !rect.height) {
      requestAnimationFrame(resizeCanvas);
      return;
    }

    dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const logicalWidth = rect.width;
    const logicalHeight = rect.height;

    tileCountX = 28;
    tileCountY = 14;

    const padding = 30;

    const availableWidth = logicalWidth - padding * 2;
    const availableHeight = logicalHeight - padding * 2;

    const sizeX = availableWidth / tileCountX;
    const sizeY = availableHeight / tileCountY;

    tileSize = Math.min(sizeX, sizeY);

    const usedWidth = tileCountX * tileSize;
    const usedHeight = tileCountY * tileSize;

    gridOffsetX = (logicalWidth - usedWidth) / 2;
    gridOffsetY = (logicalHeight - usedHeight) / 2;

    render();
  }

  function clearCanvas() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  function drawGrid() {
    ctx.save();
    ctx.fillStyle = "#b0b0b0";
    const radius = 3;
    for (let y = 0; y < tileCountY; y++) {
      for (let x = 0; x < tileCountX; x++) {
        const cx = gridOffsetX + x * tileSize;
        const cy = gridOffsetY + y * tileSize;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawText(text, x, y, scale = 1) {
    ctx.save();
    const fontSize = tileSize * 0.5 * scale;
    ctx.font = `Normal ${fontSize}px Alphakind`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "#ffffff00";
    ctx.lineWidth = Math.max(6, fontSize * 0.2);
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = "#000000";
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /* =========================
     ASSETS & RENDERING
  ========================= */
  const headImg = new Image();
  headImg.src = "pages/module_1/page_5/images/head.png";
  const bodyImg = new Image();
  bodyImg.src = "pages/module_1/page_5/images/body.png";

  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function drawSnake() {
    let t = 1;
    if (isMoving && !isGameEnded) {
      const elapsed = performance.now() - moveStartTime;
      let rawT = Math.min(1, elapsed / MOVE_DURATION);
      t = easeInOutCubic(rawT);
    }

    const baseBodySize = tileSize * 1.0;

    for (let i = snake.length - 1; i >= 0; i--) {
      const curr = snake[i];
      const prev = (prevSnake[i]) ? prevSnake[i] : curr;

      const animX = lerp(prev.x, curr.x, t);
      const animY = lerp(prev.y, curr.y, t);

      let x = gridOffsetX + (animX * tileSize) + tileSize / 2;
      let y = gridOffsetY + (animY * tileSize) + tileSize / 2;

      const cx = x;
      const cy = y;

      if (i === 0) {
        ctx.save();
        ctx.translate(cx, cy);

        let offsetX = 0;
        let offsetY = 0;
        let lookDirX = 1;

        if (snake.length > 1) {
          const next = snake[1];
          const dx = curr.x - next.x;
          const dy = curr.y - next.y;

          const overlapAmount = tileSize * 0.15;
          offsetX = -dx * overlapAmount;
          offsetY = -dy * overlapAmount;

          if (dx < 0) lookDirX = -1;
        }

        if (lookDirX === -1) ctx.scale(-1, 1);

        let currentScale = headScale;
        if (isIdle && !eatingAnimation && !isMoving) {
          currentScale = Math.sin(Date.now() / 300) * 0.1 + 1.1;
        }

        const scaledHeadSize = tileSize * 1.25 * currentScale;
        const verticalAdjust = -tileSize * 0.15;
        ctx.drawImage(headImg, (-scaledHeadSize / 2) + offsetX * (lookDirX === -1 ? -1 : 1), (-scaledHeadSize / 2) + offsetY + verticalAdjust, scaledHeadSize, scaledHeadSize);
        ctx.restore();
      } else {
        const currentSegmentScale = 1;
        const drawnSize = baseBodySize * currentSegmentScale;
        ctx.drawImage(bodyImg, cx - drawnSize / 2, cy - drawnSize / 2, drawnSize, drawnSize);

        if (numberSequence[i - 1] != null) {
          drawText(numberSequence[i - 1], cx, cy, currentSegmentScale);
        }
      }
    }
  }

  function drawFood() {
    if (isGameEnded) return;

    const polygon = getPolygonPoints();
    const now = Date.now();

    foods.forEach(f => {
      if (f.eaten) return;

      const cx = gridOffsetX + f.x * tileSize + tileSize / 2;
      const cy = gridOffsetY + f.y * tileSize + tileSize / 2;

      if (!isPointInPolygon(cx, cy, polygon)) return;

      const age = now - f.spawnTime;
      let scale = 1;

      if (foodAnimationEnabled) {
        if (age < 400) {
          const t = age / 400;
          scale = Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1 + 1;
          if (scale > 1) scale = 1;
          if (age < 50) scale = 0;
        } else {
          scale = 1 + 0.05 * Math.sin(now / 300);
        }
      }

      const radius = tileSize * 0.45 * scale;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0, radius), 0, Math.PI * 2);
      ctx.fillStyle = "#ffd17c";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#c08737";
      ctx.stroke();

      if (scale > 0.5) {
        ctx.fillStyle = "#000";
        ctx.font = `Normal ${tileSize * 0.45 * scale}px Alphakind`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(f.value, cx, cy);
      }
    });

    // Wrong food animation
    if (wrongFoodData && wrongFoodAnimation) {
      const now = performance.now();
      const elapsed = now - wrongFoodAnimation.startTime;
      const progress = Math.min(elapsed / wrongFoodAnimation.duration, 1);

      let offsetX = 0;
      let offsetY = 0;
      let alpha = 1;

      if (progress < 0.3) {
        const shakeProgress = progress / 0.3;
        const shakeIntensity = tileSize * 0.15 * (1 - shakeProgress);
        offsetX = Math.sin(shakeProgress * Math.PI * 8) * shakeIntensity;
        offsetY = Math.cos(shakeProgress * Math.PI * 8) * shakeIntensity * 0.5;
      } else {
        const moveProgress = (progress - 0.3) / 0.7;
        const easeOut = 1 - Math.pow(1 - moveProgress, 3);
        offsetX = wrongFoodAnimation.dirX * tileSize * 3 * easeOut;
        offsetY = wrongFoodAnimation.dirY * tileSize * 3 * easeOut;
        alpha = 1 - moveProgress;
      }

      const cx = gridOffsetX + wrongFoodData.x * tileSize + tileSize / 2 + offsetX;
      const cy = gridOffsetY + wrongFoodData.y * tileSize + tileSize / 2 + offsetY;

      ctx.save();
      ctx.globalAlpha = alpha;

      const radius = tileSize * 0.45;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0, radius), 0, Math.PI * 2);
      ctx.fillStyle = "#ffd17c";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#c08737";
      ctx.stroke();

      ctx.fillStyle = "#000";
      ctx.font = `Normal ${tileSize * 0.45}px Alphakind`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(wrongFoodData.value, cx, cy);

      ctx.restore();

      if (progress >= 1) {
        wrongFoodAnimation = null;
        wrongFoodData = null;
      } else {
        requestAnimationFrame(render);
      }
    }
  }

  /* =========================
     MAIN RENDER LOOP
  ========================= */
  function gameLoop() {
    render();

    if (isMoving && performance.now() - moveStartTime >= MOVE_DURATION) {
      isMoving = false;

      if (pendingMove) {
        const move = pendingMove;
        pendingMove = null;
        executeMove(move);
      }
    }

    requestAnimationFrame(gameLoop);
  }

  function executeMove(dir) {
    if (!isGameActive || isGameEnded || isMoving) return;

    const head = snake[0];
    const newX = head.x + dir.x;
    const newY = head.y + dir.y;

    if (!canMoveToTile(newX, newY)) return;
    if (
      newX < 0 ||
      newY < 0 ||
      newX >= tileCountX - 1 ||
      newY >= tileCountY - 1
    ) return;

    const newHead = { x: newX, y: newY };

    if (snake.some((s, index) => index !== 0 && s.x === newHead.x && s.y === newHead.y)) return;

    const hitFood = foods.find(f => f.x === newHead.x && f.y === newHead.y);

    prevSnake = snake.map(s => ({ ...s }));
    snake.unshift(newHead);
    isMoving = true;
    moveStartTime = performance.now();

    if (hitFood && hitFood.correct) {
      hitFood.eaten = true;
      foods = [];
      foodsSpawned = false;

      const cx = gridOffsetX + hitFood.x * tileSize + tileSize / 2;
      const cy = gridOffsetY + hitFood.y * tileSize + tileSize / 2;
      createParticles(cx, cy, "#FFD700");
      animateEating();

      numberSequence.push(nextValue);
      nextValue++;

      // ✅ Disable controls and stop idle while correct audio plays
      isGameActive = false;
      idleStopTimer();

      $(".wrapTextaudio").each(function () {
        if ($(this).hasClass("playing")) {
          $(this).removeClass("playing").addClass("paused");
        }
      });

      updateText(
        _pageData.sections[sectionCnt - 1].content.correctFeedback.text,
        _pageData.sections[sectionCnt - 1].content.correctFeedback.audioSrc
      );
      playBtnSounds(_pageData.sections[sectionCnt - 1].correctAudio);

      if (nextValue > currentPattern.end) {
        // ✅ Pattern complete — victory flow
        if (victoryTriggered) return;
        victoryTriggered = true;

        isGameActive = false;
        isGameEnded = true;

        let finalSequenceCompleted = false;

        // Wait for correctAudio to finish, then start victory
        audioEnd(function () {
          shouldDrawVictoryLine = true;

          isMoving = false;
          pendingMove = null;

          $(".animations").addClass("show");

          setTimeout(function () {
            $(".animations").removeClass("show");
          }, 2500);

          playBtnSounds(_pageData.sections[sectionCnt - 1].greatJobAudio);
          playVictorySequence();

          audioEnd(function () {
            if (finalSequenceCompleted) return;
            finalSequenceCompleted = true;

            if (typeof showEndAnimations === 'function') {
              showEndAnimations();
            }
          });
        });
        return;
      }

      // ✅ correctAudio ends → enable controls + spawn food immediately
      audioEnd(function () {
        inCorrectFood();       // spawn food right away
        isGameActive = true;   // enable controls right away

        // then play idleAudio
        updateText(
          _pageData.sections[sectionCnt - 1].idleText,
          _pageData.sections[sectionCnt - 1].idleAudio
        );
        playBtnSounds(_pageData.sections[sectionCnt - 1].idleAudio);

        // ✅ ONLY after idleAudio ends → start idle countdown
        audioEnd(function () {
          idleStartTimer();
        });
      });

    } else if (hitFood && !hitFood.correct) {
      // ✅ Wrong food hit — revert move immediately
      snake.shift();
      snake = prevSnake;
      isMoving = false;

      wrongFoodData = { ...hitFood };

      const foodDx = hitFood.x - head.x;
      const foodDy = hitFood.y - head.y;
      const magnitude = Math.sqrt(foodDx * foodDx + foodDy * foodDy) || 1;

      wrongFoodAnimation = {
        startTime: performance.now(),
        duration: 800,
        dirX: foodDx / magnitude,
        dirY: foodDy / magnitude
      };

      foods = foods.filter(f => f !== hitFood);

      $(".wrapTextaudio").each(function () {
        if ($(this).hasClass("playing")) {
          $(this).removeClass("playing").addClass("paused");
        }
      });

      // ✅ Disable controls and stop idle while wrong audio plays
      isGameActive = false;
      idleStopTimer();

      updateText(
        _pageData.sections[sectionCnt - 1].content.wrongFeedback.text,
        _pageData.sections[sectionCnt - 1].content.wrongFeedback.audioSrc
      );
      playBtnSounds(_pageData.sections[sectionCnt - 1].wrongAudio);

      requestAnimationFrame(render);

      // ✅ wrongAudio ends → enable controls + spawn food immediately
      audioEnd(function () {
        inCorrectFood();       // spawn food right away
        isGameActive = true;   // enable controls right away

        // then play idleAudio
        updateText(
          _pageData.sections[sectionCnt - 1].idleText,
          _pageData.sections[sectionCnt - 1].idleAudio
        );
        playBtnSounds(_pageData.sections[sectionCnt - 1].idleAudio);

        // ✅ ONLY after idleAudio ends → start idle countdown
        audioEnd(function () {
          idleStartTimer();
        });
      });

    } else {
      snake.pop();
    }
  }


  function render() {
    clearCanvas();

    const rect = gameWrapper.getBoundingClientRect();
    const polygon = getPolygonPoints(rect.width, rect.height);

    ctx.save();

    drawGrid();
    drawFood();
    drawParticles();

    if (isGameEnded && shouldDrawVictoryLine) {
      drawEndGameVictoryLine();
    } else {
      drawSnake();
    }

    ctx.restore();
  }


  /* =========================
     VICTORY TIMESTAMPS
  ========================= */
  const VICTORY_TIMESTAMPS = {
    pattern1: [
      2.0,  // 1
      3.0,  // 2
      4.0,  // 3
      5.5,  // 4
      6.5,  // 5
      8.0,  // 6
      9.0,  // 7
      10.0, // 8
      11.0, // 9
      12.0, // 10
      13.0  // final text
    ],
    pattern2: [
      2.0,  // 11
      3.0,  // 12
      4.0,  // 13
      5.5,  // 14
      7.0,  // 15
      8.5, // 16
      10.0, // 17
      11.5, // 18
      13.0, // 19
      14.0, // 20
      15.0  // final text
    ]
  };

  const NUMBER_WORDS = {
    1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five",
    6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten",
    11: "Eleven", 12: "Twelve", 13: "Thirteen", 14: "Fourteen", 15: "Fifteen",
    16: "Sixteen", 17: "Seventeen", 18: "Eighteen", 19: "Nineteen", 20: "Twenty"
  };

  /* =========================
     VICTORY SEQUENCE STATE
  ========================= */
  let victorySequenceIndex = -1;
  let victoryZoomStart = 0;
  let victoryTimeouts = [];
  let victoryPaused = false;
  let victoryPauseTime = 0;
  let victoryStartTime = 0;
  let victoryRemainingItems = [];
  const VICTORY_ZOOM_DURATION = 600;

  function drawEndGameVictoryLine() {
    const rect = gameWrapper.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const now = performance.now();

    const startNum = currentPattern.start;
    const endNum = currentPattern.end;

    const displayNumbers = [];
    for (let i = endNum; i >= startNum; i--) {
      displayNumbers.push(i);
    }

    const totalItems = displayNumbers.length + 1;
    const totalWidth = totalItems * tileSize;
    const startX = cx - (totalWidth / 2) + (tileSize / 2);

    for (let i = 0; i < totalItems; i++) {
      const px = startX + (i * tileSize);
      const py = cy;
      const isHead = (i === totalItems - 1);

      let zoomScale = 1;

      if (!isHead && victorySequenceIndex >= 0 && victorySequenceIndex !== 9999) {
        const thisNumber = displayNumbers[i];
        const activeNumber = startNum + victorySequenceIndex;
        if (thisNumber === activeNumber) {
          const elapsed = now - victoryZoomStart;
          const t = Math.min(elapsed / VICTORY_ZOOM_DURATION, 1);
          zoomScale = 1 + 0.6 * Math.sin(t * Math.PI);

          if (elapsed < VICTORY_ZOOM_DURATION) {
            requestAnimationFrame(render);
          }
        }
      }

      if (isHead) {
        const size = tileSize * 1.5;
        const headOffsetY = tileSize * 0.3;
        ctx.drawImage(headImg, px - size / 2, py - size / 2 - headOffsetY, size, size);
      } else {
        const size = tileSize * 1.1 * zoomScale;
        ctx.save();
        ctx.drawImage(bodyImg, px - size / 2, py - size / 2, size, size);
        drawText(displayNumbers[i], px, py, zoomScale);
        ctx.restore();
      }
    }
  }

  function playVictorySequence() {
    const isPattern1 = currentPattern.start === 1;
    const timestamps = isPattern1
      ? VICTORY_TIMESTAMPS.pattern1
      : VICTORY_TIMESTAMPS.pattern2;

    const patternAudioKey = isPattern1 ? "greatJobAudio" : "greatJobAudio1";
    const audioSrc = _pageData.sections[sectionCnt - 1][patternAudioKey];
    if (!audioSrc) {
      console.warn("Victory audio not found for key:", patternAudioKey);
      return;
    }

    const audioEl = document.getElementById("simulationAudio");
    if (!audioEl) {
      console.warn("simulationAudio element not found");
      return;
    }

    // Clear any old timeouts / RAF
    victoryTimeouts.forEach(t => clearTimeout(t));
    victoryTimeouts = [];
    if (audioEl._victoryRaf) {
      cancelAnimationFrame(audioEl._victoryRaf);
      audioEl._victoryRaf = null;
    }

    victorySequenceIndex = -1;
    victoryLastFiredIndex = -1;

    const numberTimestamps = timestamps.slice(0, -1); // all except last
    const finalTimestamp  = timestamps[timestamps.length - 1];
    const audioKey = patternAudioKey;

    // ─── RAF polling loop ───────────────────────────────────────────────────
    // Runs every animation frame (~16ms). Reads audio.currentTime directly.
    // On pause: stops RAF and registers a "playing" listener to auto-resume.
    // On resume: "playing" fires → RAF restarts from correct currentTime.
    function victoryRafLoop() {
      // Audio ended — fully done
      if (audioEl.ended) {
        audioEl._victoryRaf = null;
        return;
      }

      // Audio paused (play/pause button) — stop RAF, wait for resume
      if (audioEl.paused) {
        audioEl._victoryRaf = null;
        // Re-attach playing listener so RAF restarts when audio resumes
        audioEl.addEventListener("playing", function onResumed() {
          audioEl.removeEventListener("playing", onResumed);
          // Catch up: re-check all timestamps at current position
          const ct = audioEl.currentTime;
          for (let i = victoryLastFiredIndex + 1; i < numberTimestamps.length; i++) {
            if (ct >= numberTimestamps[i]) {
              victoryLastFiredIndex = i;
              victorySequenceIndex  = i;
              victoryZoomStart = performance.now();
              const currentNumber = currentPattern.start + i;
              updateText(NUMBER_WORDS[currentNumber], _pageData.sections[sectionCnt - 1][audioKey]);
              render();
            }
          }
          audioEl._victoryRaf = requestAnimationFrame(victoryRafLoop);
        }, { once: true });
        return;
      }

      const ct = audioEl.currentTime;

      // Check each number timestamp in order
      for (let i = 0; i < numberTimestamps.length; i++) {
        if (ct >= numberTimestamps[i] && victoryLastFiredIndex < i) {
          victoryLastFiredIndex = i;
          victorySequenceIndex  = i;
          victoryZoomStart = performance.now();

          const currentNumber = currentPattern.start + i;
          updateText(
            NUMBER_WORDS[currentNumber],
            _pageData.sections[sectionCnt - 1][audioKey]
          );
          console.log("Victory number:", currentNumber, "ct:", ct.toFixed(3));
          render();
          break; // one per frame — next frame catches next if needed
        }
      }

      // Check final text timestamp
      if (ct >= finalTimestamp && victoryLastFiredIndex !== 9999) {
        victoryLastFiredIndex = 9999;
        victorySequenceIndex  = 9999;
        updateText(
          _pageData.sections[sectionCnt - 1].finalText,
          _pageData.sections[sectionCnt - 1][audioKey]
        );
        console.log("Victory final text at ct:", ct.toFixed(3));
        audioEl._victoryRaf = null;
        return; // done
      }

      // Continue polling
      audioEl._victoryRaf = requestAnimationFrame(victoryRafLoop);
    }
    // ────────────────────────────────────────────────────────────────────────

    playBtnSounds(audioSrc);

    // Start RAF loop once audio begins playing
    audioEl.addEventListener("playing", function onPlaying() {
      audioEl.removeEventListener("playing", onPlaying);
      audioEl._victoryRaf = requestAnimationFrame(victoryRafLoop);
    }, { once: true });

    // Cleanup on audio end
    audioEl.addEventListener("ended", function onVictoryEnded() {
      if (audioEl._victoryRaf) {
        cancelAnimationFrame(audioEl._victoryRaf);
        audioEl._victoryRaf = null;
      }
    }, { once: true });
  }


  /* =========================
     POLYGON LOGIC
  ========================= */
  const clipPolygon = [
    [0, 0],
    [100, 0],
    [100, 100],
    [0, 100]
  ];

  function getPolygonPoints() {
    const rect = gameWrapper.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    return clipPolygon.map(([px, py]) => [px / 100 * w, py / 100 * h]);
  }

  function isPointInPolygon(x, y, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 0.00001) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function canMoveToTile(tileX, tileY) {
    const polygon = getPolygonPoints();

    const cx = gridOffsetX + tileX * tileSize + tileSize / 2;
    const cy = gridOffsetY + tileY * tileSize + tileSize / 2;

    const margin = tileSize * 0.25;

    return isPointInPolygon(cx + margin, cy + margin, polygon) &&
      isPointInPolygon(cx - margin, cy + margin, polygon) &&
      isPointInPolygon(cx + margin, cy - margin, polygon) &&
      isPointInPolygon(cx - margin, cy - margin, polygon);
  }

  /* =========================
     GAME MOVEMENT & LOGIC
  ========================= */
  function randomEmptyCell() {
    let pos, attempts = 0;
    do {
      pos = {
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY)
      };
      attempts++;
    } while (
      attempts < 100 &&
      (!canMoveToTile(pos.x, pos.y) ||
        snake.some(s => s.x === pos.x && s.y === pos.y) ||
        foods.some(f => f.x === pos.x && f.y === pos.y)) ||
      pos.x >= tileCountX || pos.y >= tileCountY
    );
    return pos;
  }

  function spawnFoods() {
    if (isGameEnded && foods.length > 0) {
      console.log("Spawn blocked - game ended");
      return;
    }

    const head = snake[0];

    function getClosePosition(preferredDistance = 3) {
      let pos;
      let attempts = 0;
      let bestPos = null;
      let bestDistance = Infinity;

      do {
        pos = randomEmptyCell();
        const distance = Math.abs(pos.x - head.x) + Math.abs(pos.y - head.y);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestPos = { ...pos };
        }

        if (distance <= preferredDistance + 2) {
          return pos;
        }

        attempts++;
      } while (attempts < 50);

      return bestPos || pos;
    }

    const correctPos = getClosePosition(3);

    let wrongPos;
    let attempts = 0;
    do {
      wrongPos = getClosePosition(3);
      attempts++;
    } while (attempts < 50 && wrongPos.x === correctPos.x && wrongPos.y === correctPos.y);

    let wrongValue;
    const possibleValues = [];
    for (let i = currentPattern.start; i <= currentPattern.end; i++) {
      possibleValues.push(i);
    }
    const validWrongOptions = possibleValues.filter(val =>
      val !== nextValue && !numberSequence.includes(val)
    );

    if (validWrongOptions.length > 0) {
      wrongValue = validWrongOptions[Math.floor(Math.random() * validWrongOptions.length)];
    } else {
      wrongValue = nextValue + 1 + Math.floor(Math.random() * 3);
    }

    const now = Date.now();
    foods = [
      { ...correctPos, value: nextValue, correct: true, spawnTime: now },
      { ...wrongPos, value: wrongValue, correct: false, spawnTime: now }
    ];
  }

  function startGame() {
    currentPattern = getNextPattern();
    snake = initSnake(currentPattern);
    nextValue = currentPattern.start + snake.length - 1;
    foods = [];

    isGameActive = false;
    isGameEnded = false;
    isMoving = false;
    pendingMove = null;
    foodsSpawned = false;
    victoryTriggered = false;
    shouldDrawVictoryLine = false;

    resizeCanvas();
    spawnFoods();
    foodsSpawned = true;
    requestAnimationFrame(gameLoop);
  }

  function inCorrectFood() {
    if (isGameEnded) return;
    spawnFoods();
    render();
  }

  function animateEating() {
    if (eatingAnimation) cancelAnimationFrame(eatingAnimation);
    const duration = 200;
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      if (elapsed < duration) {
        headScale = 1 + 0.3 * Math.sin((elapsed / duration) * Math.PI);
        eatingAnimation = requestAnimationFrame(step);
      } else {
        headScale = 1;
        eatingAnimation = null;
      }
    }
    requestAnimationFrame(step);
  }

  /* =========================
     INIT & INPUTS
  ========================= */
  function initSnake(pattern) {
    numberSequence = [];
    const body = [
      { x: 6, y: 5 },
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
      { x: 2, y: 5 }
    ];
    prevSnake = body.map(b => ({ ...b }));
    for (let i = 1; i < body.length; i++) {
      numberSequence.push(pattern.start + i - 1);
    }
    return body;
  }

  function getNextPattern() {
    // Read current index from localStorage — do NOT increment here.
    // Incrementing is done once externally (in refresh handler) before jumtoPage runs.
    const currentIndex = parseInt(localStorage.getItem("caterpillarLastPatternIndex") ?? "0", 10);
    return PATTERNS[currentIndex % PATTERNS.length];
  }

  function setDirection(dirKey) {
    idleStartTimer();

    if (!isGameActive || isGameEnded) return;

    let dirVec = { x: 0, y: 0 };
    if (dirKey === "up") dirVec = { x: 0, y: -1 };
    if (dirKey === "down") dirVec = { x: 0, y: 1 };
    if (dirKey === "left") dirVec = { x: -1, y: 0 };
    if (dirKey === "right") dirVec = { x: 1, y: 0 };

    if (snake.length > 1) {
      const head = snake[0];
      const neck = snake[1];
      if (head.x + dirVec.x === neck.x && head.y + dirVec.y === neck.y) return;
    }

    if (isMoving) {
      pendingMove = dirVec;
    } else {
      executeMove(dirVec);
    }
  }

  window.enableCaterpillarMovement = function () {
    console.log("Caterpillar inputs unlocked");
    isGameActive = true;
    idleStartTimer();
  };

  document.addEventListener("keydown", e => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
      e.preventDefault();
    }
    if (e.key === "ArrowUp") setDirection("up");
    if (e.key === "ArrowDown") setDirection("down");
    if (e.key === "ArrowLeft") setDirection("left");
    if (e.key === "ArrowRight") setDirection("right");
  });

  document.querySelectorAll(".controls button").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      setDirection(btn.dataset.dir);
    });
  });

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("orientationchange", resizeCanvas);

  document.addEventListener("fullscreenchange", resizeCanvas);
  document.addEventListener("webkitfullscreenchange", resizeCanvas);
  document.addEventListener("mozfullscreenchange", resizeCanvas);

  gameWrapper.addEventListener("mousemove", idleStartTimer);
  gameWrapper.addEventListener("mousedown", idleStartTimer);
  gameWrapper.addEventListener("mouseup", idleStartTimer);
  gameWrapper.addEventListener("click", idleStartTimer);
  gameWrapper.addEventListener("touchstart", idleStartTimer);
  gameWrapper.addEventListener("touchmove", idleStartTimer);
  gameWrapper.addEventListener("touchend", idleStartTimer);

  function idleStartTimer() {
    if (isGameEnded || shouldDrawVictoryLine) return;
    if (!isGameActive) return;

    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
    stopIdleSoundNow();
    isIdle = false;

    idleTimer = setTimeout(triggerIdleState, IDLE_DURATION);
  }

  function idleStopTimer() {
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
    stopIdleSoundNow();
    isIdle = false;
  }

  function triggerIdleState() {
    if (!isGameActive || isGameEnded || shouldDrawVictoryLine) return;
    if (isIdle) return;

    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }

    isIdle = true;

    updateText(
      _pageData.sections[sectionCnt - 1].idleText,
      _pageData.sections[sectionCnt - 1].idleAudio
    );

    playIdleSoundNow();
  }

  // Guard: startGame must only ever run ONCE per initCaterpillarGame() call
  let _gameStarted = false;

  function tryStartGame() {
    if (_gameStarted) return;   // prevent double call
    _gameStarted = true;
    startGame();
  }

  // Check if already cached first; if not, wait for onload
  const headReady = headImg.complete && headImg.naturalWidth > 0;
  const bodyReady = bodyImg.complete && bodyImg.naturalWidth > 0;

  if (headReady && bodyReady) {
    // Both cached — start immediately
    tryStartGame();
  } else if (headReady) {
    // Head cached, wait for body
    bodyImg.onload = bodyImg.onerror = tryStartGame;
  } else if (bodyReady) {
    // Body cached, wait for head
    headImg.onload = headImg.onerror = tryStartGame;
  } else {
    // Neither cached — wait for both
    let _readyCount = 0;
    function onOne() { _readyCount++; if (_readyCount === 2) tryStartGame(); }
    headImg.onload = headImg.onerror = onOne;
    bodyImg.onload = bodyImg.onerror = onOne;
  }

  /* =========================
     EXTERNAL CONTROL API
  ========================= */

  window.enableCaterpillarControls = function () {
    if (isGameEnded) {
      console.log("Game ended — skipping caterpillar re-enable");
      return;
    }
    console.log("Caterpillar enabled");
    isGameActive = true;
    idleStartTimer();
  };

  window.disableCaterpillarControls = function () {
    console.log("Caterpillar disabled");
    isGameActive = false;
    idleStopTimer();
  };

  window.enableCaterpillarIdle = function () {
    if (isGameActive && !isGameEnded) {
      idleStartTimer();
    }
    console.log("Idle enabled");
  };

  window.disableCaterpillarIdle = function () {
    idleStopTimer();
    console.log("Idle disabled");
  };

  window.startIdleTimer = function () {
    if (isGameEnded || shouldDrawVictoryLine) {
      console.log("startIdleTimer blocked — victory line showing");
      return;
    }
    if (!isGameActive) return;
    idleStartTimer();
  };

  window.startFoodAnimation = function () {
    foodAnimationEnabled = true;
    console.log("Food animation started");
  };

  window.stopFoodAnimation = function () {
    foodAnimationEnabled = false;
    console.log("Food animation stopped");
  };

  window.caterpillarIdleStop = function () {
    idleStopTimer();
    console.log("Idle stopped from external call");
  };

  window.caterpillarIdleStart = function () {
    if (isGameEnded || shouldDrawVictoryLine) {
      console.log("Idle start blocked — victory line showing");
      return;
    }
    if (!isGameActive) {
      console.log("Idle start blocked — game not active");
      return;
    }
    idleStartTimer();
  };

  // ✅ FIX: expose internal audio resume for stayPage
  window.resumeSimulationAudio = function () {
    const audio = document.getElementById("simulationAudio");
    if (!audio) return;

    // ✅ Only resume if there is a valid src and it was paused mid-play (not ended)
    if (audio.src && !audio.ended && audio.paused && audio.currentTime > 0) {
      console.log("Resuming simulation audio from:", audio.currentTime);
      audio.play().catch(e => console.log("Resume audio error:", e));
    } else {
      console.log("No resumable audio — nothing to resume");
    }
  };

  const CATERPILLAR_PAGE = 4;

  // audioPlayingChanged: true  = popup opened → pause simulationAudio + stop idle
  //                       false = popup closed → resume simulationAudio (only if mid-play) + start idle
  window.addEventListener("audioPlayingChanged", (e) => {
    if (_controller.pageCnt !== CATERPILLAR_PAGE) return;
    if (!gameStarted) return;

    const popupOpen = e.detail.value;
    const audio = document.getElementById("simulationAudio");
    console.log("audioPlayingChanged dispatched, popupOpen:", popupOpen);

    if (popupOpen) {
      // Popup opened → pause audio if currently playing, stop idle
      console.log("Popup opened -> pausing audio + stopping idle");
      if (audio && !audio.paused && !audio.ended) {
        audio.pause();
      }
      idleStopTimer();
    } else {
      // Popup closed → resume audio only if it was paused mid-play (not ended/not fresh)
      console.log("Popup closed -> resuming audio + starting idle");
      if (audio && audio.paused && !audio.ended && audio.currentTime > 0) {
        audio.play().catch(e => console.log("Resume error:", e));
      }
      // Start idle only if game still active (not victory)
      if (isGameEnded || shouldDrawVictoryLine) {
        console.log("Popup closed but game ended — idle blocked");
        return;
      }
      idleStartTimer();
    }
  });
}

var activeAudio = null;

function playBtnSounds(soundFile, callback) {
  const audio = document.getElementById("simulationAudio");

  audio.muted = false;

  if (!soundFile) {
    console.warn("Audio source missing!");
    if (callback) callback();
    return;
  }

  // ✅ Clear any existing onended triggers
  audio.onended = null;

  if (activeAudio && !activeAudio.paused) {
    activeAudio.pause();
  }

  audio.loop = false;
  audio.src = soundFile;
  audio.load();

  activeAudio = audio;

  if (typeof callback === "function") {
    audio.onended = () => {
      audio.onended = null;
      callback();
    };
  }

  console.log("Playing:", soundFile);
  audio.play().catch((err) => {
    console.warn("Audio play error:", err);
  });
}

// ✅ FIX: stayPage — resume simulationAudio if it was mid-play when popup opened
// Called by the refresh button BEFORE jumtoPage — increments pattern once so
// the next initCaterpillarGame() call picks up the alternate pattern
function advanceCaterpillarPattern() {
  const PATTERN_COUNT = 2; // must match PATTERNS.length inside initCaterpillarGame
  const current = parseInt(localStorage.getItem("caterpillarLastPatternIndex") ?? "0", 10);
  const next = (current + 1) % PATTERN_COUNT;
  localStorage.setItem("caterpillarLastPatternIndex", String(next));
  console.log("Pattern advanced:", current, "->", next);
}

function stayPage() {
  playClickThen();

  // Resume simulation audio if it was paused mid-play when popup opened
  if (typeof window.resumeSimulationAudio === 'function') {
    window.resumeSimulationAudio();
  }

  if (gameStarted) {
    window.enableCaterpillarControls();  // re-enable movement
    window.enableCaterpillarIdle();      // re-enable idle countdown
  }

  $("#home-popup").hide();
}


function leavePage() {
  playClickThen();
  $(".playPause").hide();

  setPopupOpenState(true);

  // Disable controls and idle when leaving
  window.disableCaterpillarControls();
  window.disableCaterpillarIdle();

  // Pause audio but keep currentTime so stayPage() can resume from same point
  var audio = document.getElementById("simulationAudio");
  if (audio) {
    audio.pause();
    // Do NOT reset currentTime — resumeSimulationAudio() in stayPage will resume from here
  }

  if (typeof isManuallyPaused !== 'undefined') {
    isManuallyPaused = false;
  }
  if (typeof simulationWasPlaying !== 'undefined') {
    simulationWasPlaying = false;
  }

  jumtoPage(2);
}



function playPauseSimulation(btn) {
  playClickThen();
  var audio = document.getElementById("simulationAudio");

  _isSimulationPaused = !_isSimulationPaused;

  if (_isSimulationPaused) {
    // Only pause if currently playing — don't touch if already ended
    if (!audio.paused && !audio.ended) {
      audio.pause();
    }
    disableAll();
    btn.classList.remove("play");
    btn.classList.add("pause");
    btn.dataset.tooltip = "Play";
  } else {
    // Only resume if audio is paused mid-play — NOT if it already ended or never played
    if (audio.paused && !audio.ended && audio.currentTime > 0) {
      audio.play().catch(() => { });
    }
    enableAll();
    btn.classList.remove("pause");
    btn.classList.add("play");
    btn.dataset.tooltip = "Pause";
  }

}

function enableAll() {
  playClickThen();
  if (gameStarted) {
    window.enableCaterpillarControls();
  }
  window.startFoodAnimation();
  $(".home_btn, .music,.introInfo,#full-screen, .wrapTextaudio").prop("disabled", false);
  const audio = document.getElementById("audio_src");
  if (_controller._globalMusicPlaying) {
    audio.muted = false;
    audio.play();
  }
  $(".dummy-patch").show();
}



function disableAll() {
  playClickThen();
  window.disableCaterpillarControls();
  window.stopFoodAnimation();
  $(".home_btn, .music,.introInfo,#full-screen,.wrapTextaudio").prop("disabled", true);
  const audio = document.getElementById("audio_src");
  if (_controller._globalMusicPlaying) {
    audio.pause();
  }
  $(".dummy-patch").hide();
}

function updateText(txt, audio) {
  $("#simulationAudio").on("ended", function () {
    $(".wrapTextaudio")
      .removeClass("playing")
      .addClass("paused");
  });

  let text = `
    <p tabindex="0" aria-label="${removeTags(txt)}">
      ${txt}
      <button 
        class="wrapTextaudio playing"
        onclick="replayLastAudio(this, '${audio}')">
      </button>
    </p>
  `;

  $(".inst").html(text);
  $(".wrapTextaudio")
    .removeClass("paused")
    .addClass("playing");
}

function playFeedbackAudio(_audio) {
  $(".dummy-patch").show();
  playBtnSounds(_audio)
  audioEnd(function () {
    $(".dummy-patch").hide();
  })
}




function jumtoPage(pageNo) {
  // playClickThen();

  _controller.pageCnt = pageNo;
  console.log(pageNo, "pageNumber");

  _controller.updateViewNow();
}



var activeAudio = null;

function playBtnSounds(soundFile, callback) {
  const audio = document.getElementById("simulationAudio");

  audio.muted = false;

  if (!soundFile) {
    console.warn("Audio source missing!");
    // If audio is missing but a callback exists, we should probably run it 
    // so the flow doesn't hang, or just return.
    if (callback) callback();
    return;
  }

  // 1. CRITICAL: Clear any existing onended triggers from previous plays
  audio.onended = null;

  // Stop previous audio if it exists
  if (activeAudio && !activeAudio.paused) {
    activeAudio.pause();
  }

  audio.loop = false;
  audio.src = soundFile;
  audio.load();

  activeAudio = audio;

  // 2. If a callback is provided, attach it
  if (typeof callback === "function") {
    audio.onended = () => {
      // Remove self to prevent future loops
      audio.onended = null;
      callback();
    };
  }

  console.log("Playing:", soundFile);
  audio.play().catch((err) => {
    console.warn("Audio play error:", err);
    // Optional: If play fails, should we trigger callback?
    // if (callback) callback(); 
  });
}



function resetSimulationAudio() {
  console.log("Balajia");

  const audioElement = document.getElementById("simulationAudio");
  if (!audioElement) return;

  audioElement.pause();

  audioElement.src = "";
  audioElement.removeAttribute("src");

  const source = audioElement.querySelector("source");
  if (source) source.src = "";

  audioElement.load();
  audioElement.onended = null;
}





function audioEnd(callback) {
  const audio = document.getElementById("simulationAudio");
  audio.onended = null;
  audio.onended = () => {
    if (typeof callback === "function") callback();
  };
}


function toggleAudio(el) {
  playClickThen();
  // console.log(event, "current e")
  // const el = event.currentTarget; 
  const audio = document.getElementById("audio_src");

  // console.log(el, "Target class");

  if (audio.paused) {
    audio.muted = false;
    audio.play();
    el.classList.remove("mute");
    el.classList.add("playing");
    _controller._globalMusicPlaying = true;
  } else {
    audio.pause();
    el.classList.remove("playing");
    el.classList.add("mute");
    _controller._globalMusicPlaying = false;
  }
}

var AudioController = (() => {
  const audio = document.getElementById("simulationAudio");

  const hasAudio = () => audio && audio.src;

  return {
    play() {
      if (hasAudio()) audio.play();
    },
    pause() {
      if (hasAudio()) audio.pause();
    }
  };
})();






function restartActivity() {
  $(".popup").css("opacity", "0");
  setTimeout(function () {
    $(".popup").css("display", "none");
  }, 500);
  _globalCicked = 0;
  restartPage();
}



// function showEndAnimations() {
//   var $audio = $("#simulationAudio");

//   // Remove any existing timeupdate listeners
//   $audio.off("timeupdate");

//   playBtnSounds(_pageData.sections[sectionCnt - 1].finalAudio);

//   closePopup('introPopup-1');
//   // console.log("Audio ending");
//   pageVisited();

//   $(".popup").css({
//     visibility: "visible",
//     opacity: "1",
//     display: "flex"
//   });

//   const showEndAnimationsHandler = function () {
//     const audioEl = $audio[0];



//     // ✅ Only trigger after 2 seconds
//     if (audioEl.currentTime > 2) {

//       $(".confetti").addClass("show");

//       setTimeout(function () {
//         $(".confetti").removeClass("show");
//       }, 2000);

//       // ✅ Run only once
//       $audio.off("timeupdate", showEndAnimationsHandler);
//     }
//   };

//   $audio.on("timeupdate", showEndAnimationsHandler);
// }


var isEndAnimationTriggered = false;

function showEndAnimations() {

  if (window.stopSnakeIdle) {
    window.stopSnakeIdle();
  }

  if (isEndAnimationTriggered) return;
  isEndAnimationTriggered = true;

  console.log("showEndAnimations initiated");

  // Cleanup previous states
  closePopup('introPopup-1');
  pageVisited();
  $(".greetingsPop").css({ visibility: "visible", opacity: "1" });
  setTimeout(function () {
    $(".confetti").addClass("show");
  }, 500)


  const finalAudioSource = _pageData.sections[sectionCnt - 1].finalAudio;
  const $audio = $("#simulationAudio");

  // Remove previous timeupdate listeners to prevent stacking
  $audio.off("timeupdate");

  if (finalAudioSource) {
    // Play the final audio
    playBtnSounds(finalAudioSource);

    // Logic: Show popup 2 seconds INTO the final audio
    $audio.on("timeupdate", function () {
      // Using 'this' refers to the audio DOM element
      if (this.currentTime > 2) {
        // Trigger Visuals
        $(".greetingsPop").css({ visibility: "hidden", opacity: "0" });
        $(".popup").css({ visibility: "visible", opacity: "1", display: "flex" });
        $(".confetti").removeClass("show");

        // IMPORTANT: Remove listener so this block runs only once
        $(this).off("timeupdate");
      }
    });
  } else {
    // Fallback if no audio exists
    $(".popup").css({ visibility: "visible", opacity: "1", display: "flex" });
  }
}


// function replayLastAudio(btnElement) {
//   playClickThen();

//   const courseAudio = document.getElementById("courseAudio");
//   const simulationAudio = document.getElementById("simulationAudio");

//   const index = parseInt(btnElement.id.split("_")[1]);
//   const replayAudios =
//     _pageData.sections[sectionCnt - 1].content.replayAudios;

//   let activeAudio = null;

//   console.log("replayyyy");
//   // --------------------------------------------------
//   // 1️⃣ Detect active playing audio
//   // --------------------------------------------------
//   if (courseAudio && !courseAudio.paused && !courseAudio.ended) {
//     activeAudio = courseAudio;
//   }
//   else if (simulationAudio && !simulationAudio.paused && !simulationAudio.ended) {
//     activeAudio = simulationAudio;
//   }

//   // --------------------------------------------------
//   // 2️⃣ If something is playing → just toggle mute
//   // --------------------------------------------------
//   if (activeAudio) {
//     activeAudio.muted = !activeAudio.muted;
//     updateButtonUI(btnElement, !activeAudio.muted);
//     return;
//   }

//   // --------------------------------------------------
//   // 3️⃣ Nothing playing → call playBtnSounds()
//   // --------------------------------------------------
//   if (replayAudios && replayAudios[index]) {

//     console.log("Replay audioso");
//     playBtnSounds(replayAudios[index]);

//     resetAllButtons();
//     updateButtonUI(btnElement, true);

//     // Optional: reset UI when replay ends
//     if (simulationAudio) {
//       simulationAudio.onended = function () {
//         updateButtonUI(btnElement, false);
//       };
//     }
//   }
// }

function replayLastAudio(btnElement, directAudioSrc) {
  playClickThen();
  const courseAudio = document.getElementById("courseAudio");
  const simulationAudio = document.getElementById("simulationAudio");
  let activeAudio = null;

  // ✅ Detect active playing audio
  if (courseAudio && !courseAudio.paused && !courseAudio.ended) {
    activeAudio = courseAudio;
  } else if (simulationAudio && !simulationAudio.paused && !simulationAudio.ended) {
    activeAudio = simulationAudio;
  }

  // ✅ If something is playing → just toggle mute
  if (activeAudio) {
    activeAudio.muted = !activeAudio.muted;
    updateButtonUI(btnElement, !activeAudio.muted);
    return;
  }

  // ✅ If direct audio src passed (idle, victory numbers, finalText)
  if (directAudioSrc) {
    playBtnSounds(directAudioSrc);
    resetAllButtons();
    updateButtonUI(btnElement, true);
    if (simulationAudio) {
      simulationAudio.onended = function () {
        updateButtonUI(btnElement, false);
      };
    }
    return;
  }

  // ✅ Fallback — use replayAudios index
  const index = parseInt(btnElement.id.split("_")[1]);
  const replayAudios = _pageData.sections[sectionCnt - 1].content.replayAudios;
  if (replayAudios && replayAudios[index]) {
    playBtnSounds(replayAudios[index]);
    resetAllButtons();
    updateButtonUI(btnElement, true);
    if (simulationAudio) {
      simulationAudio.onended = function () {
        updateButtonUI(btnElement, false);
      };
    }
  }
}

function stopAllAudios() {
  const courseAudio = document.getElementById("courseAudio");
  const simulationAudio = document.getElementById("simulationAudio");

  [courseAudio, simulationAudio].forEach(audio => {
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false; // unmute when new audio plays
    }
  });

  // Reset wrapText button UI
  resetAllButtons();
}



function updateButtonUI(btn, isPlaying) {
  if (isPlaying) {
    btn.classList.remove("paused");
    btn.classList.add("playing");
  } else {
    btn.classList.remove("playing");
    btn.classList.add("paused");
  }
}

function resetAllButtons() {
  document.querySelectorAll(".wrapTextaudio").forEach(btn => {
    btn.classList.remove("playing");
    btn.classList.add("paused");
  });
}




function enableButtons() {
  $(".flip-card").prop("disabled", false);
  $(".flipTextAudio").prop("disabled", false);
}

function disableButtons() {
  $(".flip-card").prop("disabled", true);
  $(".flipTextAudio").prop("disabled", true);
}

function resetToggle() {
  $(".flip-card").removeClass('flipped');
}

// -------- update CSS ------------
function setCSS(sectionCnt) {
  _wrapperWidth = $("#f_wrapper").outerWidth();
  _wrapperHeight = $("#f_wrapper").outerHeight();
  // ---- checking device width and height ----
  if (_wrapperWidth > 768) {
    for (var i = 0; i < _pageData.imgCollage.desktop.length; i++) {
      $("#section-1")
        .find(".bg-img")
        .eq(i)
        .css({
          "background-image":
            "url(" + _pageData.imgCollage.desktop[i].imageSRC + ")",
          "background-size": "cover",
        });
    }
  } else {
    for (var j = 0; j < _pageData.imgCollage.portrait.length; j++) {
      $("#section-1")
        .find(".bg-img")
        .eq(j)
        .css({
          "background-image":
            "url(" + _pageData.imgCollage.portrait[j].imageSRC + ")",
          "background-size": "cover",
        });
    }
  }
}

// -------- animations ------------
//function updateCurrentTime(_currTime) {
//    _tweenTimeline.seek(_currTime)
//}

/*
function removeTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    return str.replace(/(<([^>]+)>)/ig, '');
}*/
function removeTags(str) {
  //console.log('removeTags 0', str)
  if (str === null || str === "") {
    return false;
  } else {
    str = _controller.removeTags(str);
    return str;
  }
}
function initPageAnimations() {
  if (_tweenTimeline) {
    _tweenTimeline.kill();
  }
  _tweenTimeline = new TimelineLite();

  mainAnimation();
  if (_pageAudioSync && !_pageData.mainAudio.isEmptyAudio) {
    withAudioSync();
  } else {
    withoutAudioSync();
  }
}

function mainAnimation() {
  $(".f_page_content").animate(
    {
      opacity: 1,
    },
    300
  );
}

function withAudioSync() {
  _tweenTimeline.play();

  _tweenTimeline.add(animateFadeIn($("h1"), 0.5).play(), 0.5);

  _tweenTimeline.add(animateFadeIn($(".inst").find("#inst_1"), 0.5).play(), 0.1);
  // _tweenTimeline.add(animateFadeOut($(".inst").find("#inst_1"), 0.5).play(), 4);
  // _tweenTimeline.add(animateFadeIn($(".inst").find("#inst_2"), 0.5).play(), 4.2);
  _tweenTimeline.add(animateFadeOut($(".ost"), 0.5).play(), 4.5);
  _tweenTimeline.add(animateFadeOut($(".dummy-patch"), 0.5).play(), 7);
  // _tweenTimeline.add(animateFadeIn($(".inst"), 0.5).play(), 5);

  _tweenTimeline.add(
    animateFadeIn($(".animat-container"), 0.5, 0).play(),
    0.3
  );

  var rightListTiming = [0.3];
  // for (var k = 0; k < rightListTiming.length; k++) {
  //   _tweenTimeline.add(
  //     animateFadeIn(
  //       $(".animat-container").find(".flip-container").eq(k),
  //       0.5,
  //       0
  //     ).play(),
  //     rightListTiming[k]
  //   );
  // }
}

// function withoutAudioSync() {
//   _tweenTimeline.play();
//   _tweenTimeline.add(animateFadeIn($("h1"), 0.5).play(), 0.5);
//   _tweenTimeline.add(animateFadeIn($(".animat-container"), 0.5, 0).play(), 0.1);
//   let time = 1,
//     t = 0,
//     pTag = 0,
//     listTag = 0,
//     divTag = 0;
//   let time1 = time;
//   for (let j = 0; j < _pageData.sections[0].content.listText.length; j++) {
//     t = time1 + j * 0.5;
//     _tweenTimeline.add(
//       animateFromRight(
//         $(".animat-container").find(".list li").eq(listTag),
//         0.5,
//         0
//       ).play(),
//       t
//     );
//     listTag++;
//   }
// }
// -------- resize page details ------------
/*window.onresize = function() {
    //setCSS()
}*/
