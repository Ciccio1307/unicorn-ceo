import React, { useState } from 'react';

const RUN_OPTIONS = [
    {
        id: 'S',
        label: 'Social',
        icon: '📱',
        desc: 'Viral growth, network effects, creator economy'
    },
    {
        id: 'B',
        label: 'B2B SaaS',
        icon: '🏢',
        desc: 'Enterprise sales, long contracts, low churn'
    },
    {
        id: 'F',
        label: 'Fintech',
        icon: '💳',
        desc: 'Compliance, regulators, trust as a critical KPI'
    }
];

const DIFFICULTY_OPTIONS = [
    {
        id: 'EASY',
        label: 'Easy',
        icon: '🌱',
        color: 'border-emerald-500 text-emerald-400',
        activeBg: 'bg-emerald-900/50',
        desc: 'Growth and governance dilemmas. Cash 150K, K-factor 0.9. You ask yourself: "How do I grow the right way?"',
        stats: ['Cash: 150K', 'Trust: 65', 'Churn: 65']
    },
    {
        id: 'NORMAL',
        label: 'Normal',
        icon: '⚡',
        color: 'border-cyan-500 text-cyan-400',
        activeBg: 'bg-cyan-900/50',
        desc: 'The classic path from zero to IPO. Balanced resources, difficult decisions.',
        stats: ['Cash: 100K', 'Trust: 50', 'Churn: 50']
    },
    {
        id: 'HARD',
        label: 'Hard',
        icon: '💀',
        color: 'border-red-500 text-red-400',
        activeBg: 'bg-red-900/50',
        desc: 'Cards reformulated as traps. You ask yourself: "How do I survive?" No painless way out.',
        stats: ['Cash: 70K', 'Trust: 35', 'Churn: 35']
    }
];

export const MainMenu = ({ onStart }) => {
    const [selectedRun, setSelectedRun] = useState('S');
    const [selectedDiff, setSelectedDiff] = useState('NORMAL');

    const activeDiff = DIFFICULTY_OPTIONS.find(d => d.id === selectedDiff);

    return (
        <div className="h-screen w-full max-w-md mx-auto bg-slate-950 flex flex-col font-sans overflow-hidden select-none border-x border-white/5 relative">

            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-slate-950 to-slate-950 pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full px-6 pt-12 pb-8 overflow-y-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="text-xs tracking-[0.3em] text-cyan-500 uppercase mb-2 font-mono">
                        Startup Simulator
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-none">
                        UNICORN
                    </h1>
                    <h2 className="text-4xl font-black text-cyan-400 tracking-tight leading-none">
                        CEO
                    </h2>
                    <p className="text-slate-500 text-sm mt-3">
                        Swipe to decide. Survive until the IPO.
                    </p>
                </div>

                {/* Vertical (Run Type) */}
                <div className="mb-8">
                    <h3 className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-mono">
                        Choose your Vertical
                    </h3>
                    <div className="flex gap-3">
                        {RUN_OPTIONS.map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => setSelectedRun(opt.id)}
                                className={`flex-1 flex flex-col items-center py-3 px-2 rounded-xl border transition-all text-center ${selectedRun === opt.id
                                        ? 'bg-slate-800 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                        : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
                                    }`}
                            >
                                <span className="text-2xl mb-1">{opt.icon}</span>
                                <span className={`text-xs font-bold ${selectedRun === opt.id ? 'text-cyan-400' : 'text-slate-400'}`}>
                                    {opt.label}
                                </span>
                                <span className="text-[10px] text-slate-500 mt-1 leading-tight">{opt.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Difficulty */}
                <div className="mb-8">
                    <h3 className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-mono">
                        Difficulty
                    </h3>
                    <div className="flex gap-2 mb-4">
                        {DIFFICULTY_OPTIONS.map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => setSelectedDiff(opt.id)}
                                className={`flex-1 py-3 px-2 rounded-xl border transition-all font-bold text-sm ${selectedDiff === opt.id
                                        ? `${opt.activeBg} ${opt.color}`
                                        : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:border-slate-500'
                                    }`}
                            >
                                <div>{opt.icon}</div>
                                <div className="text-xs mt-1">{opt.label}</div>
                            </button>
                        ))}
                    </div>

                    {/* Difficulty detail card */}
                    {activeDiff && (
                        <div className={`rounded-xl border p-4 ${activeDiff.activeBg} ${activeDiff.color.split(' ')[0]}`}>
                            <p className="text-slate-300 text-sm leading-relaxed mb-3">
                                {activeDiff.desc}
                            </p>
                            <div className="flex gap-3">
                                {activeDiff.stats.map((s, i) => (
                                    <span key={i} className={`text-xs font-mono px-2 py-1 rounded-full bg-black/30 ${activeDiff.color.split(' ')[1]}`}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* CTA */}
                <button
                    onClick={() => onStart(selectedRun, selectedDiff)}
                    className={`w-full py-4 rounded-2xl font-black text-lg tracking-wide transition-all shadow-lg ${selectedDiff === 'HARD'
                            ? 'bg-red-700 hover:bg-red-600 text-white shadow-red-900/50 border border-red-500'
                            : selectedDiff === 'EASY'
                                ? 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-emerald-900/50 border border-emerald-500'
                                : 'bg-cyan-700 hover:bg-cyan-600 text-white shadow-cyan-900/50 border border-cyan-500'
                        }`}
                >
                    {selectedDiff === 'HARD' ? '💀 Start (if you dare)' :
                        selectedDiff === 'EASY' ? '🌱 Start Run' :
                            '⚡ Start Run'}
                </button>

                <p className="text-center text-slate-600 text-xs mt-4">
                    60 months to reach the IPO
                </p>
            </div>
        </div>
    );
};