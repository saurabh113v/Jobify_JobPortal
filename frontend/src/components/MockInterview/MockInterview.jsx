import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { INTERVIEW_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { Button } from '../ui/button';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { toast } from 'sonner';
import { 
    Sparkles, 
    Brain, 
    ArrowRight, 
    ArrowLeft, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    ChevronRight, 
    Mic, 
    MicOff,
    Video as VideoIcon, 
    VideoOff,
    Loader2,
    Monitor,
    User,
    Check,
    Volume2
} from 'lucide-react';

const MockInterview = () => {
    const { jobId } = useParams(); // May be undefined in general Services mode
    const navigate = useNavigate();
    
    // States for configuration
    const [isGeneralMode, setIsGeneralMode] = useState(!jobId || jobId === 'custom');
    const [selectedRole, setSelectedRole] = useState("Software Engineer");
    const [customRoleText, setCustomRoleText] = useState("");


    
    // Media & Camera States
    const videoRef = useRef(null);
    const [videoStream, setVideoStream] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [micMuted, setMicMuted] = useState(false);

    // Job / Questions States
    const [job, setJob] = useState(null);
    const [loadingJob, setLoadingJob] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [submittingAnswers, setSubmittingAnswers] = useState(false);
    
    const [step, setStep] = useState(0); // 0 = Setup/Welcome, 1-5 = Questions
    const [answers, setAnswers] = useState({ 0: "", 1: "", 2: "", 3: "", 4: "" });
    const [errorMessage, setErrorMessage] = useState("");

    // Voice Recognition (Speech-to-Text) States
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    // Speech Synthesis (Text-to-Speech) Function
    const speakQuestion = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Cancel ongoing speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95; // Professional corporate pace
            utterance.pitch = 1.0;
            
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => 
                voice.lang.startsWith('en') && 
                (voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Microsoft'))
            );
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            window.speechSynthesis.speak(utterance);
        }
    };

    // Auto-Speak whenever step changes
    useEffect(() => {
        if (step > 0 && step <= 5 && questions[step - 1]) {
            const timer = setTimeout(() => {
                speakQuestion(questions[step - 1]);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [step, questions]);

    // Cleanup speech on unmount
    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Preset Roles
    const presetRoles = [
        "Software Engineer",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "Data Scientist",
        "Product Manager",
        "UI/UX Designer",
        "HR Manager"
    ];

    // Fetch Job Details if in specific job mode
    useEffect(() => {
        if (jobId && jobId !== 'custom') {
            const fetchJobDetails = async () => {
                try {
                    setLoadingJob(true);
                    const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                    if (res.data.success) {
                        setJob(res.data.job);
                        setIsGeneralMode(false);
                    } else {
                        toast.error("Failed to load job details.");
                    }
                } catch (error) {
                    console.error("Job details error:", error);
                    toast.error("Error retrieving job information.");
                } finally {
                    setLoadingJob(false);
                }
            };
            fetchJobDetails();
        }
    }, [jobId]);

    // Webcam Media Access Handler
    const enableCamera = async () => {
        try {
            if (videoStream) {
                // Already running
                return;
            }
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 }, 
                audio: true 
            });
            setVideoStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setCameraActive(true);
            toast.success("Webcam live feed enabled successfully.");
        } catch (error) {
            console.error("Camera access error:", error);
            toast.error("Webcam access denied. Please allow camera and mic permissions to run Face-to-Face Mock Interview.");
        }
    };

    // Toggle Camera State
    const toggleCamera = () => {
        if (videoStream) {
            const videoTracks = videoStream.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = !track.enabled;
            });
            setCameraActive(!cameraActive);
        } else {
            enableCamera();
        }
    };

    // Toggle Mic Mute State
    const toggleMic = () => {
        if (videoStream) {
            const audioTracks = videoStream.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = !track.enabled;
            });
            setMicMuted(!micMuted);
        }
    };

    // Clean up video stream on unmount
    useEffect(() => {
        return () => {
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [videoStream]);

    // Speech-to-Text Recognition Hook Setup
    useEffect(() => {
        const SpeechObj = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechObj) {
            const recognition = new SpeechObj();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.onresult = (event) => {
                const speechResult = event.results[0][0].transcript;
                if (speechResult) {
                    setAnswers(prev => {
                        const currentVal = prev[step - 1] || "";
                        return {
                            ...prev,
                            [step - 1]: currentVal ? `${currentVal.trim()} ${speechResult}.` : `${speechResult}.`
                        };
                    });
                }
            };

            recognitionRef.current = recognition;
        }
    }, [step]);

    // Speech-to-Text Trigger Handler
    const toggleVoiceListening = () => {
        if (!recognitionRef.current) {
            toast.error("Speech recognition is not supported in this browser. Please type your answers manually.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
            } catch (err) {
                console.error("Speech Recognition starting error:", err);
                recognitionRef.current.stop();
            }
        }
    };

    // Start Interview: Fetch AI generated questions
    const startInterviewHandler = async () => {
        const finalRole = isGeneralMode 
            ? (selectedRole === "Other" ? customRoleText : selectedRole)
            : job?.title;

        if (!finalRole) {
            toast.error("Please enter a target role to practice.");
            return;
        }

        try {
            setLoadingQuestions(true);
            setErrorMessage("");
            
            // Post payload
            const payload = { role: finalRole };
            const endpointJobId = isGeneralMode ? "custom" : jobId;

            const res = await axios.post(
                `${INTERVIEW_API_END_POINT}/generate/${endpointJobId}`, 
                payload, 
                { withCredentials: true }
            );

            if (res.data.success) {
                setQuestions(res.data.questions);
                setStep(1); // Proceed to first question
                enableCamera(); // Proactively start webcam stream
                toast.success(`Face-to-Face interview for ${finalRole} generated!`);
            } else {
                setErrorMessage(res.data.message || "Failed to generate interview questions.");
            }
        } catch (error) {
            console.error("Generate questions error:", error);
            const msg = error.response?.data?.message || "An error occurred starting the interview session.";
            setErrorMessage(msg);
            toast.error(msg);
        } finally {
            setLoadingQuestions(false);
        }
    };

    // Answer change handler
    const handleAnswerChange = (qIndex, value) => {
        setAnswers(prev => ({
            ...prev,
            [qIndex]: value
        }));
    };

    const handleNext = () => {
        if (step < 5) {
            setStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (step > 1) {
            setStep(prev => prev - 1);
        }
    };

    // Submit answers for evaluation
    const handleSubmitInterview = async () => {
        const finalRole = isGeneralMode 
            ? (selectedRole === "Other" ? customRoleText : selectedRole)
            : job?.title;

        // Construct standard body format: answers array of { question, answer }
        const qaPayload = questions.map((q, idx) => ({
            question: q,
            answer: answers[idx]?.trim() || "No response provided."
        }));

        try {
            setSubmittingAnswers(true);
            
            // Stop media stream tracks proactively to release camera
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
            }

            const endpointJobId = isGeneralMode ? "custom" : jobId;
            const res = await axios.post(
                `${INTERVIEW_API_END_POINT}/evaluate/${endpointJobId}`, 
                { answers: qaPayload, role: finalRole }, 
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success("Interview completed! Loading scorecard...");
                navigate(`/interview-result/${res.data.data._id}`);
            } else {
                toast.error(res.data.message || "Failed to submit answers.");
            }
        } catch (error) {
            console.error("Submit answers error:", error);
            toast.error(error.response?.data?.message || "An error occurred during evaluation.");
        } finally {
            setSubmittingAnswers(false);
        }
    };

    if (loadingJob) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
                <Navbar />
                <div className="flex flex-col items-center justify-center flex-grow py-12">
                    <Loader2 className="w-12 h-12 text-[#6A38C2] animate-spin" />
                    <p className="mt-4 text-slate-500 font-medium">Configuring visual face-to-face modules...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
            <Navbar />
            
            <main className="flex-grow max-w-6xl mx-auto w-full py-10 px-6">
                
                {/* 🌟 STEP 0: SETUP SCREEN - ROLE SELECTOR */}
                {step === 0 && (
                    <div className="bg-white border border-slate-200/80 shadow-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden transition-all duration-500">
                        {/* Glow accent */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[90px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none"></div>

                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-[#6A38C2]/5 border border-[#6A38C2]/15 rounded-2xl flex items-center justify-center text-[#6A38C2] shadow-sm animate-pulse">
                                <Brain className="w-8 h-8" />
                            </div>
                            
                            <div className="space-y-2">
                                <span className="text-xs font-bold tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100 uppercase">
                                    Face-to-Face AI Interview
                                </span>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                                    {isGeneralMode ? "Launch Face-to-Face AI Prep" : `Start Video Interview for ${job?.title}`}
                                </h1>
                                <p className="text-slate-500 max-w-xl text-sm leading-relaxed mt-1">
                                    Simulate a modern corporate video call. Enable your camera to look face-to-face at the virtual recruiter and practice dictating responses using your voice.
                                </p>
                            </div>

                            {/* Setup Form (Only General Mode) */}
                            {isGeneralMode && (
                                <div className="w-full max-w-md bg-slate-50 border border-slate-200 p-6 rounded-2xl text-left space-y-4 shadow-inner">
                                    <h3 className="font-bold text-slate-700 text-sm">Choose Your Practice Target:</h3>
                                    
                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold text-slate-400 uppercase">Select Job Category</label>
                                        <select 
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#6A38C2] text-sm font-semibold"
                                        >
                                            {presetRoles.map((role) => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                            <option value="Other">Custom Role / Category</option>
                                        </select>
                                    </div>

                                    {selectedRole === "Other" && (
                                        <div className="space-y-2 animate-fade-in">
                                            <label className="block text-xs font-bold text-slate-400 uppercase">Type Job Title</label>
                                            <input 
                                                type="text" 
                                                value={customRoleText}
                                                onChange={(e) => setCustomRoleText(e.target.value)}
                                                placeholder="e.g. Cloud Architect, Mobile Developer"
                                                className="w-full p-3 border border-slate-200 focus:outline-none focus:border-[#6A38C2] rounded-xl bg-white text-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Checklist Panel */}
                            <div className="w-full border-t border-slate-100 py-6 max-w-xl text-left space-y-4">
                                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Features Checklist:</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                                        <VideoIcon className="w-5 h-5 text-[#6A38C2] shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-slate-750 text-sm">Live Webcam Overlay</h4>
                                            <p className="text-xs text-slate-500 mt-0.5">Observe your eye-contact and posture next to the interviewer during responses.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                                        <Mic className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-slate-750 text-sm">AI Voice Dictation</h4>
                                            <p className="text-xs text-slate-500 mt-0.5">Dictate responses seamlessly using browser Speech-to-Text recognition.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="w-full bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3 text-left max-w-md">
                                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                    <div className="text-sm text-rose-700 font-semibold">{errorMessage}</div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center pt-2">
                                <Button 
                                    onClick={() => navigate(jobId ? `/description/${jobId}` : '/home')}
                                    variant="outline" 
                                    className="w-full sm:w-auto px-8 py-6 rounded-xl border-slate-200 text-slate-600"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={startInterviewHandler}
                                    disabled={loadingQuestions}
                                    className="w-full sm:w-auto px-10 py-6 bg-gradient-to-r from-[#6A38C2] to-pink-500 hover:from-[#5b30a6] hover:to-pink-600 text-white shadow-lg shadow-[#6A38C2]/15 rounded-xl font-bold flex items-center justify-center gap-2 group transition-all duration-300"
                                >
                                    {loadingQuestions ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Analyzing & Generating Call...
                                        </>
                                    ) : (
                                        <>
                                            Enter Video Call
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 📝 ACTIVE SPLIT-SCREEN FACE-TO-FACE VIDEO INTERVIEW WORKSPACE */}
                {step > 0 && !submittingAnswers && (
                    <div className="space-y-6 animate-fade-in transition-all duration-500">
                        
                        {/* Progress Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs font-bold tracking-widest text-[#6A38C2] uppercase bg-[#6A38C2]/5 px-3 py-1 rounded-md border border-[#6A38C2]/10">
                                    Live Session
                                </span>
                                <h3 className="font-extrabold text-slate-900 mt-1 text-lg">
                                    Practicing: {isGeneralMode ? (selectedRole === "Other" ? customRoleText : selectedRole) : job?.title}
                                </h3>
                            </div>
                            <span className="text-sm font-bold text-slate-500">Question {step} of 5</span>
                        </div>

                        {/* Split Screen Grid (Google Meet / Zoom Style) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            
                            {/* LEFT PANEL: Candidate Webcam Live Video Feed */}
                            <div className="lg:col-span-5 flex flex-col space-y-4">
                                <div className="bg-slate-950 border border-slate-800 rounded-3xl aspect-video w-full overflow-hidden relative shadow-2xl flex items-center justify-center">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted // Candidate hears themselves in real space, so mute playback to prevent screeching loops
                                        className="w-full h-full object-cover transform -scale-x-100"
                                    ></video>

                                    {/* Video Off Placeholder */}
                                    {!cameraActive && (
                                        <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-center p-4">
                                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-700">
                                                <User className="w-8 h-8" />
                                            </div>
                                            <p className="mt-3 text-slate-400 text-xs font-bold uppercase tracking-wider">Webcam Video Feed Disabled</p>
                                        </div>
                                    )}

                                    {/* Media overlays */}
                                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                                        <span className="bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 border border-slate-800/60">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                            Candidate (You)
                                        </span>

                                        <div className="flex items-center gap-2 pointer-events-auto">
                                            <button 
                                                onClick={toggleMic} 
                                                className={`p-2.5 rounded-xl border transition-all duration-300 ${
                                                    micMuted 
                                                        ? 'bg-rose-500/20 text-rose-500 border-rose-500/30' 
                                                        : 'bg-slate-900/60 text-slate-300 border-slate-800/60 hover:bg-slate-800'
                                                }`}
                                                title={micMuted ? "Unmute Mic" : "Mute Mic"}
                                            >
                                                {micMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                            </button>
                                            <button 
                                                onClick={toggleCamera} 
                                                className={`p-2.5 rounded-xl border transition-all duration-300 ${
                                                    !cameraActive 
                                                        ? 'bg-rose-500/20 text-rose-500 border-rose-500/30' 
                                                        : 'bg-slate-900/60 text-slate-300 border-slate-800/60 hover:bg-slate-800'
                                                }`}
                                                title={cameraActive ? "Disable Camera" : "Enable Camera"}
                                            >
                                                {cameraActive ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
                                    <Volume2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <div className="text-xs text-slate-500 font-semibold leading-relaxed">
                                        <span className="font-extrabold text-slate-700">Dictation Tip:</span> Click the microphone button in the response workspace. Wait for the box to glow, then dictate your answer. Keep answers concise and metric-focused.
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT PANEL: AI Recruiter Bot Panel & Voice/Text Inputs */}
                            <div className="lg:col-span-7 bg-white border border-slate-250 shadow-lg shadow-slate-100 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-[#6A38C2]/5 rounded-full blur-3xl pointer-events-none"></div>

                                {/* AI Recruiter Bot Panel */}
                                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                    <div className="w-10 h-10 rounded-2xl bg-[#6A38C2]/5 border border-[#6A38C2]/15 flex items-center justify-center text-[#6A38C2] shrink-0">
                                        <Brain className="w-5 h-5 animate-pulse" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">AI Virtual Recruiter Panel</h4>
                                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                            Active Speech Feed
                                        </p>
                                    </div>
                                </div>

                                {/* Active Question */}
                                <div className="bg-[#6A38C2]/5 border border-[#6A38C2]/10 rounded-2xl p-5 relative">
                                    <span className="text-[9px] font-extrabold text-[#6A38C2] uppercase bg-[#6A38C2]/10 px-2 py-0.5 rounded-md absolute -top-3 left-4">
                                        Interviewer Question
                                    </span>
                                    <div className="flex items-start justify-between gap-4 pt-1">
                                        <h2 className="text-lg md:text-xl font-extrabold text-slate-850 tracking-tight leading-relaxed flex-grow">
                                            {questions[step - 1]}
                                        </h2>
                                        <button
                                            onClick={() => speakQuestion(questions[step - 1])}
                                            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 shadow-sm text-slate-500 hover:text-[#6A38C2] transition-colors shrink-0 mt-1"
                                            title="Replay Question Voice"
                                        >
                                            <Volume2 className="w-4.5 h-4.5 text-[#6A38C2]" />
                                        </button>
                                    </div>
                                </div>

                                {/* Answer Input & Mic triggers */}
                                <div className="space-y-3.5">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                                        <span>Candidate Response Workspace</span>
                                        <span>{answers[step - 1]?.length || 0} characters</span>
                                    </div>

                                    <div className="relative">
                                        <textarea
                                            value={answers[step - 1] || ""}
                                            onChange={(e) => handleAnswerChange(step - 1, e.target.value)}
                                            placeholder="Dictate your response by tapping the microphone below, or type your structured answer here..."
                                            rows={6}
                                            className={`w-full border bg-slate-50/20 hover:border-slate-350 focus:border-[#6A38C2] rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#6A38C2]/5 transition-all duration-300 resize-none leading-relaxed text-sm md:text-base font-semibold ${
                                                isListening ? 'ring-4 ring-emerald-500/20 border-emerald-500' : 'border-slate-250'
                                            }`}
                                        ></textarea>

                                        {/* Mic button overlays */}
                                        <div className="absolute bottom-4 right-4 z-20">
                                            <button
                                                type="button"
                                                onClick={toggleVoiceListening}
                                                className={`p-3 rounded-full border shadow-md flex items-center justify-center transition-all duration-300 ${
                                                    isListening 
                                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500 animate-ping' 
                                                        : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                                                }`}
                                                title={isListening ? "Listening... Click to Pause" : "Click to Dictate Answer"}
                                            >
                                                <Mic className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {isListening && (
                                        <div className="text-xs font-bold text-emerald-600 animate-pulse flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                                            Speech Recognition Active... Talk directly to the interviewer bot.
                                        </div>
                                    )}
                                </div>

                                {/* Custom wizard control footer */}
                                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                                    <Button 
                                        onClick={handlePrev}
                                        disabled={step === 1}
                                        variant="outline"
                                        className="px-6 py-6 border-slate-200 text-slate-650 rounded-xl flex items-center gap-2 font-semibold"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Prev
                                    </Button>

                                    {step < 5 ? (
                                        <Button 
                                            onClick={handleNext}
                                            className="px-8 py-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-2 font-bold shadow-lg"
                                        >
                                            Next Question
                                            <ChevronRight className="w-5 h-5" />
                                        </Button>
                                    ) : (
                                        <Button 
                                            onClick={handleSubmitInterview}
                                            className="px-10 py-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                                        >
                                            Submit Interview
                                            <CheckCircle2 className="w-5 h-5" />
                                        </Button>
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>
                )}

                {/* 🔄 LOADING SCREEN */}
                {submittingAnswers && (
                    <div className="bg-white border border-slate-200/80 shadow-2xl rounded-3xl p-12 text-center space-y-8 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden">
                        <div className="absolute w-[300px] h-[300px] rounded-full border border-emerald-500/10 animate-ping pointer-events-none"></div>
                        <div className="absolute w-[450px] h-[450px] rounded-full border border-[#6A38C2]/5 animate-pulse pointer-events-none"></div>
                        
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-[#6A38C2] border-r-emerald-500 animate-spin flex items-center justify-center">
                                <Brain className="w-10 h-10 text-[#6A38C2] animate-pulse" />
                            </div>
                        </div>

                        <div className="space-y-3 max-w-md">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Evaluating Performance</h2>
                            <p className="text-slate-500 text-sm leading-relaxed font-semibold">
                                Please wait while Google Gemini AI grades your split-screen video call responses and generates your custom dashboard scorecard.
                            </p>
                        </div>
                    </div>
                )}

            </main>

            <Footer />
        </div>
    );
};

export default MockInterview;
