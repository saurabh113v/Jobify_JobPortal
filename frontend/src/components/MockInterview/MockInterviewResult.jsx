import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';
import { Button } from '../ui/button';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { toast } from 'sonner';
import { 
    Award, 
    Brain, 
    CheckCircle2, 
    ArrowLeft, 
    History, 
    Loader2, 
    Sparkles, 
    AlertCircle,
    User,
    Check,
    HelpCircle
} from 'lucide-react';

const MockInterviewResult = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeQuestionTab, setActiveQuestionTab] = useState(0);

    useEffect(() => {
        const fetchSessionReport = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${INTERVIEW_API_END_POINT}/session/${id}`, { withCredentials: true });
                if (res.data.success) {
                    setSession(res.data.interview);
                } else {
                    toast.error("Failed to load scorecard.");
                }
            } catch (error) {
                console.error("Fetch session report error:", error);
                toast.error("An error occurred loading the report.");
            } finally {
                setLoading(false);
            }
        };
        fetchSessionReport();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
                <Navbar />
                <div className="flex flex-col items-center justify-center flex-grow py-12">
                    <Loader2 className="w-12 h-12 text-[#6A38C2] animate-spin" />
                    <p className="mt-4 text-slate-500 font-medium">Assembling your custom AI scorecard...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center py-12 max-w-md mx-auto text-center px-6">
                    <AlertCircle className="w-16 h-16 text-rose-500" />
                    <h2 className="text-2xl font-extrabold text-slate-900 mt-4">Scorecard Not Found</h2>
                    <p className="text-slate-500 mt-2">The requested mock interview result does not exist or you do not have permission to view it.</p>
                    <Button onClick={() => navigate('/profile')} className="mt-6 bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl">
                        Go to Practice History
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    const { job, score, feedback, qa, customRole } = session;

    // Define color mappings for scores
    const getScoreColorClasses = (s) => {
        if (s >= 80) return {
            border: "border-emerald-500",
            bg: "bg-emerald-50 text-emerald-700",
            glow: "shadow-emerald-500/10",
            badge: "bg-emerald-500 text-white",
            text: "text-emerald-600"
        };
        if (s >= 50) return {
            border: "border-amber-500",
            bg: "bg-amber-50 text-amber-700",
            glow: "shadow-amber-500/10",
            badge: "bg-amber-500 text-white",
            text: "text-amber-600"
        };
        return {
            border: "border-rose-500",
            bg: "bg-rose-50 text-rose-700",
            glow: "shadow-rose-500/10",
            badge: "bg-rose-500 text-white",
            text: "text-rose-600"
        };
    };

    const scoreStyle = getScoreColorClasses(score);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
            <Navbar />
            
            <main className="flex-grow max-w-5xl mx-auto w-full py-12 px-6 space-y-8 animate-fade-in">
                
                {/* 🏷️ BREADCRUMB HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <span className="text-xs font-bold tracking-widest text-[#6A38C2] uppercase bg-[#6A38C2]/5 px-3 py-1 rounded-md border border-[#6A38C2]/10">
                            Interview Evaluation
                        </span>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
                            AI Scorecard: {job?.title || customRole || "AI Practice"}
                        </h1>
                        <p className="text-slate-500 font-semibold">{job?.company?.name || "Global Face-to-Face Simulation"}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <Button 
                            onClick={() => navigate('/profile')} 
                            variant="outline"
                            className="rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 flex items-center gap-2 font-semibold"
                        >
                            <History className="w-4 h-4" />
                            Practice Log
                        </Button>
                        {job ? (
                            <Button 
                                onClick={() => navigate(`/description/${job?._id}`)} 
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-slate-950/15"
                            >
                                <ArrowLeft className="w-4 h-4 text-white" />
                                Back to Job
                            </Button>
                        ) : (
                            <Button 
                                onClick={() => navigate('/face-to-face-interview')} 
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/10"
                            >
                                <ArrowLeft className="w-4 h-4 text-white" />
                                Practice Another
                            </Button>
                        )}
                    </div>
                </div>

                {/* 📊 CORE SCORE SUMMARY & FEEDBACK CARD */}
                <div className="bg-white border border-slate-200 shadow-xl shadow-slate-100 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-8 items-center relative overflow-hidden">
                    {/* Glow Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#6A38C2]/5 rounded-full blur-[85px] pointer-events-none"></div>

                    {/* Radial Score Gauge */}
                    <div className="flex flex-col items-center justify-center text-center space-y-2 md:border-r border-slate-100 md:pr-4">
                        <div className="relative w-36 h-36 flex items-center justify-center">
                            {/* Inner circle background */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle 
                                    cx="72" cy="72" r="58" 
                                    className="stroke-slate-100 fill-none" 
                                    strokeWidth="10"
                                />
                                <circle 
                                    cx="72" cy="72" r="58" 
                                    className={`fill-none transition-all duration-1000 ${
                                        score >= 80 ? "stroke-emerald-500" :
                                        score >= 50 ? "stroke-amber-500" :
                                        "stroke-rose-500"
                                    }`} 
                                    strokeWidth="10"
                                    strokeDasharray={2 * Math.PI * 58}
                                    strokeDashoffset={2 * Math.PI * 58 * (1 - score / 100)}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className="text-4xl font-extrabold text-slate-900 tracking-tighter">{score}%</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ready Score</span>
                            </div>
                        </div>

                        <div className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase border shadow-sm ${scoreStyle.bg} ${scoreStyle.border}`}>
                            {score >= 80 ? "Interview Ready" : score >= 50 ? "Almost Ready" : "Practice Needed"}
                        </div>
                    </div>

                    {/* Overview Critique Paragraph */}
                    <div className="md:col-span-3 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-[#6A38C2]">
                                <Brain className="w-4.5 h-4.5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">AI General Performance Review</h3>
                        </div>

                        <p className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-line font-medium">
                            {feedback}
                        </p>
                    </div>
                </div>

                {/* 📝 INDIVIDUAL QUESTION CRITIQUES PANEL */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                        <Sparkles className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Question-by-Question Breakdown</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Questions sidebar selectors */}
                        <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                            {qa.map((item, idx) => {
                                const active = activeQuestionTab === idx;
                                const itemStyle = getScoreColorClasses(item.score);
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveQuestionTab(idx)}
                                        className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between shrink-0 min-w-[180px] lg:min-w-0 ${
                                            active 
                                                ? "bg-white border-[#6A38C2] shadow-md shadow-[#6A38C2]/5 scale-[1.02]" 
                                                : "bg-slate-100/50 hover:bg-slate-100 border-slate-200 hover:border-slate-300"
                                        }`}
                                    >
                                        <div className="min-w-0 flex-grow pr-3">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question {idx + 1}</div>
                                            <div className="text-xs font-bold text-slate-700 truncate mt-1">{item.question}</div>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md shrink-0 ${itemStyle.bg} border ${itemStyle.border}`}>
                                            {item.score}%
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Question feedback panel workspace */}
                        <div className="lg:col-span-8 bg-white border border-slate-200/80 shadow-md shadow-slate-100 rounded-3xl p-6 md:p-8 space-y-6">
                            
                            {/* Question and Score Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                                <div className="space-y-1">
                                    <div className="text-xs font-bold text-[#6A38C2] uppercase tracking-widest">Question {activeQuestionTab + 1}</div>
                                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
                                        {qa[activeQuestionTab].question}
                                    </h3>
                                </div>

                                <div className="shrink-0 flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score:</span>
                                    <span className={`text-lg font-extrabold px-3.5 py-1.5 rounded-xl border shadow-sm ${
                                        getScoreColorClasses(qa[activeQuestionTab].score).bg
                                    } ${
                                        getScoreColorClasses(qa[activeQuestionTab].score).border
                                    }`}>
                                        {qa[activeQuestionTab].score}/100
                                    </span>
                                </div>
                            </div>

                            {/* Candidate's submitted response */}
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <User className="w-3.5 h-3.5 text-slate-400" />
                                    Your Answer
                                </div>
                                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium">
                                    {qa[activeQuestionTab].answer}
                                </div>
                            </div>

                            {/* Individual AI Critique Feedback */}
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-2 text-xs font-bold text-[#6A38C2] uppercase tracking-widest">
                                    <Brain className="w-3.5 h-3.5 text-[#6A38C2]" />
                                    AI Critique Assessment
                                </div>
                                <div className="bg-[#6A38C2]/5 border border-[#6A38C2]/10 rounded-2xl p-4 text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium">
                                    {qa[activeQuestionTab].feedback}
                                </div>
                            </div>

                            {/* Standard Ideal Expert Answer */}
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest">
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    Ideal Expert Answer (X-Y-Z Method)
                                </div>
                                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium">
                                    {qa[activeQuestionTab].idealAnswer}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default MockInterviewResult;
