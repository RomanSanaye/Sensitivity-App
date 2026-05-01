// ======== 🎮 PUBG MOBILE SENSITIVITY ENGINE (AI v3 + AIM FIX) ========

import { iphoneDevices, androidDevices } from "./data.js";

// =====================
// STATE
// =====================
let selectedPlatform = "android";
let selectedDevice = null;
let selectedGyro = "on";
let selectedStyle = "balanced";
let selectedFps = "60"; // FPS dropdown state

// =====================
// ELEMENTS
// =====================
const platformAndroid = document.getElementById("platform-android");
const platformIOS = document.getElementById("platform-ios");

const gyroOn = document.getElementById("gyro-on");
const gyroOff = document.getElementById("gyro-off");

const styleBalanced = document.getElementById("style-balanced");
const styleAggressive = document.getElementById("style-aggressive");
const styleSniper = document.getElementById("style-sniper");

const generateBtn = document.getElementById("generateBtn");
const resetBtn = document.getElementById("resetBtn");

const fpsDropdown = document.getElementById("fpsDropdown");
const fpsSelected = document.getElementById("fpsSelected");
const fpsList = document.getElementById("fpsList");
const fpsHidden = document.getElementById("fps");

const deviceDropdown = document.getElementById("deviceDropdown");
const deviceSelected = document.getElementById("deviceSelected");
const deviceList = document.getElementById("deviceList");

const searchInput = document.getElementById("phone");

// =====================
// PLATFORM EVENTS
// =====================
platformAndroid.addEventListener("click", () => setPlatform("android"));
platformIOS.addEventListener("click", () => setPlatform("ios"));

function setPlatform(type) {
  selectedPlatform = type;

  // FIX: Reset device selection when switching platform
  selectedDevice = null;
  deviceSelected.textContent = "Select your device model";

  platformAndroid.classList.remove("active");
  platformIOS.classList.remove("active");

  document.getElementById("platform-" + type).classList.add("active");

  loadDevices();
}


// =====================
// GYRO EVENTS
// =====================
gyroOn.addEventListener("click", () => setGyro("on"));
gyroOff.addEventListener("click", () => setGyro("off"));

function setGyro(value) {
  selectedGyro = value;

  gyroOn.classList.remove("active");
  gyroOff.classList.remove("active");

  document.getElementById("gyro-" + value).classList.add("active");
}

// =====================
// PLAYSTYLE EVENTS
// =====================
styleBalanced.addEventListener("click", () => setStyle("balanced"));
styleAggressive.addEventListener("click", () => setStyle("aggressive"));
styleSniper.addEventListener("click", () => setStyle("sniper"));

function setStyle(style) {
  selectedStyle = style;

  styleBalanced.classList.remove("active");
  styleAggressive.classList.remove("active");
  styleSniper.classList.remove("active");

  document.getElementById("style-" + style).classList.add("active");
}

// =====================
// FPS DROPDOWN
// =====================
fpsSelected.addEventListener("click", (e) => {
  e.stopPropagation();
  fpsDropdown.classList.toggle("open");
});

// FPS item click
document.querySelectorAll("#fpsList .dropdown-item").forEach(item => {
  const value = item.getAttribute("data-value");
  if (value === selectedFps) item.classList.add("active");

  item.addEventListener("click", (e) => {
    e.stopPropagation();

    selectedFps = value;
    fpsHidden.value = value;
    fpsSelected.textContent = value + " FPS";

    document.querySelectorAll("#fpsList .dropdown-item")
      .forEach(i => i.classList.remove("active"));

    item.classList.add("active");

    fpsDropdown.classList.remove("open");
  });
});

// =====================
// DEVICE DROPDOWN
// =====================
deviceSelected.addEventListener("click", (e) => {
  e.stopPropagation();
  deviceDropdown.classList.toggle("open");
});

