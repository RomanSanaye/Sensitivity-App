// ======== 🎮 PUBG MOBILE SENSITIVITY ENGINE (AI v3 + AIM FIX) ========

import { iphoneDevices, androidDevices } from "./data.js";

// =====================
// STATE
// =====================
let selectedPlatform = "android";
let selectedDevice = null;
let selectedGyro = "on";
let selectedStyle = "balanced";
let selectedFps = "60";

let currentMode = "generate";
let currentSavedIndex = null;

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

const saveBtn = document.getElementById("saveBtn");
const openSavedBtn = document.getElementById("openSavedBtn");

// =====================
// PLATFORM EVENTS
// =====================
platformAndroid.addEventListener("click", () => setPlatform("android"));
platformIOS.addEventListener("click", () => setPlatform("ios"));

function setPlatform(type) {
  selectedPlatform = type;
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
// DEVICE CLICK
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
// GLOBAL CLOSE
// =====================
document.addEventListener("click", () => {
  fpsDropdown.classList.remove("open");
  deviceDropdown.classList.remove("open");
});

// =====================
// SMART SEARCH
// =====================
searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const platformButtons = document.getElementById("platform-group");

  if (query.trim() === "") {
    platformButtons.style.display = "flex";

    if (platformIOS.classList.contains("active")) {
      selectedPlatform = "ios";
    } else {
      selectedPlatform = "android";
    }

    loadDevices(); // Removed duplicate call
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
// BASE PROFILE
// =====================
const baseProfile = {
  iphone: {
    camera: { tpp: 110, fpp: 105, tppAim: 95, fppAim: 90, redDot: 55, x2: 35, x3: 25, x4: 20, x6: 12, x8: 10 },
    ads: { tpp: 95, fpp: 90, tppAim: 85, fppAim: 80, redDot: 55, x2: 35, x3: 25, x4: 18, x6: 12, x8: 10 },
    gyro: { tpp: 330, fpp: 330, tppAim: 300, fppAim: 300, redDot: 320, x2: 280, x3: 240, x4: 190, x6: 120, x8: 90 },
    adsGyro: { tpp: 300, fpp: 300, tppAim: 280, fppAim: 280, redDot: 300, x2: 250, x3: 200, x4: 150, x6: 100, x8: 80 }
  },
  android: {
    camera: { tpp: 125, fpp: 120, tppAim: 105, fppAim: 100, redDot: 65, x2: 40, x3: 30, x4: 22, x6: 14, x8: 10 },
    ads: { tpp: 105, fpp: 100, tppAim: 95, fppAim: 90, redDot: 60, x2: 40, x3: 30, x4: 22, x6: 14, x8: 10 },
    gyro: { tpp: 370, fpp: 370, tppAim: 340, fppAim: 340, redDot: 350, x2: 300, x3: 260, x4: 200, x6: 130, x8: 90 },
    adsGyro: { tpp: 320, fpp: 320, tppAim: 300, fppAim: 300, redDot: 320, x2: 270, x3: 220, x4: 160, x6: 110, x8: 80 }
  }
};

// =====================
// STYLE FACTOR
// =====================
function styleFactor() {
  if (selectedStyle === "aggressive") return 1.10;
  if (selectedStyle === "sniper") return 0.90;
  return 1;
}

// =====================
// FORMAT
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
// RESET APP
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
  document.getElementById("platform-group").style.display = "flex";

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

  // Clear search input
  if (searchInput) {
    searchInput.value = "";
  }

  loadDevices();

  currentMode = "generate";
  currentSavedIndex = null;
  
  updateResultButton();
}

// =====================
// GENERATE SENSITIVITY
// =====================
generateBtn.addEventListener("click", generate);

// =====================
// GENERATE SENSITIVITY
// =====================
generateBtn.addEventListener("click", generate);

function generate() {
  // Check if device is selected
  if (!selectedDevice || selectedDevice === null) {
    showNotification("⚠ Please select or search for your device first!", "#ff4d4d");
    return;
  }

  const fps = selectedFps || fpsHidden.value;
  let device = null;
  
  if (selectedDevice && selectedDevice !== "auto") {
    device = getDevice(selectedDevice);
  }

  const type = selectedPlatform === "ios" ? "iphone" : "android";
  const base = JSON.parse(JSON.stringify(baseProfile[type]));
  const deviceBoost = device ? (device.touchResponse / 100) : 1;
  const finalFactor = styleFactor() * deviceBoost * (fps === "60" ? 1.05 : fps === "120" ? 0.95 : 1);

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

  currentMode = "generate";
  currentSavedIndex = null;
  updateResultButton();
}

// Helper function to show notification
function showNotification(message, color) {
  // Check if notification already exists
  let notification = document.getElementById("deviceNotification");
  
  if (notification) {
    notification.remove();
  }
  
  // Create notification element
  notification = document.createElement("div");
  notification.id = "deviceNotification";
  notification.innerHTML = message;
  notification.style.cssText = `
    background: ${color};
    color: white;
    padding: 12px;
    border-radius: 10px;
    margin-top: 10px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    animation: fadeInUp 0.3s ease;
    border: 1px solid rgba(255,255,255,0.2);
  `;
  
  // Insert notification after the generate button
  const generateBtn = document.getElementById("generateBtn");
  generateBtn.parentNode.insertBefore(notification, generateBtn.nextSibling);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification) {
      notification.style.animation = "fadeOutDown 0.3s ease";
      setTimeout(() => {
        if (notification) notification.remove();
      }, 300);
    }
  }, 3000);
}

