import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCM5QOqGkc2RYCaw7ePexYp__YEXWb9Z3A",
    authDomain: "cgl-pro-c1c13.firebaseapp.com",
    projectId: "cgl-pro-c1c13"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentQuestions = [];
let currentIndex = 0;
let userAnswers = {};
let timerInterval;

window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const testFile = urlParams.get('test') || 'test-01';

    try {
        const response = await fetch(`data/${testFile}.json`);
        const data = await response.json();
        currentQuestions = data.questions;
        document.getElementById('test-title').innerText = data.title;
        
        startTimer(data.durationMinutes * 60);
        renderQuestion();
    } catch (e) {
        console.error("Error loading test data:", e);
        document.getElementById('question-text').innerText = "Failed to load questions.";
    }

    document.getElementById('next-btn').addEventListener('click', handleNext);
    document.getElementById('prev-btn').addEventListener('click', handlePrev);
});

function renderQuestion() {
    if (currentQuestions.length === 0) return;
    const q = currentQuestions[currentIndex];
    
    document.getElementById('question-counter').innerText = `Question ${currentIndex + 1} of ${currentQuestions.length}`;
    document.getElementById('question-text').innerText = q.question;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    q.options.forEach((opt, idx) => {
        const isChecked = userAnswers[currentIndex] === idx ? 'checked' : '';
        optionsContainer.innerHTML += `
            <label class="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input type="radio" name="option" value="${idx}" ${isChecked} class="text-blue-600 focus:ring-blue-500">
                <span class="text-slate-700">${opt}</span>
            </label>
        `;
    });
}

function handleNext() {
    saveCurrentAnswer();
    if (currentIndex < currentQuestions.length - 1) {
        currentIndex++;
        renderQuestion();
    } else {
        submitTest();
    }
}

function handlePrev() {
    saveCurrentAnswer();
    if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
    }
}

function saveCurrentAnswer() {
    const selected = document.querySelector('input[name="option"]:checked');
    if (selected) {
        userAnswers[currentIndex] = parseInt(selected.value);
    }
}

function startTimer(duration) {
    let timer = duration;
    const display = document.getElementById('timer');
    timerInterval = setInterval(() => {
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.innerText = `Time Left: ${minutes}:${seconds}`;

        if (--timer < 0) {
            clearInterval(timerInterval);
            submitTest();
        }
    }, 1000);
}

async function submitTest() {
    clearInterval(timerInterval);
    let score = 0;
    currentQuestions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctAnswer) score += 2; // e.g. +2 marks per correct answer
    });

    localStorage.setItem('last_score', score);
    localStorage.setItem('last_total', currentQuestions.length * 2);

    try {
        await addDoc(collection(db, "leaderboard"), {
            phoneMasked: "+91 ***** *XYZ",
            score: score,
            timestamp: new Date()
        });
    } catch (e) {
        console.error("Error saving score to Firestore:", e);
    }

    window.location.href = 'result.html';
}
