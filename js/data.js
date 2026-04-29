/* ═══════════════════════════════════════════════
   NutriMind AI — Food Database & Context Engine
   ═══════════════════════════════════════════════ */

const foodDatabase = [
    // Healthy (base score 75-95)
    { name: "salad", baseScore: 92, type: "healthy", category: "vegetable", image: "images/salad.png", alternatives: ["Add grilled chicken for protein", "Use olive oil dressing", "Top with nuts & seeds"] },
    { name: "apple", baseScore: 90, type: "healthy", category: "fruit", image: "images/apple.png", alternatives: ["Mixed fruit bowl", "Apple with almond butter", "Banana smoothie"] },
    { name: "chicken", baseScore: 85, type: "healthy", category: "protein", image: "images/chicken.png", alternatives: ["Baked salmon", "Grilled tofu", "Turkey breast"] },
    { name: "fish", baseScore: 90, type: "healthy", category: "protein", image: "images/fish.png", alternatives: ["Grilled shrimp", "Lentil curry", "Chickpea bowl"] },
    { name: "oatmeal", baseScore: 88, type: "healthy", category: "grain", image: "images/oatmeal.png", alternatives: ["Overnight oats", "Quinoa porridge", "Muesli bowl"] },
    { name: "yogurt", baseScore: 82, type: "healthy", category: "dairy", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80", alternatives: ["Greek yogurt with honey", "Coconut yogurt", "Smoothie bowl"] },
    { name: "eggs", baseScore: 84, type: "healthy", category: "protein", image: "https://images.unsplash.com/photo-1521513919009-be90ad555598?auto=format&fit=crop&w=400&q=80", alternatives: ["Egg white omelette", "Boiled eggs with toast", "Tofu scramble"] },
    { name: "banana", baseScore: 88, type: "healthy", category: "fruit", image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80", alternatives: ["Mixed fruit plate", "Banana smoothie", "Apple slices"] },

    // Neutral (base score 40-74)
    { name: "rice", baseScore: 60, type: "neutral", category: "grain", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80", alternatives: ["Brown rice", "Quinoa", "Cauliflower rice"] },
    { name: "pasta", baseScore: 50, type: "neutral", category: "grain", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=400&q=80", alternatives: ["Zucchini noodles", "Whole wheat pasta", "Lentil pasta"] },
    { name: "bread", baseScore: 55, type: "neutral", category: "grain", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80", alternatives: ["Whole grain bread", "Sourdough", "Lettuce wraps"] },
    { name: "sandwich", baseScore: 55, type: "neutral", category: "mixed", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80", alternatives: ["Lettuce wrap", "Whole grain sandwich", "Veggie wrap"] },

    // Unhealthy (base score 5-39)
    { name: "pizza", baseScore: 30, type: "unhealthy", category: "junk", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80", alternatives: ["Cauliflower crust pizza", "Whole wheat flatbread", "Veggie pita"] },
    { name: "burger", baseScore: 28, type: "unhealthy", category: "junk", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80", alternatives: ["Turkey burger", "Veggie burger", "Grilled chicken wrap"] },
    { name: "fries", baseScore: 18, type: "unhealthy", category: "junk", image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=400&q=80", alternatives: ["Baked sweet potato fries", "Side salad", "Roasted veggies"] },
    { name: "ice cream", baseScore: 15, type: "unhealthy", category: "dessert", image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=400&q=80", alternatives: ["Greek yogurt with berries", "Frozen banana", "Dark chocolate"] },
    { name: "donut", baseScore: 12, type: "unhealthy", category: "dessert", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80", alternatives: ["Oatmeal with fruit", "Whole grain toast", "Granola bar"] },
    { name: "soda", baseScore: 5, type: "unhealthy", category: "drink", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80", alternatives: ["Sparkling water with lemon", "Green tea", "Coconut water"] },
    { name: "chips", baseScore: 15, type: "unhealthy", category: "snack", image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80", alternatives: ["Air-popped popcorn", "Mixed nuts", "Veggie sticks"] },
    { name: "cake", baseScore: 12, type: "unhealthy", category: "dessert", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80", alternatives: ["Fresh fruit plate", "Dark chocolate", "Yogurt parfait"] },
    { name: "noodles", baseScore: 40, type: "neutral", category: "grain", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80", alternatives: ["Soba noodles", "Zucchini noodles", "Rice paper rolls"] },
    { name: "biryani", baseScore: 45, type: "neutral", category: "mixed", image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=400&q=80", alternatives: ["Quinoa pulao", "Brown rice biryani", "Grilled chicken with veggies"] },
    { name: "samosa", baseScore: 22, type: "unhealthy", category: "snack", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80", alternatives: ["Baked samosa", "Sprout chaat", "Roasted chickpeas"] },
    { name: "chocolate", baseScore: 20, type: "unhealthy", category: "dessert", image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=400&q=80", alternatives: ["Dark chocolate (85%+)", "Trail mix", "Fresh berries"] },
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
            image: "https://images.unsplash.com/photo-1490818387583-1b0ba689a07a?auto=format&fit=crop&w=400&q=80",
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
    }

    // ── Goal Context ──
    let goalFeedback = "";
    if (goal === "Weight Loss") {
        if (food.type === "unhealthy") {
            goalFeedback = "This meal may hinder your weight loss. Consider a lower-calorie alternative.";
        } else {
            goalFeedback = "Great choice for weight loss! Keeps you full without excess calories.";
        }
    } else if (goal === "Muscle Gain") {
        if (food.category === "protein" || food.type === "healthy") {
            goalFeedback = "Excellent for muscle recovery and growth.";
        } else {
            goalFeedback = "Consider pairing this with a protein source to support muscle gain.";
        }
    } else if (goal === "More Energy") {
        if (food.type === "unhealthy") {
            goalFeedback = "This might cause an energy spike followed by a crash. Try complex carbs.";
        } else {
            goalFeedback = "Perfect for sustained, steady energy throughout the day.";
        }
    } else if (goal === "Better Sleep") {
        if (timeOfDay === "Night" && food.type === "unhealthy") {
            goalFeedback = "Heavy meals before bed can severely disrupt your sleep quality.";
        } else {
            goalFeedback = "A light choice that won't interfere with your rest.";
        }
    }

    // ── Score Clamping ──
    if (score > 100) score = 100;
    if (score < 0) score = 0;

    let finalInsight = insights.join(" ");
    if (!finalInsight) finalInsight = "A balanced choice. Keep your overall day in mind.";

    return {
        originalFood: food,
        score: score,
        insight: finalInsight,
        goalFeedback: goalFeedback || "Keep tracking to reach your goals.",
        alternatives: food.alternatives || []
    };
}