// =====================
// LOAD DEVICES
// =====================
function loadDevices() {
  const list = selectedPlatform === "android" ? androidDevices : iphoneDevices;

  deviceList.innerHTML = `
    <div class="dropdown-item" data-value="auto">
      🤖 Auto-detect device (recommended)
    </div>
  `;

  list.forEach(d => {
    const item = document.createElement("div");
    item.className = "dropdown-item";
    item.dataset.value = d.name;
    item.textContent = d.name;
    deviceList.appendChild(item);
  });

  attachDeviceEvents();
}

// =====================
// DEVICE ITEM CLICK HANDLER
// =====================
function attachDeviceEvents() {
  document.querySelectorAll("#deviceList .dropdown-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();

      const value = item.dataset.value;

      selectedDevice = value;
      deviceSelected.textContent = value === "auto"
        ? "🤖 Auto-detect device (recommended)"
        : value;

      document.querySelectorAll("#deviceList .dropdown-item")
        .forEach(i => i.classList.remove("active"));

      item.classList.add("active");

      deviceDropdown.classList.remove("open");
    });
  });
}

// =====================
// GLOBAL CLICK → CLOSE DROPDOWNS
// =====================
document.addEventListener("click", () => {
  fpsDropdown.classList.remove("open");
  deviceDropdown.classList.remove("open");
});

// =====================
// SMART DEVICE SEARCH
// =====================
searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const platformButtons = document.getElementById("platform-group");

  // When search is cleared
  if (query.trim() === "") {
    platformButtons.style.display = "flex";

    // FIX: restore platform state from UI
    if (platformIOS.classList.contains("active")) {
      selectedPlatform = "ios";
    } else {
      selectedPlatform = "android";
    }

    loadDevices();
    loadDevices();
    
    deviceSelected.textContent = "Select your device model";
    selectedDevice = null;

    deviceDropdown.classList.remove("open");
    return;
  }

  platformButtons.style.display = "none";

  const isIphone = iphoneDevices.some(d => d.name.toLowerCase().includes(query));
  const isAndroid = androidDevices.some(d => d.name.toLowerCase().includes(query));

  if (isIphone) setPlatform("ios");
  else if (isAndroid) setPlatform("android");

  const list = selectedPlatform === "android" ? androidDevices : iphoneDevices;
  const matches = list.filter(d => d.name.toLowerCase().includes(query));

  deviceList.innerHTML = "";

  if (matches.length === 0) {
    deviceList.innerHTML = `
      <div class="dropdown-item disabled">No results found</div>
      <div class="dropdown-item" data-value="auto">
        🤖 Auto-detect device (recommended)
      </div>
    `;
    attachDeviceEvents();
    deviceDropdown.classList.add("open");
    return;
  }

  deviceList.innerHTML = `
    <div class="dropdown-item" data-value="auto">
      🤖 Auto-detect device (recommended)
    </div>
  `;

  matches.forEach(d => {
    const item = document.createElement("div");
    item.className = "dropdown-item";
    item.dataset.value = d.name;
    item.textContent = d.name;
    deviceList.appendChild(item);
  });

  selectedDevice = matches[0].name;
  deviceSelected.textContent = matches[0].name;

  attachDeviceEvents();
  deviceDropdown.classList.add("open");
});


// =====================
// DEVICE FIND
// =====================
function getDevice(name) {
  const all = [...iphoneDevices, ...androidDevices];
  return all.find(d => d.name === name);
}

