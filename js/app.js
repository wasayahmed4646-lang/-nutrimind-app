/* ═══════════════════════════════════════════════
   NutriMind AI — Application Logic
   ═══════════════════════════════════════════════ */

// ── Time Detection ──
function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12)  return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    if (hour >= 17 && hour < 21) return "Evening";
    return "Night";
}

function getTimeIcon(time) {
    const icons = { Morning: "🌅", Afternoon: "☀️", Evening: "🌇", Night: "🌙" };
    return icons[time] || "🕐";
}

// ── Quick Pick helper (called from inline onclick) ──
function setFood(item) {
    document.getElementById("food-input").value = item;
    document.getElementById("food-input").focus();
}

// ── LocalStorage Manager ──
const Storage = {
    KEY_MEALS: "nutrimind_meals",
    KEY_STREAK: "nutrimind_streak",
    KEY_LAST_DATE: "nutrimind_lastMealDate",

    getMeals()     { return JSON.parse(localStorage.getItem(this.KEY_MEALS) || "[]"); },
    saveMeal(meal) {
        const meals = this.getMeals();
        meals.unshift(meal);
        localStorage.setItem(this.KEY_MEALS, JSON.stringify(meals));
    },
    getStreak()        { return parseInt(localStorage.getItem(this.KEY_STREAK) || "0"); },
    setStreak(val)     { localStorage.setItem(this.KEY_STREAK, val); },
    getLastMealDate()  { return localStorage.getItem(this.KEY_LAST_DATE); },
    setLastMealDate(d) { localStorage.setItem(this.KEY_LAST_DATE, d); },
    clearAll() {
        localStorage.removeItem(this.KEY_MEALS);
        localStorage.removeItem(this.KEY_STREAK);
        localStorage.removeItem(this.KEY_LAST_DATE);
    }
};

// ── UI Element References ──
const form            = document.getElementById("food-form");
const foodInput       = document.getElementById("food-input");
const mealTypeSelect  = document.getElementById("meal-type");
const goalSelect      = document.getElementById("goal-select");
const resultsSection  = document.getElementById("results-section");
const scoreNumber     = document.getElementById("health-score");
const scoreRing       = document.getElementById("score-ring");
const scoreVerdict    = document.getElementById("score-verdict");
const insightText     = document.getElementById("behavior-insight-text");
const goalFeedback    = document.getElementById("goal-feedback-text");
const proTipText      = document.getElementById("pro-tip-text");
const altList         = document.getElementById("alternatives-list");
const historyList     = document.getElementById("history-list");
const saveBtn         = document.getElementById("save-meal-btn");
const clearBtn        = document.getElementById("clear-history-btn");
const streakCount     = document.getElementById("streak-count");
const futureYouText   = document.getElementById("future-you-text");
const microSuggestion = document.getElementById("micro-suggestion");
const microText       = document.getElementById("micro-suggestion-text");
const timeLabel       = document.getElementById("time-label");
const timeIcon        = document.getElementById("time-icon");

// Stats
const statMealsToday  = document.getElementById("stat-meals-today");
const statAvgScore    = document.getElementById("stat-avg-score");
const statHealthyPct  = document.getElementById("stat-healthy-pct");

let currentAnalysis = null;

// ── Pro Tips Pool ──
const proTips = [
    "Drinking a glass of water before meals can reduce overeating by 20%.",
    "Eating slowly helps your brain register fullness and reduces calorie intake.",
    "Colorful plates = nutrient-rich plates. Aim for 3+ colors per meal.",
    "Meal prepping on Sunday can prevent unhealthy weekday choices.",
    "A 10-minute walk after eating improves digestion and blood sugar levels.",
    "Chewing food 20-30 times per bite improves nutrient absorption.",
    "Replacing soda with water can save you 150+ empty calories per day.",
    "Eating breakfast within an hour of waking boosts metabolism.",
    "Healthy fats (nuts, avocado) keep you full longer than carbs alone.",
    "Sleep 7-8 hours — poor sleep increases cravings for junk food by 45%."
];

function getRandomTip() {
    return proTips[Math.floor(Math.random() * proTips.length)];
}

// ═══════ INIT ═══════
function init() {
    const time = getTimeOfDay();
    timeLabel.textContent = time;
    timeIcon.textContent = getTimeIcon(time);

    // Auto-select meal type based on time
    if (time === "Morning")   mealTypeSelect.value = "Breakfast";
    else if (time === "Afternoon") mealTypeSelect.value = "Lunch";
    else if (time === "Evening")   mealTypeSelect.value = "Dinner";
    else mealTypeSelect.value = "Snack";

    updateDashboard();
}