// =====================
// SAVE / DELETE HANDLER
// =====================
saveBtn.addEventListener("click", () => {
  if (currentMode === "saved") {
    deleteSaved();
  } else {
    saveSensitivity();
  }
});

// =====================
// DELETE SAVED
// =====================
function deleteSaved() {
  let saved = JSON.parse(localStorage.getItem("sensitivities")) || [];

  if (currentSavedIndex === null) return;

  saved.splice(currentSavedIndex, 1);
  localStorage.setItem("sensitivities", JSON.stringify(saved));

  const modal = document.getElementById("saveModal");
  const modalMessage = document.getElementById("modalMessage");
  const input = document.getElementById("saveNameInput");
  const confirmBtn = document.getElementById("confirmSaveBtn");
  const cancelBtn = document.getElementById("cancelSaveBtn");

  input.style.display = "none";
  confirmBtn.style.display = "none";
  cancelBtn.style.display = "none";

  modalMessage.innerText = "🗑 Deleted successfully!";
  modal.style.display = "flex";

  setTimeout(() => {
    modal.style.display = "none";
    input.style.display = "block";
    confirmBtn.style.display = "block";
    cancelBtn.style.display = "block";
    modalMessage.innerText = "";
    goToSavedListAfterDelete();
  }, 800);
}

// =====================
// GO TO SAVED LIST AFTER DELETE
// =====================
function goToSavedListAfterDelete() {
  document.getElementById("resultScreen").style.display = "none";
  document.getElementById("inputScreen").style.display = "block";
  showSaved();
  currentMode = "generate";
  currentSavedIndex = null;
  updateResultButton();
}

// =====================
// SAVE SENSITIVITY
// =====================
// =====================
// SAVE SENSITIVITY
// =====================
function saveSensitivity() {
  const modal = document.getElementById("saveModal");
  const input = document.getElementById("saveNameInput");
  const confirmBtn = document.getElementById("confirmSaveBtn");
  const cancelBtn = document.getElementById("cancelSaveBtn");
  const modalMessage = document.getElementById("modalMessage");
  const modalTitle = document.querySelector("#saveModal .modal-box h2");

  // Reset UI - show everything
  input.style.display = "block";
  confirmBtn.style.display = "block";
  cancelBtn.style.display = "block";
  if (modalTitle) modalTitle.style.display = "block";
  modalMessage.innerText = "";
  modalMessage.style.color = "#00ffcc";

  modal.style.display = "flex";
  input.value = "";
  input.focus();

  // Remove existing listeners to prevent duplicates
  const newConfirmBtn = confirmBtn.cloneNode(true);
  const newCancelBtn = cancelBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
  
  // Update references
  const newConfirm = newConfirmBtn;
  const newCancel = newCancelBtn;

  newCancel.onclick = () => {
    modal.style.display = "none";
    // Restore original content
    input.style.display = "block";
    confirmBtn.style.display = "block";
    cancelBtn.style.display = "block";
    if (modalTitle) modalTitle.style.display = "block";
    modalMessage.innerText = "";
  };

  newConfirm.onclick = () => {
    const name = input.value;
    if (!name || name.trim() === "") {
      modalMessage.innerText = "⚠ Please enter a name!";
      modalMessage.style.color = "#ff4d4d";
      return;
    }

    let saved = JSON.parse(localStorage.getItem("sensitivities")) || [];

    const data = {
      name: name.trim(),
      settings: {
        platform: selectedPlatform,
        fps: selectedFps,
        gyro: selectedGyro,
        style: selectedStyle,
        device: selectedDevice
      },
      result: {
        camera: document.getElementById("camera").innerText,
        ads: document.getElementById("ads").innerText,
        gyro: document.getElementById("gyroResult").innerText,
        adsGyro: document.getElementById("adsGyro").innerText
      }
    };

    saved.push(data);
    localStorage.setItem("sensitivities", JSON.stringify(saved));

    // HIDE input and buttons - show ONLY the success message
    input.style.display = "none";
    newConfirm.style.display = "none";
    newCancel.style.display = "none";
    if (modalTitle) modalTitle.style.display = "none";
    
    modalMessage.innerText = "✅ Saved successfully!";
    modalMessage.style.color = "#00ffcc";
    modalMessage.style.fontSize = "18px";
    modalMessage.style.padding = "20px";
    modalMessage.style.margin = "0";

    // Close modal after delay
    setTimeout(() => {
      modal.style.display = "none";
      // Restore for next time
      input.style.display = "block";
      newConfirm.style.display = "block";
      newCancel.style.display = "block";
      if (modalTitle) modalTitle.style.display = "block";
      modalMessage.innerText = "";
      modalMessage.style.fontSize = "";
      modalMessage.style.padding = "";
    }, 1500);
  };
}

