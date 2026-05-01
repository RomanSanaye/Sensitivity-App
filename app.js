// ======== 🎮 PUBG MOBILE SENSITIVITY ENGINE (AI v3 + AIM FIX) ========

import { iphoneDevices, androidDevices } from "./data.js";

// =====================
// STATE
// =====================
let selectedPlatform = "android";
let selectedDevice = null;
let selectedGyro = "on";
let selectedStyle = "balanced";

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

window.setGyro = function (value) {
selectedGyro = value;

document.getElementById("gyro-on").classList.remove("active");
document.getElementById("gyro-off").classList.remove("active");

document.getElementById("gyro-" + value).classList.add("active");
};

window.setStyle = function (style) {
selectedStyle = style;

["balanced", "aggressive", "sniper"].forEach(s => {
document.getElementById("style-" + s).classList.remove("active");
});

document.getElementById("style-" + style).classList.add("active");
};

// =====================
// LOAD DEVICES
// =====================
function loadDevices() {
const select = document.getElementById("deviceModel");

select.innerHTML = `     <option value="" disabled selected hidden>Select your device model</option>     <option value="auto">🤖 Auto-detect device (recommended)</option>
  `;

const list =
selectedPlatform === "android" ? androidDevices : iphoneDevices;

list.forEach((d) => {
const option = document.createElement("option");
option.value = d.name;
option.textContent = d.name;
select.appendChild(option);
});

selectedDevice = null;
}

// =====================
// SMART DEVICE SEARCH
// =====================
document.getElementById("phone").addEventListener("input", function () {
const query = this.value.toLowerCase();
const select = document.getElementById("deviceModel");

const platformButtons = document.getElementById("platform-group");

// 🔥 Show/hide platform buttons (direct style)
if (query.trim() === "") {
  platformButtons.style.display = "flex";   // back to normal layout
} else {
  platformButtons.style.display = "none";   // completely removed from layout
}


const isIphone = iphoneDevices.some(d => d.name.toLowerCase().includes(query));
const isAndroid = androidDevices.some(d => d.name.toLowerCase().includes(query));

if (isIphone) {
selectedPlatform = "ios";
document.getElementById("platform-android").classList.remove("active");
document.getElementById("platform-ios").classList.add("active");
} else if (isAndroid) {
selectedPlatform = "android";
document.getElementById("platform-ios").classList.remove("active");
document.getElementById("platform-android").classList.add("active");
}

const list =
selectedPlatform === "android" ? androidDevices : iphoneDevices;

select.innerHTML = `     <option value="" disabled hidden>Select your device model</option>     <option value="auto">🤖 Auto-detect device (recommended)</option>
  `;

const matches = list.filter(d => d.name.toLowerCase().includes(query));

if (matches.length === 0) {
const option = document.createElement("option");
option.disabled = true;
option.textContent = "No results found";
select.appendChild(option);
select.size = 3;
return;
}

matches.forEach(d => {
const option = document.createElement("option");
option.value = d.name;
option.textContent = d.name;
select.appendChild(option);
});

select.value = matches[0].name;
selectedDevice = matches[0].name;

select.size = Math.min(matches.length + 2, 6);
});

document.addEventListener("click", () => {
document.getElementById("deviceModel").size = 1;
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
window.resetApp = function () {
selectedPlatform = "android";
selectedDevice = null;
selectedGyro = "on";
selectedStyle = "balanced";

// 🔥 SWITCH BACK TO INPUT SCREEN
document.getElementById("resultScreen").style.display = "none";
document.getElementById("inputScreen").style.display = "block";

document.querySelectorAll(".active").forEach(el => {
el.classList.remove("active");
});

document.getElementById("platform-android").classList.add("active");
document.getElementById("gyro-on").classList.add("active");
document.getElementById("style-balanced").classList.add("active");

loadDevices();
};

// =====================
// GENERATE
// =====================
window.generate = function () {

const fps = document.getElementById("fps").value;

let device = null;
if (selectedDevice && selectedDevice !== "auto") {
device = getDevice(selectedDevice);
}

const type = selectedPlatform;
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

// 🔥 SWITCH TO RESULT SCREEN
document.getElementById("inputScreen").style.display = "none";
document.getElementById("resultScreen").style.display = "block";

// OUTPUT
document.getElementById("camera").innerText = format(base.camera);
document.getElementById("ads").innerText = format(base.ads);

if (selectedGyro === "on") {
document.getElementById("gyroResult").innerText = format(base.gyro);
document.getElementById("adsGyro").innerText = format(base.adsGyro);
} else {
document.getElementById("gyroResult").innerText = "Gyro: None";
document.getElementById("adsGyro").innerText = "Gyro ADS: None";
}
};

// SERVICE WORKER REGISTRATION
// if ("serviceWorker" in navigator) {
// window.addEventListener("load", () => {
// navigator.serviceWorker
// .register("/service-worker.js")
// .then((reg) => {
// console.log("Service Worker registered:", reg.scope);
// })
// .catch((err) => {
// console.log("Service Worker failed:", err);
// });
// });
// }

// =====================
loadDevices();