// =====================
// BASE PROFILES
// =====================
const baseProfile = {
  iphone: {
    camera: { tpp: 110, fpp: 105, tppAim: 95, fppAim: 90, redDot: 55, x2: 35, x3: 25, x4: 20, x6: 12, x8: 10 },
    ads:    { tpp: 95,  fpp: 90,  tppAim: 85, fppAim: 80, redDot: 55, x2: 35, x3: 25, x4: 18, x6: 12, x8: 10 },
    gyro:   { tpp: 330, fpp: 330, tppAim: 300, fppAim: 300, redDot: 320, x2: 280, x3: 240, x4: 190, x6: 120, x8: 90 },
    adsGyro:{ tpp: 300, fpp: 300, tppAim: 280, fppAim: 280, redDot: 300, x2: 250, x3: 200, x4: 150, x6: 100, x8: 80 }
  },

  android: {
    camera: { tpp: 125, fpp: 120, tppAim: 105, fppAim: 100, redDot: 65, x2: 40, x3: 30, x4: 22, x6: 14, x8: 10 },
    ads:    { tpp: 105, fpp: 100, tppAim: 95,  fppAim: 90,  redDot: 60, x2: 40, x3: 30, x4: 22, x6: 14, x8: 10 },
    gyro:   { tpp: 370, fpp: 370, tppAim: 340, fppAim: 340, redDot: 350, x2: 300, x3: 260, x4: 200, x6: 130, x8: 90 },
    adsGyro:{ tpp: 320, fpp: 320, tppAim: 300, fppAim: 300, redDot: 320, x2: 270, x3: 220, x4: 160, x6: 110, x8: 80 }
  }
};

// =====================
// PLAYSTYLE FACTOR
// =====================
function styleFactor() {
  if (selectedStyle === "aggressive") return 1.10;
  if (selectedStyle === "sniper") return 0.90;
  return 1;
}

// =====================
// FORMAT OUTPUT
// =====================
function format(obj) {
  return `
TPP No Scope: ${obj.tpp}%
FPP No Scope: ${obj.fpp}%

TPP Aim: ${obj.tppAim}%
FPP Aim: ${obj.fppAim}%

Red Dot / Holo: ${obj.redDot}%
2x Scope: ${obj.x2}%
3x Scope: ${obj.x3}%
4x Scope: ${obj.x4}%
6x Scope: ${obj.x6}%
8x Scope: ${obj.x8}%
`;
}

// =====================
// RESET
// =====================
resetBtn.addEventListener("click", resetApp);

function resetApp() {
  selectedPlatform = "android";
  selectedDevice = null;
  selectedGyro = "on";
  selectedStyle = "balanced";
  selectedFps = "60";

  document.getElementById("resultScreen").style.display = "none";
  document.getElementById("inputScreen").style.display = "block";

  platformAndroid.classList.add("active");
  platformIOS.classList.remove("active");

  gyroOn.classList.add("active");
  gyroOff.classList.remove("active");

  styleBalanced.classList.add("active");
  styleAggressive.classList.remove("active");
  styleSniper.classList.remove("active");

  fpsHidden.value = "60";
  fpsSelected.textContent = "60 FPS";

  document.querySelectorAll("#fpsList .dropdown-item")
    .forEach(i => {
      i.classList.toggle("active", i.getAttribute("data-value") === "60");
    });

  deviceSelected.textContent = "Select your device model";

  loadDevices();
}

// =====================
// GENERATE
// =====================
generateBtn.addEventListener("click", generate);

function generate() {

  const fps = selectedFps || fpsHidden.value;

  let device = null;
  if (selectedDevice && selectedDevice !== "auto") {
    device = getDevice(selectedDevice);
  }

  const type = selectedPlatform === "ios" ? "iphone" : "android";

  const base = JSON.parse(JSON.stringify(baseProfile[type]));

  const deviceBoost = device ? (device.touchResponse / 100) : 1;

  const finalFactor =
    styleFactor() *
    deviceBoost *
    (fps === "60" ? 1.05 : fps === "120" ? 0.95 : 1);

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

  document.getElementById("inputScreen").style.display = "none";
  document.getElementById("resultScreen").style.display = "block";

  document.getElementById("camera").innerText = format(base.camera);
  document.getElementById("ads").innerText = format(base.ads);

  if (selectedGyro === "on") {
    document.getElementById("gyroResult").innerText = format(base.gyro);
    document.getElementById("adsGyro").innerText = format(base.adsGyro);
  } else {
    document.getElementById("gyroResult").innerText = "Gyro: None";
    document.getElementById("adsGyro").innerText = "Gyro ADS: None";
  }
}

// =====================
loadDevices();
