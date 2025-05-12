// Обратный отсчёт до 12 июля 2025 года
const countdown = document.getElementById('countdown');
const weddingDate = new Date('2025-07-12T15:00:00');

function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;
    if (diff <= 0) {
        countdown.textContent = 'Свадьба уже началась!';
        return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    countdown.textContent = `До свадьбы осталось: ${days} д. ${hours} ч. ${minutes} м. ${seconds} с.`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Плавное появление (на всякий случай, если потребуется для других элементов)
document.addEventListener('DOMContentLoaded', () => {
    const fadeEls = document.querySelectorAll('.fade-in');
    fadeEls.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('show');
        }, i * 700);
    });
    // Плавное появление анимированного фона
    setTimeout(() => {
        const bg = document.querySelector('.animated-bg');
        if(bg) bg.classList.add('show');
        // Плавное появление SVG-иллюстраций
        document.querySelectorAll('.wedding-bg-svg').forEach((svg, i) => {
            setTimeout(() => svg.classList.add('show'), 600 + i * 400);
        });
    }, 300);
});

// Управление музыкой
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');
if (music && musicBtn) {
    let isPlaying = false;
    // Скрываем кнопку, если браузер разрешил автозапуск
    music.addEventListener('play', () => {
        isPlaying = true;
        musicBtn.textContent = 'Пауза';
    });
    music.addEventListener('pause', () => {
        isPlaying = false;
        musicBtn.textContent = 'Включить музыку';
    });
    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            music.pause();
        } else {
            music.play();
        }
    });
    // Если музыка не играет из-за политики браузера, кнопка будет видна
    if (music.paused) {
        musicBtn.style.display = 'block';
    } else {
        musicBtn.style.display = 'none';
    }
    // Показываем кнопку только если музыка не играет
    setTimeout(() => {
        if (music.paused) {
            musicBtn.style.display = 'block';
        } else {
            musicBtn.style.display = 'none';
        }
    }, 1000);
}

// Кнопка "Наверх"
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Открытие и закрытие секретного модального окна через надпись 'Жених'
const secretBtn = document.getElementById('secret-btn');
const secretModal = document.getElementById('secret-modal');
const closeSecretModal = document.getElementById('close-secret-modal');

if (secretBtn && secretModal && closeSecretModal) {
    secretBtn.addEventListener('click', () => {
        secretModal.style.display = 'flex';
    });
    closeSecretModal.addEventListener('click', () => {
        secretModal.style.display = 'none';
    });
    // Закрытие по клику вне окна
    secretModal.addEventListener('click', (e) => {
        if (e.target === secretModal) {
            secretModal.style.display = 'none';
        }
    });
}

