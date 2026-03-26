import cardsData from './allCardsData.json';
import { buildDeck } from './deckBuilder';

// KPI iniziali per difficoltà
const DIFFICULTY_CONFIG = {
    EASY: {
        cash: 150,
        utenti: 0,
        churn: 65,
        trust: 65,
        eco: 65,
        valore: 1,
        kfactor: 0.9,
    },
    NORMAL: {
        cash: 100,
        utenti: 0,
        churn: 50,
        trust: 50,
        eco: 50,
        valore: 1,
        kfactor: 0.0,
    },
    HARD: {
        cash: 70,
        utenti: 0,
        churn: 35,
        trust: 35,
        eco: 35,
        valore: 1,
        kfactor: 0.0,
    }
};

export const initialState = {
    month: 1,
    phase: 1,
    status: 'MENU', // MENU, PLAYING, GAME_OVER, VICTORY
    runType: 'S',
    difficulty: 'NORMAL',
    kpis: DIFFICULTY_CONFIG.NORMAL,
    flags: [],
    logs: [],
    mainDeck: [],
    cfoDeck: [],
    currentCard: null,
};

const drawNextCard = (state) => {
    const triggeredCfo = state.cfoDeck.find(c => {
        const isRightPhase = c.fase === state.phase || c.fase === null;
        const hasFlags = !c.flags_required || c.flags_required.every(f => state.flags.includes(f));
        return isRightPhase && hasFlags;
    });

    if (triggeredCfo) return triggeredCfo;

    const nextPlayable = state.mainDeck.find(c => {
        if (c.flags_required && !c.flags_required.every(f => state.flags.includes(f))) return false;
        return true;
    });

    return nextPlayable || null;
};

export function gameReducer(state, action) {
    switch (action.type) {

        case 'START_GAME': {
            const { runType, difficulty } = action.payload;
            const { mainDeck, cfoDeck } = buildDeck(cardsData.cards, runType, difficulty);
            const setupState = {
                ...state,
                month: 1,
                phase: 1,
                status: 'PLAYING',
                runType,
                difficulty,
                kpis: { ...DIFFICULTY_CONFIG[difficulty] },
                flags: [],
                logs: [],
                mainDeck,
                cfoDeck,
            };
            return { ...setupState, currentCard: drawNextCard(setupState) };
        }

        case 'SWIPE_CARD': {
            const { direction } = action.payload;
            const card = state.currentCard;
            const choice = card[direction];

            const newKpis = { ...state.kpis };
            if (choice.effetti) {
                Object.keys(choice.effetti).forEach(key => {
                    if (key !== 'note') {
                        newKpis[key] = parseFloat((newKpis[key] + choice.effetti[key]).toFixed(2));
                    }
                });
            }

            const newFlags = [...state.flags];
            if (card.flags_set && card.flags_set[direction]) {
                newFlags.push(...card.flags_set[direction]);
            }

            const newMonth = state.month + 1;
            let newPhase = state.phase;
            if (newMonth > 18) newPhase = 2;
            if (newMonth > 42) newPhase = 3;

            let newStatus = 'PLAYING';
            if (newKpis.cash <= 0) newStatus = 'GAME_OVER';
            if (newMonth > 60) newStatus = 'VICTORY';

            if (choice.effetti?.note?.includes("Ending: Strategic Exit")) {
                newStatus = 'VICTORY';
            }

            const logEntry = choice.effetti?.note || choice.testo;

            const tempState = {
                ...state,
                kpis: newKpis,
                flags: newFlags,
                month: newMonth,
                phase: newPhase,
                status: newStatus,
                logs: [logEntry, ...state.logs].slice(0, 5),
                mainDeck: state.mainDeck.filter(c => c.id !== card.id)
            };

            return { ...tempState, currentCard: drawNextCard(tempState) };
        }

        case 'CFO_ACKNOWLEDGE': {
            const card = state.currentCard;
            const choice = card.dx;

            const newKpis = { ...state.kpis };
            if (choice.effetti) {
                Object.keys(choice.effetti).forEach(key => {
                    if (key !== 'note') {
                        newKpis[key] = parseFloat((newKpis[key] + choice.effetti[key]).toFixed(2));
                    }
                });
            }

            const newFlags = [...state.flags];
            if (card.flags_set && card.flags_set.dx) {
                newFlags.push(...card.flags_set.dx);
            }

            const logEntry = choice.effetti?.note || card.nome;

            const tempState = {
                ...state,
                kpis: newKpis,
                flags: newFlags,
                logs: [logEntry, ...state.logs].slice(0, 5),
                cfoDeck: state.cfoDeck.filter(c => c.id !== card.id)
            };

            return { ...tempState, currentCard: drawNextCard(tempState) };
        }

        case 'GO_TO_MENU': {
            return { ...initialState };
        }

        default:
            return state;
    }
}
