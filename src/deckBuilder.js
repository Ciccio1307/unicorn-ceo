// Costanti di distribuzione basate sul GDD
const DISTRIBUTION = {
    TEAM: { GEN: 12, SPEC: 3 },
    ECO: { GEN: 5, SPEC: 4 },
    COMP: { GEN: 5, SPEC: 3 },
    CRISI: { GEN: 5, SPEC: 3 },
    OPP: { GEN: 7, SPEC: 3 },
    ETICO: { GEN: 8, SPEC: 2 }
};

const PHASE_LIMITS = { 1: 18, 2: 24, 3: 18 };

// Percentuale di carte HARD per categoria (il resto viene riempito con NORMAL)
const HARD_MIX = {
    CRISI: 1.0,   // 100% Hard
    ETICO: 1.0,   // 100% Hard
    COMP: 0.75,   // 75% Hard
    ECO: 0.78,    // 78% Hard
    TEAM: 0.40,   // 40% Hard
    OPP: 1.0,     // 100% Hard
    CFO: 0.0      // 0% Hard — invariate
};

const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

/**
 * Seleziona le carte per un dato cat/tag rispettando il mix di difficoltà.
 * @param {Array} pool - Tutte le carte di quella cat+tag
 * @param {number} count - Quante carte servono
 * @param {string} difficulty - 'EASY' | 'NORMAL' | 'HARD'
 * @param {string} cat - Categoria (per sapere il mix HARD)
 */
const selectWithDifficulty = (pool, count, difficulty, cat) => {
    if (difficulty !== 'HARD') {
        // EASY e NORMAL usano solo le carte normali (difficulty includes 'NORMAL')
        const normalPool = shuffle(pool.filter(c => c.difficulty?.includes('NORMAL') || !c.difficulty));
        return normalPool.slice(0, count);
    }

    // HARD: mix di carte Hard + Normal secondo le percentuali
    const hardRatio = HARD_MIX[cat] ?? 0;
    const hardCount = Math.round(count * hardRatio);
    const normalCount = count - hardCount;

    const hardPool = shuffle(pool.filter(c => c.difficulty?.includes('HARD')));
    const normalPool = shuffle(pool.filter(c => c.difficulty?.includes('NORMAL') || !c.difficulty));

    const selected = [
        ...hardPool.slice(0, hardCount),
        ...normalPool.slice(0, normalCount)
    ];

    // Se mancano hard cards, completa con normal
    if (selected.length < count) {
        const remaining = count - selected.length;
        const extraNormal = normalPool.filter(c => !selected.includes(c));
        selected.push(...extraNormal.slice(0, remaining));
    }

    return shuffle(selected);
};

export const buildDeck = (allCards, runTag = 'S', difficulty = 'NORMAL') => {
    let playableCards = [];
    let cfoCards = [];

    allCards.forEach(card => {
        if (card.cat === 'CFO') {
            // CFO sempre le stesse (solo NORMAL/EASY, mai HARD per CFO)
            if (!card.difficulty || card.difficulty.includes('NORMAL')) {
                cfoCards.push(card);
            }
        } else {
            playableCards.push(card);
        }
    });

    let selectedCards = [];
    Object.keys(DISTRIBUTION).forEach(cat => {
        const rules = DISTRIBUTION[cat];

        const genPool = playableCards.filter(c => c.cat === cat && c.tag === 'GEN');
        const specPool = playableCards.filter(c => c.cat === cat && c.tag === runTag);

        selectedCards.push(...selectWithDifficulty(genPool, rules.GEN, difficulty, cat));
        selectedCards.push(...selectWithDifficulty(specPool, rules.SPEC, difficulty, cat));
    });

    // Distribuzione nelle 3 Fasi (Bucketing)
    let phases = { 1: [], 2: [], 3: [] };
    let flexibleCards = [];

    selectedCards.forEach(card => {
        if (card.fase && card.fase_lock) {
            phases[card.fase].push(card);
        } else {
            flexibleCards.push(card);
        }
    });

    shuffle(flexibleCards).forEach(card => {
        const targetPhase = card.fase || 1;
        if (phases[targetPhase].length < PHASE_LIMITS[targetPhase]) {
            phases[targetPhase].push(card);
        } else {
            const availablePhase = [1, 2, 3].find(p => phases[p].length < PHASE_LIMITS[p]);
            if (availablePhase) {
                phases[availablePhase].push({ ...card, fase: availablePhase });
            }
        }
    });

    phases[1] = shuffle(phases[1]);
    phases[2] = shuffle(phases[2]);
    phases[3] = shuffle(phases[3]);

    const finalDeck = [...phases[1], ...phases[2], ...phases[3]];
    return { mainDeck: finalDeck, cfoDeck: cfoCards };
};
