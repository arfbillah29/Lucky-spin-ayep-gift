const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const btn = document.getElementById("spinBtn");

const segments = [
    "💸 10K","💸 20K","💸 10K","💸 50K",
    "💸 20K","💸 10K","❌ Coba Lagi","💸 20K"
];

const colors = ["#D4AF37", "#111"];
const arc = Math.PI * 2 / segments.length;

let angle = 0;
let spinning = false;

/* Gambar roda */
function drawWheel() {
    for (let i = 0; i < segments.length; i++) {
        const start = angle + i * arc;
        const end = start + arc;

        ctx.beginPath();
        ctx.fillStyle = colors[i % 2];
        ctx.moveTo(160,160);
        ctx.arc(160,160,150,start,end);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = "white";
        ctx.translate(160,160);
        ctx.rotate(start + arc/2);
        ctx.textAlign = "right";
        ctx.font = "bold 14px serif";
        ctx.fillText(segments[i], 130, 5);
        ctx.restore();
    }
}

/* Spin */
function spin() {
    if (spinning) return;
    spinning = true;

    let spinAngle = Math.random() * 3000 + 4000;
    let duration = 4000;
    let start = null;

    function animate(timestamp) {
        if (!start) start = timestamp;
        let progress = timestamp - start;

        let easeOut = 1 - Math.pow(1 - progress / duration, 3);
        let currentAngle = spinAngle * easeOut;

        angle = currentAngle * Math.PI / 180;

        ctx.clearRect(0,0,320,320);
        drawWheel();

        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            finishSpin();
        }
    }

    requestAnimationFrame(animate);
}

/* Hasil */
function finishSpin() {
    let deg = (angle * 180 / Math.PI + 90);
    let index = Math.floor(
        (segments.length - (deg % 360) / (360 / segments.length)) 
        % segments.length
    );

    setTimeout(() => {
        alert("🎉 Kamu dapat: " + segments[index]);
        spinning = false;
    }, 300);
}

/* Event tombol */
btn.addEventListener("click", spin);

drawWheel();