// ═══════ FORM SUBMIT — ANALYZE ═══════
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const food     = foodInput.value.trim();
    if (!food) return;

    const moodEl   = document.querySelector('input[name="mood"]:checked');
    const mood     = moodEl ? moodEl.value : "Happy";
    const time     = getTimeOfDay();
    const goal     = goalSelect.value;
    const mealType = mealTypeSelect.value;

    currentAnalysis = getFoodContext(food, mood, time, goal, mealType);
    currentAnalysis._mealType = mealType;
    currentAnalysis._mood = mood;

    displayResults(currentAnalysis);

    // Smooth scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
});

// ═══════ DISPLAY RESULTS ═══════
function displayResults(data) {
    resultsSection.classList.remove("hidden");

    // Set the image
    const foodImage = document.getElementById("analyzed-food-image");
    if (foodImage) {
        foodImage.src = data.originalFood.image;
        foodImage.alt = data.originalFood.name;
    }

    // Animate score counter
    const target = data.score;
    let current = 0;
    if (window._scoreInterval) clearInterval(window._scoreInterval);

    window._scoreInterval = setInterval(() => {
        if (current >= target) {
            clearInterval(window._scoreInterval);
            scoreNumber.textContent = target;
        } else {
            current += 2;
            if (current > target) current = target;
            scoreNumber.textContent = current;
        }
    }, 18);

    // Ring gradient + glow color
    let color, glowRgba, verdictText;
    if (target >= 70) {
        color = "var(--success)";
        glowRgba = "rgba(52,211,153,0.25)";
        verdictText = "Excellent choice! 🌿";
    } else if (target >= 40) {
        color = "var(--warning)";
        glowRgba = "rgba(251,191,36,0.25)";
        verdictText = "Moderate — room for improvement 🔄";
    } else {
        color = "var(--danger)";
        glowRgba = "rgba(248,113,113,0.25)";
        verdictText = "Poor choice — consider alternatives ⚠️";
    }

    scoreRing.style.background = `conic-gradient(${color} ${target}%, rgba(255,255,255,0.04) 0%)`;
    scoreRing.style.boxShadow = `0 0 35px ${glowRgba}`;
    scoreVerdict.textContent = verdictText;
    scoreVerdict.style.color = color;

    // Insight text
    insightText.textContent = data.insight;

    // Goal feedback
    goalFeedback.textContent = data.goalFeedback;

    // Pro tip
    proTipText.textContent = getRandomTip();

    // Alternatives
    altList.innerHTML = "";
    data.alternatives.forEach(alt => {
        const li = document.createElement("li");
        li.textContent = alt;
        altList.appendChild(li);
    });
}

// ═══════ SAVE MEAL ═══════
saveBtn.addEventListener("click", () => {
    if (!currentAnalysis) return;

    const mealName = foodInput.value.trim();

    const meal = {
        name: mealName,
        score: currentAnalysis.score,
        type: currentAnalysis.originalFood.type,
        mealType: currentAnalysis._mealType,
        mood: currentAnalysis._mood,
        time: new Date().toISOString()
    };

    Storage.saveMeal(meal);
    updateStreak(meal.score);

    // Reset UI
    form.reset();
    resultsSection.classList.add("hidden");
    currentAnalysis = null;

    // Re-init time-based defaults
    const time = getTimeOfDay();
    if (time === "Morning")   mealTypeSelect.value = "Breakfast";
    else if (time === "Afternoon") mealTypeSelect.value = "Lunch";
    else if (time === "Evening")   mealTypeSelect.value = "Dinner";
    else mealTypeSelect.value = "Snack";

    updateDashboard();

    // Scroll back up to dashboard
    document.getElementById("dashboard-section").scrollIntoView({ behavior: "smooth" });
});

// ═══════ STREAK LOGIC ═══════
function updateStreak(score) {
    const today = new Date().toDateString();
    let streak = Storage.getStreak();
    const lastDate = Storage.getLastMealDate();

    if (score >= 60) {
        if (lastDate !== today) {
            streak++;
            Storage.setLastMealDate(today);
        }
    } else {
        streak = 0;
        Storage.setLastMealDate(today);
    }
    Storage.setStreak(streak);
}

// ═══════ CLEAR HISTORY ═══════
clearBtn.addEventListener("click", () => {
    if (confirm("Clear all your meal history and streaks? This cannot be undone.")) {
        Storage.clearAll();
        updateDashboard();
    }
});

