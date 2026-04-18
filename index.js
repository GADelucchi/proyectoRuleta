const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultEl = document.getElementById('result');
const logoImg = document.getElementById('companyLogo');
const logoFallback = document.getElementById('logoFallback');

const W = 460;
const CX = W / 2;
const CY = W / 2;
const R = 190;

const SECTORS = [
  { label: 'Vidrio templado', color: '#1565C0', text: '#fff' },
  { label: 'Vidrio templado', color: '#E8272A', text: '#fff' },
  { label: 'Vidrio templado', color: '#2E7D32', text: '#fff' },
  { label: 'Vidrio templado', color: '#6A1B9A', text: '#fff' },
  { label: '-40%', color: '#111111', text: '#FFD600' },
  { label: 'Vidrio templado', color: '#FFD600', text: '#000' },
  { label: 'Vidrio templado', color: '#0277BD', text: '#fff' },
  { label: 'Vidrio templado', color: '#F57C00', text: '#fff' },
  { label: 'Vidrio templado', color: '#C62828', text: '#fff' },
  { label: 'Funda', color: '#e0e0e0', text: '#111' }
];

const N = SECTORS.length;
const SLICE = (2 * Math.PI) / N;

let angle = 0;
let vel = 0;
let spinning = false;

function getSector(rot) {
  const pointerAngle = ((-Math.PI / 2 - rot) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  return SECTORS[Math.floor(pointerAngle / SLICE) % N];
}

function wrapText(text, maxWidth) {
  const words = text.split(' ');
  if (words.length === 1) return [text];

  const lines = [];
  let line = '';

  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function drawWheel(rot) {
  ctx.clearRect(0, 0, W, W);

  ctx.save();
  ctx.beginPath();
  ctx.arc(CX, CY, R + 8, 0, 2 * Math.PI);
  ctx.strokeStyle = '#2e3642';
  ctx.lineWidth = 12;
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 14;
  ctx.stroke();
  ctx.restore();

  for (let i = 0; i < N; i++) {
    const start = rot + i * SLICE;
    const end = start + SLICE;
    const mid = start + SLICE / 2;
    const sector = SECTORS[i];

    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, R, start, end);
    ctx.closePath();
    ctx.fillStyle = sector.color;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, R, start, end);
    ctx.closePath();
    ctx.strokeStyle = '#050505';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(mid);
    ctx.translate(R * 0.63, 0);
    ctx.rotate(Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = sector.text;
    ctx.font = 'bold 11.5px "Avenir Next", "Montserrat", sans-serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 3;

    const lines = wrapText(sector.label, 66);
    const lineH = 14;
    const totalH = lines.length * lineH;
    lines.forEach((lineText, index) => {
      ctx.fillText(lineText, 0, -totalH / 2 + index * lineH + lineH * 0.75);
    });
    ctx.restore();
  }

  for (let i = 0; i < N; i++) {
    const a = rot + i * SLICE;
    ctx.save();
    ctx.beginPath();
    ctx.arc(CX + (R + 1) * Math.cos(a), CY + (R + 1) * Math.sin(a), 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.restore();
  }

  const pointerY = CY - R - 6;
  ctx.save();
  ctx.translate(CX, pointerY);
  ctx.beginPath();
  ctx.moveTo(0, 22);
  ctx.lineTo(-13, -4);
  ctx.lineTo(13, -4);
  ctx.closePath();
  ctx.fillStyle = '#E8272A';
  ctx.shadowColor = '#E8272A';
  ctx.shadowBlur = 18;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

function showResult() {
  const sector = getSector(angle);
  resultEl.textContent = '▶ ' + sector.label.toUpperCase();
  resultEl.style.color = sector.color === '#111111'
    ? '#FFD600'
    : sector.color === '#e0e0e0'
      ? '#c8ccd4'
      : sector.color;
}

function spin() {
  if (spinning) return;
  resultEl.textContent = '';
  spinBtn.disabled = true;
  vel = Math.random() * 0.28 + 0.22;
  spinning = true;
}

function frame() {
  if (spinning) {
    angle += vel;
    vel *= 0.987;

    if (vel < 0.003) {
      vel = 0;
      spinning = false;
      spinBtn.disabled = false;
      showResult();
    }
  }

  drawWheel(angle);
  requestAnimationFrame(frame);
}

spinBtn.addEventListener('click', spin);

if (logoImg && logoFallback) {
  logoImg.addEventListener('error', () => {
    logoImg.style.display = 'none';
    logoFallback.style.display = 'block';
  });
}

drawWheel(angle);
frame();
