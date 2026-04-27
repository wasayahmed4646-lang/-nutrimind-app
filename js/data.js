/* ═══════════════════════════════════════════════
   NutriMind AI — Food Database & Context Engine
   ═══════════════════════════════════════════════ */

const foodDatabase = [
    // Healthy (base score 75-95)
    { name: "salad", baseScore: 92, type: "healthy", category: "vegetable", alternatives: ["Add grilled chicken for protein", "Use olive oil dressing", "Top with nuts & seeds"] },
    { name: "apple", baseScore: 90, type: "healthy", category: "fruit", alternatives: ["Mixed fruit bowl", "Apple with almond butter", "Banana smoothie"] },
    { name: "chicken", baseScore: 85, type: "healthy", category: "protein", alternatives: ["Baked salmon", "Grilled tofu", "Turkey breast"] },
    { name: "fish", baseScore: 90, type: "healthy", category: "protein", alternatives: ["Grilled shrimp", "Lentil curry", "Chickpea bowl"] },
    { name: "oatmeal", baseScore: 88, type: "healthy", category: "grain", alternatives: ["Overnight oats", "Quinoa porridge", "Muesli bowl"] },
    { name: "yogurt", baseScore: 82, type: "healthy", category: "dairy", alternatives: ["Greek yogurt with honey", "Coconut yogurt", "Smoothie bowl"] },
    { name: "eggs", baseScore: 84, type: "healthy", category: "protein", alternatives: ["Egg white omelette", "Boiled eggs with toast", "Tofu scramble"] },
    { name: "banana", baseScore: 88, type: "healthy", category: "fruit", alternatives: ["Mixed fruit plate", "Banana smoothie", "Apple slices"] },

    // Neutral (base score 40-74)
    { name: "rice", baseScore: 60, type: "neutral", category: "grain", alternatives: ["Brown rice", "Quinoa", "Cauliflower rice"] },
    { name: "pasta", baseScore: 50, type: "neutral", category: "grain", alternatives: ["Zucchini noodles", "Whole wheat pasta", "Lentil pasta"] },
    { name: "bread", baseScore: 55, type: "neutral", category: "grain", alternatives: ["Whole grain bread", "Sourdough", "Lettuce wraps"] },
    { name: "sandwich", baseScore: 55, type: "neutral", category: "mixed", alternatives: ["Lettuce wrap", "Whole grain sandwich", "Veggie wrap"] },

    // Unhealthy (base score 5-39)
    { name: "pizza", baseScore: 30, type: "unhealthy", category: "junk", alternatives: ["Cauliflower crust pizza", "Whole wheat flatbread", "Veggie pita"] },
    { name: "burger", baseScore: 28, type: "unhealthy", category: "junk", alternatives: ["Turkey burger", "Veggie burger", "Grilled chicken wrap"] },
    { name: "fries", baseScore: 18, type: "unhealthy", category: "junk", alternatives: ["Baked sweet potato fries", "Side salad", "Roasted veggies"] },
    { name: "ice cream", baseScore: 15, type: "unhealthy", category: "dessert", alternatives: ["Greek yogurt with berries", "Frozen banana", "Dark chocolate"] },
    { name: "donut", baseScore: 12, type: "unhealthy", category: "dessert", alternatives: ["Oatmeal with fruit", "Whole grain toast", "Granola bar"] },
    { name: "soda", baseScore: 5, type: "unhealthy", category: "drink", alternatives: ["Sparkling water with lemon", "Green tea", "Coconut water"] },
    { name: "chips", baseScore: 15, type: "unhealthy", category: "snack", alternatives: ["Air-popped popcorn", "Mixed nuts", "Veggie sticks"] },
    { name: "cake", baseScore: 12, type: "unhealthy", category: "dessert", alternatives: ["Fresh fruit plate", "Dark chocolate", "Yogurt parfait"] },
    { name: "noodles", baseScore: 40, type: "neutral", category: "grain", alternatives: ["Soba noodles", "Zucchini noodles", "Rice paper rolls"] },
    { name: "biryani", baseScore: 45, type: "neutral", category: "mixed", alternatives: ["Quinoa pulao", "Brown rice biryani", "Grilled chicken with veggies"] },
    { name: "samosa", baseScore: 22, type: "unhealthy", category: "snack", alternatives: ["Baked samosa", "Sprout chaat", "Roasted chickpeas"] },
    { name: "chocolate", baseScore: 20, type: "unhealthy", category: "dessert", alternatives: ["Dark chocolate (85%+)", "Trail mix", "Fresh berries"] },
];

/**
 * Finds a food in the database. Supports partial matching.
 */
function lookupFood(query) {
    const q = query.toLowerCase().trim();
    // Try exact match first, then partial
    return foodDatabase.find(f => f.name === q)
        || foodDatabase.find(f => q.includes(f.name) || f.name.includes(q))
        || null;
}

/**
 * Core context engine — produces score, insight, and alternatives
 * based on food, mood, time-of-day, goal, and meal type.
 */
function getFoodContext(foodQuery, mood, timeOfDay, goal, mealType) {
    let food = lookupFood(foodQuery);

    if (!food) {
        food = {
            name: foodQuery.toLowerCase().trim(),
            baseScore: 50,
            type: "neutral",
            category: "unknown",
            alternatives: ["Pair it with a green salad", "Drink a glass of water", "Add a piece of fresh fruit"]
        };
    }

    let score = food.baseScore;
    let insights = [];

    // ── Time-of-Day Context ──
    if (timeOfDay === "Night") {
        if (food.type === "unhealthy") {
            score -= 15;
            insights.push("Eating heavy or sugary food late at night can disrupt your sleep and slow your metabolism.");
        } else {
            insights.push("A light, healthy choice at night — great for restful sleep.");
        }
    } else if (timeOfDay === "Morning") {
        if (food.type === "unhealthy") {
            score -= 10;
            insights.push("Starting your day with this may cause a mid-morning energy crash.");
        } else {
            score += 5;
            insights.push("Excellent fuel to kickstart your morning!");
        }
    } else if (timeOfDay === "Evening") {
        if (food.type === "unhealthy") {
            score -= 5;
            insights.push("Consider lighter options in the evening for better digestion.");
        }
    }

    // ── Mood Context ──
    if (mood === "Stressed") {
        if (food.type === "unhealthy") {
            score -= 10;
            insights.push("This looks like stress-eating. Next time, try a 5-minute breathing exercise or a short walk before reaching for comfort food.");
        } else {
            score += 8;
            insights.push("Great willpower! Choosing healthy food when stressed shows strong self-control. 💪");
        }
    } else if (mood === "Tired") {
        if (food.type === "unhealthy") {
            insights.push("When tired, sugary foods give a quick spike but lead to an even worse crash. Opt for sustained-energy foods.");
        } else {
            score += 5;
            insights.push("Smart choice — this will give you steady energy to power through.");
        }
    } else if (mood === "Happy") {
        insights.push("You're in a great mood — keep that positive momentum going!");
