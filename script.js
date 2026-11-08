// Event timestamps include the venue's UTC offset and live on <body>.
function getPartyState(now, start, end) {
    if (![now, start, end].every(Number.isFinite) || end <= start) return 'unavailable';
    if (now < start) return 'upcoming';
    return now < end ? 'active' : 'ended';
}

function isValidContact(value) {
    const contact = value.trim();
    if (contact.includes('@')) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const digits = contact.replace(/\D/g, '');
    return /^\+?[\d\s().-]+$/.test(contact) && digits.length >= 7 && digits.length <= 15;
}

function initializeInvitation() {
    const partyStart = Date.parse(document.body.dataset.partyStart);
    const partyEnd = Date.parse(document.body.dataset.partyEnd);
    const countdown = document.getElementById('countdown');
    const eventStatus = document.getElementById('eventStatus');
    const eventClosed = document.getElementById('eventClosed');
    const form = document.getElementById('rsvpForm');
    const contact = document.getElementById('contact');
    const attending = document.getElementById('attending');
    const guestsGroup = document.getElementById('guestsGroup');
    const guests = document.getElementById('guests');
    const submitButton = form.querySelector('.submit-btn');
    const success = document.getElementById('formSuccess');
    const successTitle = document.getElementById('successTitle');
    const successMessage = document.getElementById('successMessage');
    const formError = document.getElementById('formError');
    const defaultSubmitText = submitButton.textContent;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const confetti = new Set();
    let phase;
    let sending = false;
    let submitted = false;
    let timer = null;

    function validateContact() {
        contact.setCustomValidity(contact.value && !isValidContact(contact.value)
            ? 'Enter an email address or a phone number, such as you@example.com or (972) 555-0123.'
            : '');
    }

    function syncGuests() {
        const needsGuests = attending.value === 'yes';
        guestsGroup.hidden = !needsGuests;
        guests.disabled = !needsGuests;
        guests.required = needsGuests;
        if (!needsGuests) guests.value = '';
    }

    function updateCountdown() {
        const now = Date.now();
        const nextPhase = getPartyState(now, partyStart, partyEnd);
        if (nextPhase !== phase) {
            phase = nextPhase;
            document.body.dataset.partyState = phase;
            const closed = phase === 'ended' || phase === 'unavailable';
            countdown.hidden = phase !== 'upcoming';
            eventStatus.hidden = false;
            eventStatus.textContent = {
                upcoming: 'Counting down to party time!',
                active: 'It’s party time! Let’s celebrate!',
                ended: 'Thanks for celebrating with us!',
                unavailable: 'Party details are being updated. Please email us with any questions.'
            }[phase];
            eventClosed.hidden = phase !== 'ended';
            form.hidden = closed || submitted;
            success.hidden = closed || !submitted;
            submitButton.disabled = closed || sending;
            if (closed) {
                formError.hidden = true;
                window.clearInterval(timer);
                timer = null;
            }
        }
        if (phase !== 'upcoming') return;
        const remaining = Math.max(0, Math.ceil((partyStart - now) / 1000));
        const values = {
            days: Math.floor(remaining / 86400),
            hours: Math.floor((remaining % 86400) / 3600),
            minutes: Math.floor((remaining % 3600) / 60),
            seconds: remaining % 60
        };
        for (const [id, value] of Object.entries(values)) {
            document.getElementById(id).textContent = String(value).padStart(2, '0');
        }
    }

    function resumeCountdown() {
        updateCountdown();
        if (!document.hidden && !timer && (phase === 'upcoming' || phase === 'active')) {
            timer = window.setInterval(updateCountdown, 1000);
        }
    }

    function clearConfetti() {
        for (const { element, animation } of confetti) {
            animation.cancel();
            element.remove();
        }
        confetti.clear();
    }

    function celebrate() {
        if (motionPreference.matches || document.hidden || !Element.prototype.animate) return;
        const colors = ['#c62828', '#1761a0', '#f6c744'];
        for (let i = 0; i < 24; i++) {
            const element = document.createElement('span');
            element.setAttribute('aria-hidden', 'true');
            element.style.cssText = 'position:fixed;left:50%;top:45%;width:9px;height:9px;pointer-events:none;z-index:1000;border-radius:2px;';
            element.style.backgroundColor = colors[i % colors.length];
            document.body.append(element);
            const angle = (i / 24) * Math.PI * 2;
            const distance = 80 + Math.random() * 100;
            const animation = element.animate([
                { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance + 80}px) rotate(180deg)`, opacity: 0 }
            ], { duration: 1000, easing: 'ease-out' });
            const particle = { element, animation };
            confetti.add(particle);
            animation.onfinish = () => {
                element.remove();
                confetti.delete(particle);
            };
        }
    }

    attending.addEventListener('change', syncGuests);
    contact.addEventListener('input', validateContact);
    contact.addEventListener('change', validateContact);
    validateContact();
    syncGuests();
    resumeCountdown();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            window.clearInterval(timer);
            timer = null;
            clearConfetti();
        } else {
            resumeCountdown();
        }
    });
    motionPreference.addEventListener('change', () => {
        if (motionPreference.matches) clearConfetti();
    });
    window.addEventListener('pageshow', () => {
        syncGuests();
        validateContact();
        resumeCountdown();
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        updateCountdown();
        if (sending || submitted || phase === 'ended' || phase === 'unavailable') return;
        syncGuests();
        validateContact();
        if (!form.reportValidity()) return;

        const formData = new FormData(form);
        formData.set('contact', contact.value.trim());
        const willAttend = formData.get('attending') === 'yes';
        // Disabled fields are excluded natively; remove explicitly as a second guard.
        if (!willAttend) formData.delete('guests');
        const childName = String(formData.get('childName') || '').trim();
        sending = true;
        formError.hidden = true;
        form.setAttribute('aria-busy', 'true');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending…';
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 15000);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' },
                signal: controller.signal
            });
            if (!response.ok) throw new Error('RSVP was not accepted');
            submitted = true;
            updateCountdown();
            if (phase === 'ended' || phase === 'unavailable') return;
            form.hidden = true;
            successTitle.textContent = willAttend ? 'You’re on the guest list!' : 'Thanks for letting us know';
            successMessage.textContent = willAttend
                ? `We can’t wait to celebrate with ${childName || 'you'}!`
                : `We’ll miss ${childName || 'you'}. Thanks for sending your RSVP.`;
            success.hidden = false;
            successTitle.focus();
            if (willAttend) celebrate();
        } catch (error) {
            updateCountdown();
            if (phase !== 'ended' && phase !== 'unavailable') formError.hidden = false;
        } finally {
            window.clearTimeout(timeout);
            sending = false;
            form.removeAttribute('aria-busy');
            submitButton.textContent = defaultSubmitText;
            submitButton.disabled = submitted || phase === 'ended' || phase === 'unavailable';
        }
    });
}

if (typeof document !== 'undefined') initializeInvitation();
if (typeof module !== 'undefined' && module.exports) module.exports = { getPartyState, isValidContact };
