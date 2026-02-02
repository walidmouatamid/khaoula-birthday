document.addEventListener("DOMContentLoaded", () => {
  const cake = document.querySelector(".cake");
  let candles = [];
  let analyser;

  /* =====================
     SVG NUMBER GENERATORS
  ===================== */

  const number2SVG = () => `
    <svg viewBox="0 0 100 160" width="70" height="120">
      <defs>
        <linearGradient id="wax2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#c40010"/>
          <stop offset="100%" stop-color="#6f0008"/>
        </linearGradient>
      </defs>
      <path
        d="M28 30 C28 10,72 10,72 36 C72 58,52 70,40 84 C32 96,30 108,30 120 L70 120"
        fill="none"
        stroke="url(#wax2)"
        stroke-width="18"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>`;

  const number7SVG = () => `
    <svg viewBox="0 0 100 160" width="70" height="120">
      <defs>
        <linearGradient id="wax7" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#c40010"/>
          <stop offset="100%" stop-color="#6f0008"/>
        </linearGradient>
      </defs>
      <path
        d="M25 30 L75 30 L45 120"
        fill="none"
        stroke="url(#wax7)"
        stroke-width="18"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>`;

  /* =====================
     CANDLE CREATION
  ===================== */

  function addCandle(svg, left) {
    const candle = document.createElement("div");
    candle.className = "svg-candle";
    candle.style.left = `${left}px`;
    candle.style.top = "-50px";

    candle.innerHTML = svg;
    candle.insertAdjacentHTML("beforeend", `<div class="flame"></div>`);

    cake.appendChild(candle);
    candles.push(candle);
  }

  // Add "27"
  addCandle(number2SVG(), 60);
  addCandle(number7SVG(), 120);

  /* =====================
     BLOW DETECTION
  ===================== */

  const isBlowing = () => {
    if (!analyser) return false;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    return data.reduce((sum, v) => sum + v, 0) / data.length > 40;
  };

  function blowOutCandles() {
    if (!isBlowing()) return;

    candles.forEach((candle) => {
      if (!candle.classList.contains("out") && Math.random() > 0.5) {
        candle.classList.add("out");
      }
    });
  }

  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const ctx = new AudioContext();
    analyser = ctx.createAnalyser();
    ctx.createMediaStreamSource(stream).connect(analyser);
    analyser.fftSize = 256;
    setInterval(blowOutCandles, 200);
  });
});
