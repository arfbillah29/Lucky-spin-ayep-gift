// ════════════════════════════════════════════
// DAFTAR TIKET VALID
// Tambah / hapus tiket di sini sesuai kebutuhan
// ════════════════════════════════════════════
const validTickets = new Set([
  "AYEP-001","AYEP-002","AYEP-003","AYEP-004","AYEP-005",
  "AYEP-006","AYEP-007","AYEP-008","AYEP-009","AYEP-010",
  // Tambah lebih banyak di sini...
]);


// ════════════════════════════════════════════
// MANAJEMEN TIKET (localStorage)
// ════════════════════════════════════════════
function getUsedTickets() {
  return JSON.parse(localStorage.getItem("usedTickets") || "[]");
}

function markTicketUsed(code) {
  const used = getUsedTickets();
  used.push(code);
  localStorage.setItem("usedTickets", JSON.stringify(used));
}

function isTicketUsed(code) {
  return getUsedTickets().includes(code);
}


// ════════════════════════════════════════════
// VALIDASI TIKET
// ════════════════════════════════════════════
let currentTicket = null;

function validateTicket() {
  const raw      = document.getElementById("ticketInput").value.trim().toUpperCase();
  const statusEl = document.getElementById("ticket-status");
  const spinBtn  = document.getElementById("spinBtn");

  currentTicket    = null;
  spinBtn.disabled = true;

  if (!raw) {
    statusEl.textContent = "Masukkan kode tiket terlebih dahulu.";
    statusEl.className   = "status-err";
    return;
  }

  if (!validTickets.has(raw)) {
    statusEl.textContent = "❌ Kode tiket tidak valid.";
    statusEl.className   = "status-err";
    return;
  }

  if (isTicketUsed(raw)) {
    statusEl.textContent = "⚠️ Tiket ini sudah pernah digunakan.";
    statusEl.className   = "status-used";
    return;
  }

  // Valid & belum dipakai
  currentTicket        = raw;
  statusEl.textContent = "✅ Tiket valid! Silakan spin.";
  statusEl.className   = "status-ok";
  spinBtn.disabled     = false;
}


// ════════════════════════════════════════════
// WHEEL — Setup
// ════════════════════════════════════════════
const canvas = document.getElementById("wheel");
const ctx    = canvas.getContext("2d");

const segments = [
  "💸 10K","💸 20K","💸 10K","💸 50K",
  "💸 20K","💸 10K","❌ Coba Lagi","💸 20K"
];

const colors = ["#D4AF37", "#111"];
const arc    = Math.PI * 2 / segments.length;
let angle    = 0;
let spinning = false;


// ════════════════════════════════════════════
// WHEEL — Draw
// ════════════════════════════════════════════
function drawWheel() {
  for (let i = 0; i < segments.length; i++) {
    const start = angle + i * arc;
    const end   = start + arc;

    // Segment fill
    ctx.beginPath();
    ctx.fillStyle = colors[i % 2];
    ctx.moveTo(160, 160);
    ctx.arc(160, 160, 150, start, end);
    ctx.fill();

    // Segment border
    ctx.beginPath();
    ctx.strokeStyle = "rgba(212,175,55,0.3)";
    ctx.lineWidth   = 1.5;
    ctx.moveTo(160, 160);
    ctx.arc(160, 160, 150, start, end);
    ctx.closePath();
    ctx.stroke();

    // Segment text
    ctx.save();
    ctx.fillStyle   = "#fff";
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur  = 3;
    ctx.translate(160, 160);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = "right";
    ctx.font      = "bold 13px 'Lato', serif";
    ctx.fillText(segments[i], 138, 5);
    ctx.restore();
  }

  // Center circle
  const grad = ctx.createRadialGradient(160, 160, 0, 160, 160, 22);
  grad.addColorStop(0, "#F7E07A");
  grad.addColorStop(1, "#8B6914");
  ctx.beginPath();
  ctx.arc(160, 160, 22, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
}


// ════════════════════════════════════════════
// WHEEL — Spin
// ════════════════════════════════════════════
function spin() {
  if (spinning || !currentTicket) return;
  spinning = true;
  document.getElementById("spinBtn").disabled = true;

  // Tandai tiket langsung agar tidak bisa double-click
  markTicketUsed(currentTicket);
  currentTicket = null;

  const spinAngle  = Math.random() * 3000 + 4000;
  const duration   = 5000;
  let start        = null;
  const startAngle = angle * 180 / Math.PI;

  function animate(ts) {
    if (!start) start = ts;
    const progress = ts - start;
    const easeOut  = 1 - Math.pow(1 - Math.min(progress / duration, 1), 3);
    const current  = startAngle + spinAngle * easeOut;

    angle = current * Math.PI / 180;
    ctx.clearRect(0, 0, 320, 320);
    drawWheel();

    if (progress < duration) {
      requestAnimationFrame(animate);
    } else {
      finishSpin();
    }
  }

  requestAnimationFrame(animate);
}


// ════════════════════════════════════════════
// WHEEL — Hasil
// ════════════════════════════════════════════
function finishSpin() {
  let deg     = ((angle * 180 / Math.PI) % 360 + 360) % 360;
  let pointer = (360 - deg + 270) % 360;
  let index   = Math.floor(pointer / (360 / segments.length)) % segments.length;

  setTimeout(() => {
    showModal(segments[index]);
    spinning = false;

    // Reset UI
    document.getElementById("ticketInput").value        = "";
    document.getElementById("ticket-status").textContent = "Tiket berhasil digunakan.";
    document.getElementById("ticket-status").className   = "status-used";
  }, 300);
}


// ════════════════════════════════════════════
// MODAL
// ════════════════════════════════════════════
function showModal(prize) {
  document.getElementById("modal-prize").textContent = prize;
  document.getElementById("modal").classList.add("show");
}

function closeModal() {
  document.getElementById("modal").classList.remove("show");
}


// ════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════
drawWheel();
