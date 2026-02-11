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


// Open SMS
function openSMS() {
    const message = CONFIG.message; // Just the message, no link
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
