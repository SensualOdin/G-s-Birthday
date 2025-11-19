// RSVP Form Handling
document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Show success message
            document.getElementById('rsvpForm').style.display = 'none';
            document.getElementById('formSuccess').classList.add('show');
            
            // Scroll to success message
            document.getElementById('formSuccess').scrollIntoView({ behavior: 'smooth' });
            
            // Trigger celebration
            triggerCelebration();
        } else {
            alert('Oops! There was a problem submitting your RSVP. Please try again.');
        }
    } catch (error) {
        alert('Oops! There was a problem submitting your RSVP. Please try again.');
    }
});

// Show/hide guests field based on attendance
document.getElementById('attending').addEventListener('change', function() {
    const guestsGroup = document.getElementById('guestsGroup');
    if (this.value === 'yes') {
        guestsGroup.style.display = 'block';
    } else {
        guestsGroup.style.display = 'none';
    }
});

// Smooth scrolling for any anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Create floating confetti effect
function createConfetti() {
    const confetti = document.querySelector('.confetti');
    const colors = ['#dc143c', '#ff0000', '#0047ab', '#1e90ff', '#ffd700', '#ff69b4', '#ffffff'];
    const shapes = ['circle', 'square', 'triangle'];
    
    setInterval(() => {
        const confettiPiece = document.createElement('div');
        const size = Math.random() * 12 + 5;
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        confettiPiece.style.position = 'fixed';
        confettiPiece.style.width = size + 'px';
        confettiPiece.style.height = size + 'px';
        confettiPiece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confettiPiece.style.left = Math.random() * 100 + '%';
        confettiPiece.style.top = '-20px';
        confettiPiece.style.opacity = Math.random() * 0.8 + 0.2;
        confettiPiece.style.pointerEvents = 'none';
        confettiPiece.style.zIndex = '1';
        
        if (shape === 'circle') {
            confettiPiece.style.borderRadius = '50%';
        } else if (shape === 'triangle') {
            confettiPiece.style.width = '0';
            confettiPiece.style.height = '0';
            confettiPiece.style.borderLeft = `${size/2}px solid transparent`;
            confettiPiece.style.borderRight = `${size/2}px solid transparent`;
            confettiPiece.style.borderBottom = `${size}px solid ${confettiPiece.style.backgroundColor}`;
            confettiPiece.style.backgroundColor = 'transparent';
        }
        
        confetti.appendChild(confettiPiece);
        
        const animation = confettiPiece.animate([
            { 
                transform: 'translateY(0) rotate(0deg)', 
                opacity: confettiPiece.style.opacity 
            },
            { 
                transform: `translateY(100vh) rotate(${Math.random() * 720 - 360}deg)`, 
                opacity: 0 
            }
        ], {
            duration: Math.random() * 4000 + 3000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = () => confettiPiece.remove();
    }, 200);
}

// Countdown timer
function updateCountdown() {
    const partyDate = new Date('2026-01-17T16:30:00').getTime();
    const now = new Date().getTime();
    const distance = partyDate - now;
    
    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<div class="countdown-item"><span class="countdown-number" style="font-size: 2rem;">🎉 Party Time! 🎉</span></div>';
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

// Canvas particle animation in hero
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = document.querySelector('.hero').offsetHeight;
    
    const particles = [];
    const particleCount = 50;
    const colors = ['#ff0000', '#0047ab', '#ffd700', '#ffffff'];
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Connect nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.strokeStyle = '#ffffff';
                    ctx.globalAlpha = 0.1 * (1 - distance / 100);
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = document.querySelector('.hero').offsetHeight;
    });
}

// Fireworks effect
function createFirework(x, y) {
    const fireworks = document.querySelector('.fireworks');
    const colors = ['#ff0000', '#0047ab', '#ffd700', '#ff69b4', '#00ff00'];
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = Math.random() * 3 + 2;
        
        particle.style.position = 'fixed';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        fireworks.appendChild(particle);
        
        const animation = particle.animate([
            { 
                transform: 'translate(0, 0) scale(1)', 
                opacity: 1 
            },
            { 
                transform: `translate(${Math.cos(angle) * velocity * 50}px, ${Math.sin(angle) * velocity * 50}px) scale(0)`, 
                opacity: 0 
            }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0, 0.9, 0.3, 1)'
        });
        
        animation.onfinish = () => particle.remove();
    }
}

// Random fireworks
function triggerRandomFireworks() {
    setInterval(() => {
        if (Math.random() > 0.7) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * (window.innerHeight * 0.5);
            createFirework(x, y);
        }
    }, 3000);
}

// Celebration trigger
function triggerCelebration() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * (window.innerHeight * 0.5);
            createFirework(x, y);
        }, i * 200);
    }
}

// 3D tilt effect for cards
function init3DTilt() {
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// Scroll animations
function handleScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    const elements = document.querySelectorAll('.detail-card, .wishlist-item, .activity-card');
    elements.forEach(el => observer.observe(el));
}

// Emoji rain on click
function createEmojiRain(emoji) {
    const container = document.body;
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const emojiEl = document.createElement('div');
            emojiEl.textContent = emoji;
            emojiEl.style.position = 'fixed';
            emojiEl.style.fontSize = '2rem';
            emojiEl.style.left = Math.random() * window.innerWidth + 'px';
            emojiEl.style.top = '-50px';
            emojiEl.style.pointerEvents = 'none';
            emojiEl.style.zIndex = '9999';
            
            container.appendChild(emojiEl);
            
            const animation = emojiEl.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 50}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 2000 + 2000,
                easing: 'linear'
            });
            
            animation.onfinish = () => emojiEl.remove();
        }, i * 100);
    }
}

// Add click effects to emojis
document.addEventListener('DOMContentLoaded', () => {
    // Add click listeners to various emoji elements
    document.querySelectorAll('.balloon, .activity-icon, .wishlist-icon').forEach(el => {
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            createEmojiRain(this.textContent);
        });
    });
});

// Initialize everything on page load
window.addEventListener('load', () => {
    createConfetti();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    initHeroCanvas();
    triggerRandomFireworks();
    init3DTilt();
    handleScrollAnimations();
    
    // Add entrance animation to hero
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(50px)';
        setTimeout(() => {
            hero.style.transition = 'all 1s ease';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        triggerCelebration();
        createEmojiRain('🎉');
        setTimeout(() => createEmojiRain('🐼'), 200);
        setTimeout(() => createEmojiRain('🚒'), 400);
        setTimeout(() => createEmojiRain('🎈'), 600);
    }
});

// Add sound effect on hover (optional - you can enable this if you add sound files)
/*
const sounds = {
    hover: new Audio('hover.mp3'),
    click: new Audio('click.mp3'),
    success: new Audio('success.mp3')
};

document.querySelectorAll('.detail-card, .wishlist-item, .activity-card').forEach(item => {
    item.addEventListener('mouseenter', () => {
        if (sounds.hover) {
            sounds.hover.currentTime = 0;
            sounds.hover.volume = 0.3;
            sounds.hover.play().catch(() => {});
        }
    });
});

document.querySelector('.submit-btn')?.addEventListener('click', () => {
    if (sounds.click) {
        sounds.click.currentTime = 0;
        sounds.click.volume = 0.5;
        sounds.click.play().catch(() => {});
    }
});
*/