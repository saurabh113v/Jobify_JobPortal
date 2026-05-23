import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const AtsResult = ({ result }) => {
    if (!result) return null;

    const { score, improvements, mistakes } = result;

    // Determine color based on score
    let strokeColor = '#ef4444'; // red
    let bgStrokeColor = '#fee2e2'; // red-100
    if (score >= 80) {
        strokeColor = '#22c55e'; // green
        bgStrokeColor = '#dcfce7'; // green-100
    } else if (score >= 50) {
        strokeColor = '#eab308'; // yellow
        bgStrokeColor = '#fef9c3'; // yellow-100
    }

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">Your ATS Evaluation Result</h2>
            
            <div className="flex flex-col md:flex-row gap-8">
                {/* Score Section */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">ATS Match Score</h3>
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="transform -rotate-90 w-40 h-40">
                            <circle
                                cx="80"
                                cy="80"
                                r={radius}
                                stroke={bgStrokeColor}
                                strokeWidth="12"
                                fill="transparent"
                            />
                            <motion.circle
                                cx="80"
                                cy="80"
                                r={radius}
                                stroke={strokeColor}
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-4xl font-extrabold text-slate-800">{score}%</span>
                        </div>
                    </div>
                    <p className="mt-4 text-center text-slate-500 text-sm">
                        {score >= 80 ? "Excellent! Your resume is highly optimized." : 
                         score >= 50 ? "Good, but there is room for improvement." : 
                         "Needs work. Follow the suggestions below."}
                    </p>
                </div>

                {/* Feedback Section */}
                <div className="flex-[2] flex flex-col gap-6">
                    {/* Improvements */}
                    <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="text-blue-600 w-5 h-5" />
                            <h3 className="text-lg font-semibold text-blue-900">How to Improve</h3>
                        </div>
                        {improvements && improvements.length > 0 ? (
                            <ul className="space-y-3">
                                {improvements.map((item, index) => (
                                    <motion.li 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        key={index} 
                                        className="flex items-start gap-2 text-blue-800 text-sm leading-relaxed"
                                    >
                                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
                                        <span>{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-blue-600">No improvements suggested.</p>
                        )}
                    </div>

                    {/* Mistakes */}
                    <div className="bg-red-50/50 p-5 rounded-xl border border-red-100">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-red-600 w-5 h-5" />
                            <h3 className="text-lg font-semibold text-red-900">Mistakes / Missing Keywords</h3>
                        </div>
                        {mistakes && mistakes.length > 0 ? (
                            <ul className="space-y-3">
                                {mistakes.map((item, index) => (
                                    <motion.li 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        key={index} 
                                        className="flex items-start gap-2 text-red-800 text-sm leading-relaxed"
                                    >
                                        <XCircle className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
                                        <span>{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-red-600">No major mistakes found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AtsResult;
