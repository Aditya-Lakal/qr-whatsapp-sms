// ============================================
// CONFIGURATION - EDIT YOUR DETAILS HERE
// ============================================

const CONFIG = {
    // Your phone number (include country code, e.g., +1234567890)
    phoneNumber: '+918080637616',

    // Message that will be pre-filled in WhatsApp/SMS
    message: 'Hi! this is Aditya , thanks for visiting our Atman booth at ai summit 2026',

    // PDF link - LOCAL FILE (for Web Share API)
    // This must be relative to the index.html file
    pdfLink: 'assets/brochure.pdf',

    // Optional: Custom PDF name/description
    pdfName: 'Brochure.pdf',

    // Enable automatic redirect?
    // Set to false strictly for direct file sharing (requires user gesture)
    enableAutoRedirect: false,

    // Countdown timer (in seconds) - only used if enableAutoRedirect is true
    countdownSeconds: 10
};

// ============================================
// HOW TO GET YOUR PDF LINK:
// ============================================
//
// GOOGLE DRIVE:
// 1. Upload PDF to Google Drive
// 2. Right-click → Get link
// 3. Change to "Anyone with the link can view"
// 4. Copy the link (format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing)
// 5. Use as is, or convert to direct download:
//    https://drive.google.com/uc?export=download&id=FILE_ID
//
// DROPBOX:
// 1. Upload PDF to Dropbox
// 2. Click Share → Create link
// 3. Copy link and change ?dl=0 to ?dl=1 at the end
//
// YOUR OWN WEBSITE:
// 1. Upload PDF to your website's folder
// 2. Use full URL: https://yourwebsite.com/folder/file.pdf
//
// ============================================