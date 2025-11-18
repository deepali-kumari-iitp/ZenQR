const qrText = document.getElementById("qrText");
const qrSize = document.getElementById("qrSize");
const fgColor = document.getElementById("fgColor");
const bgColor = document.getElementById("bgColor");
const generateBtn = document.getElementById("generateBtn");
const qrImage = document.getElementById("qrImage");
const logoInput = document.getElementById("logoInput");
const logoPreview = document.getElementById("logoPreview");
const removeLogoBtn = document.getElementById("removeLogoBtn");   // ⭐ IMPORTANT
const downloadBtn = document.getElementById("downloadBtn");
const copyBtn = document.getElementById("copyBtn");
const saveHistoryBtn = document.getElementById("saveHistoryBtn");
const whatsappShare = document.getElementById("whatsappShare");
const emailShare = document.getElementById("emailShare");
const status = document.getElementById("status");
const historyGrid = document.getElementById("history");
const themeToggle = document.getElementById("themeToggle");
const hiddenCanvas = document.getElementById("hiddenCanvas");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

let latest = null;
let logoData = null;


// Build QR URL
function buildQR(text, size, fg, bg) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&color=${fg.replace("#","")}&bgcolor=${bg.replace("#","")}&data=${encodeURIComponent(text)}`;
}


// Generate QR
generateBtn.addEventListener("click", () => {
  const text = qrText.value.trim();
  if (!text) return status.textContent = "Enter text first.";

  const size = qrSize.value;
  const fg = fgColor.value;
  const bg = bgColor.value;

  const url = buildQR(text, size, fg, bg);

  qrImage.src = url;
  qrImage.crossOrigin = "anonymous";

  if (logoData) {
    logoPreview.src = logoData;
    logoPreview.style.display = "block";
  } else {
    logoPreview.style.display = "none";
  }

  latest = { text, size, fg, bg, url, logo: logoData };

  downloadBtn.disabled = false;
  copyBtn.disabled = false;
  saveHistoryBtn.disabled = false;

  status.textContent = "QR Generated!";
});


// Logo Upload (SHOW remove button)
logoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    logoData = reader.result;
    logoPreview.src = logoData;
    logoPreview.style.display = "block";
    removeLogoBtn.style.display = "block";    // ⭐ SHOW REMOVE BUTTON
  };
  reader.readAsDataURL(file);
});


// Remove Logo (CLEAR everything)
removeLogoBtn.addEventListener("click", () => {
  logoData = null;
  logoInput.value = "";
  logoPreview.style.display = "none";
  removeLogoBtn.style.display = "none";
  status.textContent = "Logo removed.";
});


// Download QR
downloadBtn.addEventListener("click", async () => {
  const img = await fetch(latest.url);
  const blob = await img.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ZenQR.png";
  a.click();
});


// Copy QR text
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(latest.text);
    status.textContent = "QR text copied!";
  } catch {
    status.textContent = "Copy failed!";
  }
});


// WhatsApp Share (text only)
whatsappShare.addEventListener("click", () => {
  const url = `https://wa.me/?text=${encodeURIComponent(latest.text)}`;
  window.open(url, "_blank");
});


// Email share
emailShare.addEventListener("click", () => {
  window.location.href = `mailto:?subject=QR Code&body=${encodeURIComponent(latest.text)}`;
});


// Save to History
saveHistoryBtn.addEventListener("click", () => {
  let history = JSON.parse(localStorage.getItem("zenqr_history") || "[]");

  history.unshift({ id: Date.now(), thumb: latest.url });
  localStorage.setItem("zenqr_history", JSON.stringify(history));

  loadHistory();
});


// Load history items
function loadHistory() {
  let history = JSON.parse(localStorage.getItem("zenqr_history") || "[]");
  historyGrid.innerHTML = "";

  history.forEach(item => {
    const div = document.createElement("div");
    div.className = "historyItem";
    div.innerHTML = `<img src="${item.thumb}" />`;
    historyGrid.appendChild(div);
  });
}

loadHistory();


// Clear history
clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem("zenqr_history");
  loadHistory();
});


// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
});
