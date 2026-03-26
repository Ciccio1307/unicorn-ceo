import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export const SwipeArea = ({ card, onSwipe, onAcknowledge }) => {
    const [dragDirection, setDragDirection] = useState(null);
    const controls = useAnimation();
    const swipeThreshold = 100;

    // Resetta la posizione della carta ogni volta che ne viene pescata una nuova
    useEffect(() => {
        controls.start({ x: 0, rotate: 0, scale: 1 });
    }, [card, controls]);

    if (!card) return <div className="flex-1 flex items-center justify-center text-white">Caricamento mazzo...</div>;

    // Controlla se la carta nel JSON ha swipeable: false (come le carte CFO)
    const isSwipeable = card.swipeable !== false;

    const handleDragEnd = (event, info) => {
        if (!isSwipeable) return;

        const offset = info.offset.x;
        if (offset > swipeThreshold) {
            onSwipe('dx');
        } else if (offset < -swipeThreshold) {
            onSwipe('sx');
        } else {
            controls.start({ x: 0, rotate: 0 }); // Torna al centro
        }
        setDragDirection(null);
    };

    return (
        <div className="flex-1 relative flex items-center justify-center overflow-hidden w-full px-6 py-4">
            <motion.div
                drag={isSwipeable ? "x" : false} // Disabilita il drag se non è swipeable
                dragConstraints={{ left: 0, right: 0 }}
                onDrag={(e, info) => {
                    if (!isSwipeable) return;
                    if (info.offset.x > 20) setDragDirection('dx');
                    else if (info.offset.x < -20) setDragDirection('sx');
                    else setDragDirection(null);
                }}
                onDragEnd={handleDragEnd}
                animate={controls}
                whileDrag={isSwipeable ? { scale: 1.05 } : {}}
                className={`w-full max-w-sm h-full max-h-[24rem] rounded-2xl shadow-2xl border flex flex-col justify-center items-center p-6 text-center relative z-10 ${isSwipeable
                        ? 'bg-slate-800 border-slate-600 cursor-grab active:cursor-grabbing'
                        : 'bg-slate-900 border-cyan-700/50 shadow-[0_0_30px_rgba(6,182,212,0.1)]' // Stile speciale per CFO
                    }`}
            >
                <div className="absolute top-4 left-4 text-xs font-bold text-slate-400">
                    {card.cat}
                </div>

                <h2 className={`text-2xl font-bold mb-4 ${isSwipeable ? 'text-white' : 'text-cyan-400'}`}>
                    {card.nome}
                </h2>

                <p className="text-slate-300 text-base leading-relaxed mb-6">
                    {card.scenario}
                </p>

                {/* Pulsante per le carte CFO */}
                {!isSwipeable && (
                    <button
                        onClick={onAcknowledge}
                        className="mt-4 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-full transition-colors border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    >
                        {card.dx?.testo || "Ho capito"}
                    </button>
                )}

                {/* Overlay visivo per lo Swipe (mostrato solo sulle carte normali) */}
                {isSwipeable && dragDirection === 'sx' && card.sx && (
                    <div className="absolute inset-0 bg-red-500/20 rounded-2xl flex items-center justify-start p-6 backdrop-blur-sm pointer-events-none">
                        <span className="text-red-400 font-bold border-4 border-red-400 p-3 transform -rotate-12 text-xl bg-slate-900/90 rounded-xl shadow-lg">
                            {card.sx.testo}
                        </span>
                    </div>
                )}
                {isSwipeable && dragDirection === 'dx' && card.dx && (
                    <div className="absolute inset-0 bg-green-500/20 rounded-2xl flex items-center justify-end p-6 backdrop-blur-sm pointer-events-none">
                        <span className="text-green-400 font-bold border-4 border-green-400 p-3 transform rotate-12 text-xl bg-slate-900/90 rounded-xl shadow-lg">
                            {card.dx.testo}
                        </span>
                    </div>
                )}
            </motion.div>
        </div>
    );
};