// Движение надписи 'Жених' в противоположную от курсора сторону
const secretBtnMove = document.getElementById('secret-btn');
if (secretBtnMove) {
    secretBtnMove.addEventListener('mousemove', (e) => {
        const rect = secretBtnMove.getBoundingClientRect();
        // Центр надписи
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // Вектор от центра к курсору
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        // Смещение в противоположную сторону, с увеличенной силой
        const maxOffset = 48; // пикселей
        let moveX = -dx * 0.35;
        let moveY = -dy * 0.35;
        // Ограничиваем максимальное смещение
        moveX = Math.max(Math.min(moveX, maxOffset), -maxOffset);
        moveY = Math.max(Math.min(moveY, maxOffset), -maxOffset);
        secretBtnMove.style.transition = '';
        secretBtnMove.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    secretBtnMove.addEventListener('mouseleave', () => {
        secretBtnMove.style.transition = 'transform 0.5s cubic-bezier(.23,1.02,.32,1)';
        secretBtnMove.style.transform = '';
        // Сброс transition после завершения анимации
        setTimeout(() => {
            secretBtnMove.style.transition = '';
        }, 500);
    });
}

// --- Колесо фортуны с анимацией и однократным вращением ---
const fortuneBtn = document.getElementById('fortune-btn');
const fortuneWheel = document.getElementById('fortune-wheel');

const fortuneTasks = [
  { lines: ['Селфи', 'с невестой'], radius: 110, fontSize: 12, lineHeight: 26 },
  { lines: ['Танец', 'с женихом'], radius: 110, fontSize: 12, lineHeight: 18 },
  { lines: ['Необычное', 'со стола'], radius: 110, fontSize: 12, lineHeight: 18 },
  { lines: ['Сердце', 'на салфетке'], radius: 110, fontSize: 12, lineHeight: 18 },
  { lines: ['Спой песню'], radius: 110, fontSize: 12, lineHeight: 18 },
  { lines: ['Фото с', '3 гостями'], radius: 110, fontSize: 12, lineHeight: 26 },
  { lines: ['Бутылка', 'со стола'], radius: 110, fontSize: 12, lineHeight: 18 },
  { lines: ['Изобрази', '«любовь»'], radius: 110, fontSize: 12, lineHeight: 18 },
  { lines: ['Рифма к', '«свадьба»'], radius: 110, fontSize: 12, lineHeight: 18 },
  { lines: ['Танец с', 'тестем/тёщей'], radius: 110, fontSize: 12, lineHeight: 26 }
];

// Функция для автоматического переноса длинных надписей на две строки
function splitToTwoLines(text) {
    const words = text.split(' ');
    if (words.length <= 2) return [text];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

let fortuneSpun = false;
if (fortuneBtn && fortuneWheel) {
    fortuneBtn.addEventListener('click', () => {
        if (fortuneSpun) return;
        fortuneSpun = true;
        fortuneBtn.disabled = true;
        fortuneBtn.style.opacity = '0.5';
        const n = fortuneTasks.length;
        // Случайный сектор (для расчёта угла)
        const sector = Math.floor(Math.random() * n);
        const baseTurns = 5 + Math.random() * 3; // 5-8 оборотов
        const finalAngle = - (360/n)*sector;
        const totalRotate = baseTurns*360 + finalAngle;
        // Анимация вращения
        const shake = () => {
            fortuneWheel.style.transition = 'transform 0.12s cubic-bezier(.5,1.7,.7,1)';
            fortuneWheel.style.transform = `rotate(${totalRotate + 4}deg)`;
            setTimeout(() => {
                fortuneWheel.style.transform = `rotate(${totalRotate - 3}deg)`;
                setTimeout(() => {
                    fortuneWheel.style.transform = `rotate(${totalRotate}deg)`;
                    setTimeout(() => {
                        const style = window.getComputedStyle(fortuneWheel);
                        const transform = style.transform || style.webkitTransform;
                        let angle = 0;
                        if (transform && transform !== 'none') {
                            const values = transform.split('(')[1].split(')')[0].split(',');
                            const a = parseFloat(values[0]);
                            const b = parseFloat(values[1]);
                            angle = Math.atan2(b, a) * (180/Math.PI);
                        }
                        if (angle < 0) angle += 360;
                        const sectorAngle = 360 / n;
                        let sectorIndex = Math.floor(((angle + sectorAngle/2) % 360) / sectorAngle);
                        if (sectorIndex < 0) sectorIndex += n;
                        const task = fortuneTasks[sectorIndex].lines.join(' ');
                        // localStorage.setItem('fortune_result', task); // если нужно сохранять
                    }, 120);
                }, 90);
            }, 120);
        };
        fortuneWheel.style.transition = 'transform 4.2s cubic-bezier(.15,.85,.35,1)';
        fortuneWheel.style.transform = `rotate(${totalRotate}deg)`;
        setTimeout(() => {
            shake();
        }, 4200);
    });
}

// Перерисовываю колесо для маленького размера с индивидуальными настройками
if (fortuneWheel) {
    while (fortuneWheel.firstChild) fortuneWheel.removeChild(fortuneWheel.firstChild);
    const n = fortuneTasks.length;
    const colors = ['#ffe3e3','#f9e6ff','#e3ffe9','#fffbe3','#fce3ff','#e3ffe9','#ffe3e3','#f9e6ff','#e3ffe9','#fffbe3'];
    for (let i = 0; i < n; i++) {
        const angle1 = (2 * Math.PI / n) * i - Math.PI/2;
        const angle2 = (2 * Math.PI / n) * (i + 1) - Math.PI/2;
        const x1 = 170 + 155 * Math.cos(angle1);
        const y1 = 170 + 155 * Math.sin(angle1);
        const x2 = 170 + 155 * Math.cos(angle2);
        const y2 = 170 + 155 * Math.sin(angle2);
        const largeArc = (2 * Math.PI / n) > Math.PI ? 1 : 0;
        const path = `M170,170 L${x1},${y1} A155,155 0 ${largeArc},1 ${x2},${y2} Z`;
        const sector = document.createElementNS('http://www.w3.org/2000/svg','path');
        sector.setAttribute('d', path);
        sector.setAttribute('fill', colors[i % colors.length]);
        sector.setAttribute('stroke', '#b85c5c');
        sector.setAttribute('stroke-width', '2');
        fortuneWheel.appendChild(sector);
        // Индивидуальные параметры для текста
        const { lines, radius, fontSize, lineHeight } = fortuneTasks[i];
        const textAngle = (angle1 + angle2) / 2;
        const tx = 170 + radius * Math.cos(textAngle);
        const ty = 170 + radius * Math.sin(textAngle);
        const lh = lineHeight || fontSize;
        lines.forEach((line, idx) => {
            const text = document.createElementNS('http://www.w3.org/2000/svg','text');
            text.setAttribute('x', tx);
            text.setAttribute('y', ty + idx * lh - (lines.length-1)*lh/2);
            text.setAttribute('fill', '#a13e3e');
            text.setAttribute('font-size', fontSize);
            text.setAttribute('font-family', 'Arial, sans-serif');
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('alignment-baseline', 'middle');
            text.setAttribute('style', 'text-shadow: 0 1px 2px #fff, 0 0 2px #b85c5c33;');
            let rot = (textAngle*180/Math.PI);
            if (rot > 90 && rot < 270) rot += 180;
            text.setAttribute('transform', `rotate(${rot.toFixed(1)},${tx},${ty + idx * lh - (lines.length-1)*lh/2})`);
            text.textContent = line;
            fortuneWheel.appendChild(text);
        });
    }
} 