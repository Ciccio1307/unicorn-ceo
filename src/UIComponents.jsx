import React from 'react';

const DIFF_STYLE = {
    EASY: 'text-emerald-400 border-emerald-700/50',
    NORMAL: 'text-cyan-400 border-cyan-700/50',
    HARD: 'text-red-400 border-red-700/50',
};

const RUN_LABEL = { S: 'Social', B: 'B2B', F: 'Fintech' };

export const TopDashboard = ({ kpis, month, phase, difficulty = 'NORMAL', runType = 'S' }) => {
    const diffStyle = DIFF_STYLE[difficulty] || DIFF_STYLE.NORMAL;

    return (
        <div className="w-full p-4 bg-slate-900/50 backdrop-blur-md border-b border-white/10 flex flex-col gap-2 shadow-lg">

            {/* Top row: Phase / Month / Difficulty */}
            <div className="flex justify-between items-center text-white font-bold">
                <span className="text-sm">PHASE {phase}</span>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${diffStyle}`}>
                        {difficulty}{difficulty === 'HARD' ? ' 💀' : ''}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{RUN_LABEL[runType]}</span>
                </div>
                <span className="text-sm">MONTH {month}/60</span>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-4 gap-2 text-sm font-mono">
                <div className="flex flex-col text-green-400">
                    <span className="text-xs">CASH</span>
                    <span className="text-lg font-bold">{kpis.cash}K</span>
                </div>
                <div className="flex flex-col text-cyan-400">
                    <span className="text-xs">USERS</span>
                    <span className="text-lg font-bold">{kpis.utenti}</span>
                </div>
                <div className="flex flex-col text-pink-400">
                    <span className="text-xs">CHURN</span>
                    <span className="text-lg font-bold">{kpis.churn}</span>
                </div>
                <div className="flex flex-col text-white">
                    <span className="text-xs">VALUE</span>
                    <span className="text-lg font-bold">{kpis.valore}M</span>
                </div>
            </div>

            {/* Cash bar */}
            <div className="w-full bg-slate-800 rounded-full h-1">
                <div
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                        width: `${Math.min(100, Math.max(0, (kpis.cash / (difficulty === 'EASY' ? 150 : difficulty === 'HARD' ? 70 : 100)) * 100))}%`,
                        backgroundColor: kpis.cash > 30 ? '#22c55e' : kpis.cash > 15 ? '#f59e0b' : '#ef4444'
                    }}
                />
            </div>
        </div>
    );
};

export const BentoGrid = ({ logs, flags }) => {
    return (
        <div className="w-full p-4 grid grid-cols-2 gap-4 h-full">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col gap-2 overflow-y-auto">
                <h3 className="text-white/70 text-xs font-bold uppercase tracking-wide">Operational Logs</h3>
                {logs.length === 0 && (
                    <p className="text-slate-600 text-xs italic">No events yet...</p>
                )}
                {logs.map((log, i) => (
                    <p key={i} className="text-white/90 text-xs border-l-2 border-cyan-500 pl-2 leading-snug">{log}</p>
                ))}
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col gap-2">
                <h3 className="text-white/70 text-xs font-bold uppercase tracking-wide">Active Flags</h3>
                {flags.length === 0 && (
                    <p className="text-slate-600 text-xs italic">No active flags</p>
                )}
                <div className="flex flex-wrap gap-2">
                    {flags.map((flag, i) => (
                        <span key={i} className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full border border-pink-500/30">
                            {flag.replace(/_/g, ' ')}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};