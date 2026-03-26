import React, { useReducer } from 'react';
import { gameReducer, initialState } from './GameState';
import { TopDashboard, BentoGrid } from './UIComponents';
import { SwipeArea } from './SwipeArea';
import { MainMenu } from './MainMenu';

const DIFFICULTY_LABEL = {
    EASY: { text: 'EASY', cls: 'text-emerald-400' },
    NORMAL: { text: 'NORMAL', cls: 'text-cyan-400' },
    HARD: { text: 'HARD 💀', cls: 'text-red-400' },
};

export default function App() {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    // MENU
    if (state.status === 'MENU') {
        return (
            <MainMenu
                onStart={(runType, difficulty) =>
                    dispatch({ type: 'START_GAME', payload: { runType, difficulty } })
                }
            />
        );
    }

    // GAME OVER
    if (state.status === 'GAME_OVER') {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-950 p-8 text-center">
                <div className="text-6xl mb-4">💸</div>
                <h1 className="text-5xl font-bold mb-2 text-red-500">BANCAROTTA</h1>
                <p className="text-xl text-slate-400 mb-1">Hai finito il Cash.</p>
                <p className="text-slate-500 text-sm mb-8">La tua startup ha fallito al Mese {state.month}.</p>
                <div className="flex gap-3">
                    <button
                        onClick={() => dispatch({ type: 'GO_TO_MENU' })}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full border border-slate-600 transition-colors"
                    >
                        Menu Principale
                    </button>
                    <button
                        onClick={() => dispatch({ type: 'START_GAME', payload: { runType: state.runType, difficulty: state.difficulty } })}
                        className="px-6 py-3 bg-red-800 hover:bg-red-700 text-white rounded-full border border-red-600 transition-colors"
                    >
                        Riprova
                    </button>
                </div>
            </div>
        );
    }

    // VICTORY
    if (state.status === 'VICTORY') {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-950 p-8 text-center">
                <div className="text-6xl mb-4">🦄</div>
                <h1 className="text-5xl font-bold mb-2 text-cyan-400">IPO RAGGIUNTA!</h1>
                <p className="text-slate-400 mb-1">(o Strategic Exit completata)</p>
                <p className="text-slate-500 text-sm mt-1 mb-2">Valore Finale: {state.kpis.valore}M</p>
                <p className={`text-sm font-bold mb-8 ${DIFFICULTY_LABEL[state.difficulty]?.cls}`}>
                    Completato in modalità {DIFFICULTY_LABEL[state.difficulty]?.text}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => dispatch({ type: 'GO_TO_MENU' })}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full border border-slate-600 transition-colors"
                    >
                        Menu Principale
                    </button>
                    <button
                        onClick={() => dispatch({ type: 'START_GAME', payload: { runType: state.runType, difficulty: state.difficulty } })}
                        className="px-6 py-3 bg-cyan-800 hover:bg-cyan-700 text-white rounded-full border border-cyan-600 transition-colors"
                    >
                        Nuova Partita
                    </button>
                </div>
            </div>
        );
    }

    // PLAYING
    return (
        <div className="h-screen w-full max-w-md mx-auto bg-slate-950 flex flex-col font-sans overflow-hidden select-none border-x border-white/5">

            <TopDashboard
                kpis={state.kpis}
                month={state.month}
                phase={state.phase}
                difficulty={state.difficulty}
                runType={state.runType}
            />

            <SwipeArea
                card={state.currentCard}
                onSwipe={(direction) => dispatch({ type: 'SWIPE_CARD', payload: { direction } })}
                onAcknowledge={() => dispatch({ type: 'CFO_ACKNOWLEDGE' })}
            />

            <div className="h-1/3 min-h-[30vh]">
                <BentoGrid logs={state.logs} flags={state.flags} />
            </div>

        </div>
    );
}