// =====================
// SHOW SAVED LIST
// =====================
openSavedBtn.addEventListener("click", showSaved);

function showSaved() {
  const container = document.getElementById("savedContainer");
  const listDiv = document.getElementById("savedList");

  container.style.display = "block";
  
  let saved = JSON.parse(localStorage.getItem("sensitivities")) || [];

  // Remove existing close button
  const existingCloseBtn = container.querySelector(".close-saved-btn");
  if (existingCloseBtn) {
    existingCloseBtn.remove();
  }

  // Create close button
  const closeBtn = document.createElement("button");
  closeBtn.className = "close-saved-btn";
  closeBtn.innerHTML = "✕";
  closeBtn.setAttribute("aria-label", "Close");
  
  closeBtn.style.cssText = `
    position: absolute;
    top: 15px;
    right: 15px;
    width: 30px;
    height: 30px;
    background: transparent;
    color: #00ffcc;
    border: 1px solid #00ffcc;
    border-radius: 50%;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    padding: 0;
    z-index: 1001;
  `;
  
  closeBtn.onmouseover = () => {
    closeBtn.style.background = "#00ffcc";
    closeBtn.style.color = "black";
    closeBtn.style.transform = "scale(1.05)";
  };
  
  closeBtn.onmouseout = () => {
    closeBtn.style.background = "transparent";
    closeBtn.style.color = "#00ffcc";
    closeBtn.style.transform = "scale(1)";
  };
  
  closeBtn.onclick = () => {
    container.style.display = "none";
  };
  
  container.appendChild(closeBtn);

  if (saved.length === 0) {
    listDiv.innerHTML = `
      <p style="text-align: center; padding: 20px; color: #888;">📭 No saved sensitivities yet.</p>
    `;
    return;
  }

  listDiv.innerHTML = saved.map((item, index) => {
    return `
      <div class="card saved-item" data-index="${index}" style="margin:10px 0; padding:12px; cursor:pointer; background: #141414; border: 1px solid #222; border-radius: 10px; transition: all 0.2s; position: relative;">
        <h3 style="margin: 0 0 5px 0; color: #00ffcc; font-size: 16px;">📌 ${escapeHtml(item.name)}</h3>
        <p style="margin: 0; color: #aaa; font-size: 12px;">
          ${item.settings.platform.toUpperCase()} • ${item.settings.fps} FPS • ${item.settings.style}
        </p>
      </div>
    `;
  }).join("");

  // Add hover effects and click handlers
  document.querySelectorAll(".saved-item").forEach(item => {
    item.addEventListener("mouseover", () => {
      item.style.background = "#1a1a1a";
      item.style.borderColor = "#00ffcc";
      item.style.transform = "translateX(3px)";
    });
    item.addEventListener("mouseout", () => {
      item.style.background = "#141414";
      item.style.borderColor = "#222";
      item.style.transform = "translateX(0)";
    });
    item.addEventListener("click", () => {
      const index = item.getAttribute("data-index");
      loadSaved(index);
      container.style.display = "none";
    });
  });
}

// Helper function to prevent XSS attacks
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// =====================
// LOAD SAVED SENSITIVITY
// =====================
function loadSaved(index) {
  let saved = JSON.parse(localStorage.getItem("sensitivities")) || [];
  const item = saved[index];

  if (!item) return;

  selectedPlatform = item.settings.platform;
  selectedFps = item.settings.fps;
  selectedGyro = item.settings.gyro;
  selectedStyle = item.settings.style;
  selectedDevice = item.settings.device;

  document.getElementById("savedContainer").style.display = "none";
  document.getElementById("inputScreen").style.display = "none";
  document.getElementById("resultScreen").style.display = "block";

  document.getElementById("camera").innerText = item.result.camera;
  document.getElementById("ads").innerText = item.result.ads;
  document.getElementById("gyroResult").innerText = item.result.gyro;
  document.getElementById("adsGyro").innerText = item.result.adsGyro;

  currentMode = "saved";
  currentSavedIndex = index;
  updateResultButton();
}

// =====================
// UPDATE BUTTON TEXT
// =====================
function updateResultButton() {
  if (currentMode === "saved") {
    saveBtn.innerText = "🗑 Delete";
  } else {
    saveBtn.innerText = "💾 Save Sensitivity";
  }
}

// =====================
// GO HOME
// =====================
function goHome() {
  document.getElementById("resultScreen").style.display = "none";
  document.getElementById("inputScreen").style.display = "block";
  document.getElementById("savedContainer").style.display = "none";
  document.getElementById("savedList").innerHTML = "";

  document.getElementById("platform-group").style.display = "flex";
  
  // Clear search input
  if (searchInput) {
    searchInput.value = "";
  }
  
  // Reset device dropdown
  deviceSelected.textContent = "Select your device model";
  selectedDevice = null;
  
  // Reload devices to reset the list
  loadDevices();

  currentMode = "generate";
  currentSavedIndex = null;
  updateResultButton();
}

// =====================
// INITIALIZE
// =====================
loadDevices();