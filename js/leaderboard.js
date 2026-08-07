import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCM5QOqGkc2RYCaw7ePexYp__YEXWb9Z3A",
    authDomain: "cgl-pro-c1c13.firebaseapp.com",
    projectId: "cgl-pro-c1c13"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
    const leaderboardList = document.getElementById('leaderboard-list');
    if (!leaderboardList) return;

    try {
        const q = query(collection(db, "leaderboard"), orderBy("score", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        
        leaderboardList.innerHTML = '';
        if (querySnapshot.empty) {
            leaderboardList.innerHTML = `<p class="text-sm text-slate-500 text-center py-2">No scores available yet.</p>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            leaderboardList.innerHTML += `
                <div class="flex justify-between items-center text-sm py-2 border-b border-slate-100">
                    <span class="font-medium text-slate-700">${data.phoneMasked || 'User'}</span>
                    <span class="font-bold text-emerald-600">${data.score} Marks</span>
                </div>
            `;
        });
    } catch (e) {
        console.error("Error fetching leaderboard:", e);
    }
});