// ═══════ DASHBOARD ═══════
function updateDashboard() {
    const meals = Storage.getMeals();
    const streak = Storage.getStreak();
    streakCount.textContent = streak;

    // Today's meals
    const today = new Date().toDateString();
    const todaysMeals = meals.filter(m => new Date(m.time).toDateString() === today);

    // Stats
    statMealsToday.textContent = todaysMeals.length;

    if (todaysMeals.length > 0) {
        const avg = Math.round(todaysMeals.reduce((s, m) => s + m.score, 0) / todaysMeals.length);
        statAvgScore.textContent = avg;
        const healthyCount = todaysMeals.filter(m => m.score >= 60).length;
        statHealthyPct.textContent = Math.round((healthyCount / todaysMeals.length) * 100) + "%";
    } else {
        statAvgScore.textContent = "—";
        statHealthyPct.textContent = "—";
    }

    // Render history
    historyList.innerHTML = "";

    if (todaysMeals.length === 0) {
        historyList.innerHTML = '<div class="empty-state">No meals logged today. Start by analyzing a meal above! 🍽️</div>';
        clearBtn.classList.add("hidden");
    } else {
        clearBtn.classList.remove("hidden");
        todaysMeals.forEach(meal => {
            const timeStr = new Date(meal.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            let scoreClass = "score-low";
            if (meal.score >= 70) scoreClass = "score-high";
            else if (meal.score >= 40) scoreClass = "score-med";

            const div = document.createElement("div");
            div.className = "history-item";
            div.innerHTML = `
                <div class="history-details">
                    <span class="history-food">${meal.name}</span>
                    <span class="history-meta">${meal.mealType || ""} · ${timeStr} · ${meal.mood || ""}</span>
                </div>
                <div class="history-score ${scoreClass}">${meal.score}</div>
            `;
            historyList.appendChild(div);
        });
    }

    updateFutureYou(meals);
    updateMicroSuggestion(meals);
}

// ═══════ FUTURE YOU ═══════
function updateFutureYou(meals) {
    const banner = document.getElementById("future-you-banner");

    if (meals.length < 3) {
        futureYouText.textContent = "Log at least 3 meals to unlock your personalized health trajectory.";
        banner.style.borderLeftColor = "var(--accent-purple)";
        return;
    }

    const recentMeals = meals.slice(0, 7);
    const avgScore = recentMeals.reduce((s, m) => s + m.score, 0) / recentMeals.length;

    if (avgScore >= 75) {
        banner.style.borderLeftColor = "var(--success)";
        futureYouText.textContent = "🟢 Amazing trajectory! If you continue this pattern, expect sustained high energy, better sleep, improved immunity, and a healthier body composition over time.";
    } else if (avgScore >= 50) {
        banner.style.borderLeftColor = "var(--warning)";
        futureYouText.textContent = "🟡 You're doing okay, but there's room to grow. Swap 1-2 meals per day with healthier alternatives to prevent energy dips and improve long-term health.";
    } else {
        banner.style.borderLeftColor = "var(--danger)";
        futureYouText.textContent = "🔴 Warning: If you continue this pattern, your energy may drop significantly, you may feel sluggish, and your long-term health could decline. Small changes today = big results tomorrow!";
    }
}

// ═══════ MICRO SUGGESTIONS ═══════
function updateMicroSuggestion(meals) {
    const today = new Date().toDateString();
    const todaysMeals = meals.filter(m => new Date(m.time).toDateString() === today);

    if (todaysMeals.length === 0) {
        microSuggestion.classList.add("hidden");
        return;
    }

    const unhealthyToday = todaysMeals.filter(m => m.score < 40).length;
    const healthyToday = todaysMeals.filter(m => m.score >= 70).length;
    const streak = Storage.getStreak();

    let msg = "";

    if (streak >= 5) {
        msg = "🏆 You're on a " + streak + "-day streak! Your consistency is building lasting healthy habits.";
    } else if (unhealthyToday >= 2) {
        msg = "⚠️ You've had " + unhealthyToday + " low-score meals today. Try making your next meal a healthy one to balance out.";
        microSuggestion.querySelector("p").style.color = "var(--warning)";
        microSuggestion.style.borderLeftColor = "var(--warning)";
        microSuggestion.style.background = "var(--warning-bg)";
    } else if (healthyToday >= 3) {
        msg = "🌟 Incredible! " + healthyToday + " healthy meals today. You're crushing your nutrition goals!";
    } else if (todaysMeals.length >= 1 && healthyToday === todaysMeals.length) {
        msg = "✅ Every meal today has been a healthy choice. Keep it up!";
    }

    if (msg) {
        microSuggestion.classList.remove("hidden");
        microText.textContent = msg;
    } else {
        microSuggestion.classList.add("hidden");
    }
}

// ═══════ RESTAURANT SEARCH ═══════
function getRestaurantQuery() {
    const input = document.getElementById("restaurant-search");
    let query = input ? input.value.trim() : "";
    if (!query) query = "healthy food near me";
    return encodeURIComponent(query);
}

document.getElementById("maps-btn").addEventListener("click", () => {
    window.open("https://www.google.com/maps/search/" + getRestaurantQuery(), "_blank");
});

document.getElementById("zomato-btn").addEventListener("click", () => {
    window.open("https://www.zomato.com/search?q=" + getRestaurantQuery(), "_blank");
});

document.getElementById("swiggy-btn").addEventListener("click", () => {
    window.open("https://www.swiggy.com/search?query=" + getRestaurantQuery(), "_blank");
});

// ═══════ START ═══════
init();
