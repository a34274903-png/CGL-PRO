import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCM5QOqGkc2RYCaw7ePexYp__YEXWb9Z3A",
    authDomain: "cgl-pro-c1c13.firebaseapp.com",
    projectId: "cgl-pro-c1c13",
    storageBucket: "cgl-pro-c1c13.appspot.com",
    messagingSenderId: "116948395123",
    appId: "1:116948395123:web:addd0dec14567cdd847606"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.addEventListener('DOMContentLoaded', () => {
    const recaptchaDiv = document.getElementById('recaptcha-container');
    if (recaptchaDiv) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible'
        });
    }
});

const sendOtpBtn = document.getElementById('send-otp-btn');
if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', () => {
        const phoneNumber = document.getElementById('phone-number').value;
        signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                alert("OTP sent successfully!");
                document.getElementById('phone-input-container').classList.add('hidden');
                document.getElementById('otp-verify-container').classList.remove('hidden');
            }).catch((error) => {
                console.error("SMS Error:", error);
                alert("Failed to send OTP. Check phone format.");
            });
    });
}

const verifyOtpBtn = document.getElementById('verify-otp-btn');
if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', () => {
        const code = document.getElementById('otp-code').value;
        window.confirmationResult.confirm(code).then((result) => {
            alert("Login successful!");
            document.getElementById('auth-section').classList.add('hidden');
            document.getElementById('app-nav').classList.remove('hidden');
        }).catch((error) => {
            console.error("Invalid OTP:", error);
            alert("Incorrect code entered.");
        });
    });
}
