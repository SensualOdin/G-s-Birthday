// Scroll Animations (Bouncy)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Countdown Timer
function updateCountdown() {
    const partyDate = new Date('2026-01-17T16:30:00').getTime();
    const now = new Date().getTime();
    const distance = partyDate - now;

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<div class="countdown-item" style="width: 100%; font-size: 2rem; color: var(--color-red);">PARTY TIME! 🎉</div>';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Hero Canvas Particles (Balloons & Confetti)
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const colors = ['#FF5555', '#4488FF', '#FFD700', '#44CC44', '#9966FF'];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100; // Start below screen
        this.size = Math.random() * 15 + 10; // Bigger particles
        this.speedY = Math.random() * 2 + 1; // Float up
        this.speedX = Math.random() * 2 - 1; // Wiggle
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
        this.type = Math.random() > 0.8 ? 'balloon' : 'confetti';
    }

    update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.y * 0.01) + this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y < -50) { // Reset when off top of screen
            this.y = canvas.height + 50;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;

        if (this.type === 'balloon') {
            // Draw Balloon
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 1.2, 0, 0, Math.PI * 2);
            ctx.fill();
            // String
            ctx.beginPath();
            ctx.moveTo(0, this.size * 1.2);
            ctx.lineTo(0, this.size * 2.5);
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.stroke();
        } else {
            // Draw Confetti (Square)
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }

        ctx.restore();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < 50; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// RSVP Form Logic
const rsvpForm = document.getElementById('rsvpForm');
const attendingSelect = document.getElementById('attending');
const guestsGroup = document.getElementById('guestsGroup');

attendingSelect.addEventListener('change', function () {
    if (this.value === 'yes') {
        guestsGroup.style.display = 'block';
        guestsGroup.classList.add('fade-up', 'visible');
    } else {
        guestsGroup.style.display = 'none';
    }
});

rsvpForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(rsvpForm);
    const submitBtn = rsvpForm.querySelector('.submit-btn');

    submitBtn.textContent = 'Sending... 🚀';
    submitBtn.disabled = true;

    try {
        const response = await fetch(rsvpForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            rsvpForm.style.display = 'none';
            const successMsg = document.getElementById('formSuccess');
            successMsg.style.display = 'block';
            successMsg.classList.add('fade-up', 'visible');

            // Celebration Confetti Explosion
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    createConfettiExplosion();
                }, i * 300);
            }
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        alert('Uh oh! Something went wrong. Try again!');
        submitBtn.textContent = 'Send RSVP! 🎈';
        submitBtn.disabled = false;
    }
});

// Confetti Explosion for Success
function createConfettiExplosion() {
    const colors = ['#FF5555', '#4488FF', '#FFD700', '#44CC44', '#9966FF'];
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 200 + 50;

        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1500,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        }).onfinish = () => particle.remove();
    }
}