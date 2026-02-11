// Main application logic
let countdownInterval;
let hasRedirected = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Display phone number in fallback UI
    document.getElementById('phoneNumber').textContent = CONFIG.phoneNumber;

    // Check if auto-redirect is enabled
    if (CONFIG.enableAutoRedirect) {
        attemptWhatsAppRedirect();
    } else {
        // If auto-redirect is disabled, show the main buttons immediately and hide loader
        document.getElementById('loader').classList.add('hidden');
        document.getElementById('fallback').classList.remove('hidden');
        document.getElementById('fallback').classList.add('fade-in');
    }
});

// Attempt to open WhatsApp automatically (legacy mode or if enabled)
function attemptWhatsAppRedirect() {
    const loader = document.getElementById('loader');
    const fallback = document.getElementById('fallback');

    // Start countdown
    startCountdown();

    // Try to open WhatsApp
    openWhatsApp();

    // After countdown expires, show fallback options
    setTimeout(() => {
        if (!hasRedirected) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.classList.add('hidden');
                fallback.classList.remove('hidden');
                fallback.classList.add('fade-in');
            }, 500);
        }
    }, CONFIG.countdownSeconds * 1000);
}

// Start countdown timer
function startCountdown() {
    let timeLeft = CONFIG.countdownSeconds;
    const countdownElement = document.getElementById('countdown');

    if (countdownElement) {
        countdownElement.textContent = timeLeft;
    }

    countdownInterval = setInterval(() => {
        timeLeft--;
        if (countdownElement) {
            countdownElement.textContent = timeLeft;
        }

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            // Automatically try SMS if WhatsApp didn't work
            if (!hasRedirected && CONFIG.enableAutoRedirect) {
                openSMS();
            }
        }
    }, 1000);
}

// --- NEW FEATURE: Share Actual PDF File ---
// --- UPDATED FEATURE: Share PDF Link via WhatsApp ---
function shareBrochure() {
    // 1. Get the absolute URL for the PDF
    // If CONFIG.pdfLink is relative, resolve it against the current page URL
    const pdfUrl = new URL(CONFIG.pdfLink, window.location.href).href;

    // 2. Create message with the PDF link
    // We use the configured message + the PDF link
    const message = `${CONFIG.message}\n\n📄 ${CONFIG.pdfName}: ${pdfUrl}`;

    // 3. Open WhatsApp
    const phoneNumber = CONFIG.phoneNumber.replace(/[^\d+]/g, '');
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    // Redirect
    window.location.href = whatsappURL;
    hasRedirected = true;

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
}


// Open WhatsApp with message (and link if file share failed/not used)
function openWhatsApp() {
    const message = createMessage();
    const phoneNumber = CONFIG.phoneNumber.replace(/[^\d+]/g, ''); // Clean phone number

    // WhatsApp URL scheme
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    // Try to open WhatsApp
    try {
        window.location.href = whatsappURL;
        hasRedirected = true;

        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    } catch (error) {
        console.log('WhatsApp redirect failed:', error);
    }
}

// Open SMS
function openSMS() {
    const message = createMessage();
    const phoneNumber = CONFIG.phoneNumber.replace(/[^\d+]/g, '');

    let smsURL;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isIOS) {
        smsURL = `sms:${phoneNumber}&body=${encodeURIComponent(message)}`;
    } else {
        smsURL = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    }

    try {
        window.location.href = smsURL;
        hasRedirected = true;

        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    } catch (error) {
        console.log('SMS redirect failed:', error);
    }
}

// Create message (adds link ONLY if we fall back to link sharing - logically handled by context)
// Note: When sharing the file directly, we usually just want the text. 
// But if we fallback to openWhatsApp(), we might want the link.
// For simplicity, let's keep the link in the text for openWhatsApp, 
// but the shareBrochure uses the file + text.
function createMessage() {
    let fullMessage = CONFIG.message;

    // If we are NOT using the file share API (i.e. this is a fallback or link mode),
    // we might want to append a link.
    // However, since we are now using a local file, we can't really "link" to it easily 
    // for external users unless it's hosted.
    // Ideally, for the FALLBACK, we should probably warn the user or just send text.
    // Let's perform a check: if pdfLink is a http URL, append it. If relative, don't.

    if (CONFIG.pdfLink && CONFIG.pdfLink.startsWith('http')) {
        fullMessage += `\n\n📄 ${CONFIG.pdfName}: ${CONFIG.pdfLink}`;
    }

    return fullMessage;
}

// Detect visibility change
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && hasRedirected) {
        const loader = document.getElementById('loader');
        const fallback = document.getElementById('fallback');

        if (loader) loader.classList.add('hidden');
        if (fallback) fallback.classList.remove('hidden');
    }
});

// Prevent multiple redirects
window.addEventListener('beforeunload', function () {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
});
