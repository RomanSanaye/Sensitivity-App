// ======== 🎮 PUBG MOBILE SENSITIVITY ENGINE (FIXED 20-DIGIT SYSTEM) ========

import { iphoneDevices, androidDevices } from "./data.js";

// ===== STATE =====
let selectedPlatform = "android";
let selectedDevice = null;
let selectedMode = "standard";
let selectedGyro = "on";

// =====================
// UI CONTROLS
// =====================
window.setPlatform = function (type) {
  selectedPlatform = type;

  document.getElementById("platform-android").classList.remove("active");
  document.getElementById("platform-ios").classList.remove("active");

  document.getElementById("platform-" + type).classList.add("active");

  loadDevices();
};

window.setMode = function (mode) {
  selectedMode = mode;

  document.getElementById("mode-standard").classList.remove("active");
  document.getElementById("mode-pro").classList.remove("active");

  document.getElementById("mode-" + mode).classList.add("active");
};

window.setGyro = function (value) {
  selectedGyro = value;

  document.getElementById("gyro-on").classList.remove("active");
  document.getElementById("gyro-off").classList.remove("active");

  document.getElementById("gyro-" + value).classList.add("active");
};

// =====================
// LOAD DEVICES
// =====================
function loadDevices() {
  const select = document.getElementById("deviceModel");
  select.innerHTML = "";

  const list = selectedPlatform === "android" ? androidDevices : iphoneDevices;

  list.forEach((d) => {
    const option = document.createElement("option");
    option.value = d.name;
    option.textContent = d.name;
    select.appendChild(option);
  });

  selectedDevice = list[0]?.name;
}

document.getElementById("deviceModel").addEventListener("change", (e) => {
  selectedDevice = e.target.value;
});

// =====================
// BASE PROFILES
// =====================
const baseProfile = {
  iphone: {
    camera: { tpp: 110, fpp: 105, redDot: 55, x2: 35, x3: 25, x4: 20, x6: 12, x8: 10 },
    ads:    { tpp: 95, fpp: 90, redDot: 55, x2: 35, x3: 25, x4: 18, x6: 12, x8: 10 },
    gyro:   { tpp: 330, fpp: 330, redDot: 320, x2: 280, x3: 240, x4: 190, x6: 120, x8: 90 },
    adsGyro:{ redDot: 300, x2: 250, x3: 200, x4: 150, x6: 100, x8: 80 }
  },

  android: {
    camera: { tpp: 125, fpp: 120, redDot: 65, x2: 40, x3: 30, x4: 22, x6: 14, x8: 10 },
    ads:    { tpp: 105, fpp: 100, redDot: 60, x2: 40, x3: 30, x4: 22, x6: 14, x8: 10 },
    gyro:   { tpp: 370, fpp: 370, redDot: 350, x2: 300, x3: 260, x4: 200, x6: 130, x8: 90 },
    adsGyro:{ redDot: 320, x2: 270, x3: 220, x4: 160, x6: 110, x8: 80 }
  }
};

// =====================
// DEVICE FIND
// =====================
function getDevice(name) {
  const all = [...iphoneDevices, ...androidDevices];
  return all.find(d => d.name === name);
}

// =====================
// FORMAT TEXT
// =====================
function format(obj) {
  return `
TPP No Scope: ${obj.tpp}%
FPP No Scope: ${obj.fpp}%
Red Dot / Holo: ${obj.redDot}%
2x Scope: ${obj.x2}%
3x Scope: ${obj.x3}%
4x Scope: ${obj.x4}%
6x Scope: ${obj.x6}%
8x Scope: ${obj.x8}%
`;
}

// =====================
// COPY
// =====================
window.copyText = function (text) {
  navigator.clipboard.writeText(text);
  alert("Cloud Code Copied!");
};

// =====================
// 20 DIGIT ENGINE (CORE FIX)
// =====================

// convert number → safe 2 digit
function to2(n) {
  return String(Math.max(0, Math.min(99, Math.round(n)))).padStart(2, "0");
}

// build sensitivity seed (9 values only = CONTROLLED SIZE)
function buildSeed(base) {
  const values = [
    base.camera.tpp,
    base.camera.redDot,
    base.camera.x2,
    base.ads.tpp,
    base.ads.redDot,
    base.ads.x2,
    base.gyro.tpp,
    base.adsGyro.redDot,
    base.camera.fpp
  ];

  return values.map(to2).join(""); // 18 digits
}

// metadata = 2 digits only
function buildMeta(device, fps, mode, gyro) {
  const d = (device || "X").length % 9;
  const f = fps === "120" ? 2 : fps === "90" ? 1 : 0;
  const m = mode === "pro" ? 2 : 1;
  const g = gyro === "on" ? 1 : 0;

  return String(d) + String(f); // 2 digits only (TOTAL CONTROL)
}

// format PUBG style
function format20(str) {
  return str.match(/.{1,4}/g).join("-");
}

// =====================
// GENERATE
// =====================
window.generate = function () {
  const fps = document.getElementById("fps").value;

  const device = getDevice(selectedDevice);
  const type = selectedPlatform;

  const base = JSON.parse(JSON.stringify(baseProfile[type]));

  // ===== FACTORS =====
  let modeFactor = selectedMode === "pro" ? 1.1 : 0.9;

  let fpsFactor = 1;
  if (fps === "60") fpsFactor = 1.05;
  if (fps === "90") fpsFactor = 1;
  if (fps === "120") fpsFactor = 0.95;

  const finalFactor = modeFactor * fpsFactor;

  function apply(obj) {
    for (let k in obj) {
      obj[k] = Math.round(obj[k] * finalFactor);
    }
  }

  apply(base.camera);
  apply(base.ads);

  if (selectedGyro === "on") {
    apply(base.gyro);
    apply(base.adsGyro);
  }

  // =====================
  // 🔥 CLOUD CODE (FIXED 20 DIGITS)
  // =====================
  const meta = buildMeta(selectedDevice, fps, selectedMode, selectedGyro);
  const seed = buildSeed(base);

  let raw20 = (meta + seed).slice(0, 20);

// pad if needed
  while (raw20.length < 20) raw20 += "0";

  const cloudCode = format20(raw20);

  // =====================
  // UI OUTPUT
  // =====================
  document.getElementById("results").style.display = "block";

  document.getElementById("camera").innerText = format(base.camera);
  document.getElementById("ads").innerText = format(base.ads);

  if (selectedGyro === "on") {
    document.getElementById("gyroResult").innerText = format(base.gyro);
    document.getElementById("adsGyro").innerText = format(base.adsGyro);
  } else {
    document.getElementById("gyroResult").innerText = "Gyro: None";
    document.getElementById("adsGyro").innerText = "Gyro ADS: None";
  }

  // =====================
  // CLOUD BOX
  // =====================
  let box = document.getElementById("cloudCodeBox");

  if (!box) {
    box = document.createElement("div");
    box.id = "cloudCodeBox";
    box.className = "card";
    document.getElementById("results").appendChild(box);
  }

  box.innerHTML = `
    <h2>☁️ Cloud Code (20 DIGIT)</h2>
    <p style="word-break:break-all">${cloudCode}</p>
    <button onclick="copyText('${cloudCode}')">Copy Code</button>
  `;
};

// =====================
loadDevices();