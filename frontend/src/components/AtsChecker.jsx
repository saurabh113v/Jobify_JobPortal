import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Button } from './ui/button';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import AtsResult from './AtsResult';
import { ATS_API_END_POINT } from '@/utils/constant';

const AtsChecker = () => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
        } else {
            toast.error("Please upload a valid PDF file.");
            e.target.value = null; // reset
        }
    };

    const handleCheckScore = async () => {
        if (!file) {
            toast.error("Please upload your resume first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        if (jobDescription.trim()) {
            formData.append("jobDescription", jobDescription);
        }

        try {
            setLoading(true);
            setResult(null); // reset previous result

            // In local dev, API endpoint is usually http://127.0.0.1:8000/api/v1 or similar.
            // Using a relative path or constant API endpoint if configured.
            // But since constant doesn't have ATS, we'll hardcode or assume the base URL structure.
            // Typically, the USER_API_END_POINT in this app is like http://127.0.0.1:8000/api/v1/user
            // We will use standard path /api/v1/ats/check if running via proxy, otherwise construct it.
            // I'll assume standard vite proxy or absolute url.
            
            const res = await axios.post(`${ATS_API_END_POINT}/check`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setResult(res.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to check ATS score.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-pink-500">ATS Score Checker</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Upload your resume and optionally provide a job description. Our AI will analyze your resume against ATS criteria and provide actionable feedback.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    {/* Left: File Upload */}
                    <div className="flex flex-col gap-4">
                        <label className="text-sm font-semibold text-slate-700">1. Upload Resume (PDF Only)</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-[#6A38C2] transition-colors relative group">
                            <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-[#6A38C2] mb-3 transition-colors" />
                            <p className="text-sm font-medium text-slate-600">Drag & drop your PDF here</p>
                            <p className="text-xs text-slate-400 mt-1">or click to browse</p>
                            <input 
                                type="file" 
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        {file && (
                            <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 text-sm">
                                <FileText className="w-4 h-4" />
                                <span className="font-medium truncate">{file.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Right: Job Description */}
                    <div className="flex flex-col gap-4">
                        <label className="text-sm font-semibold text-slate-700">2. Job Description (Optional)</label>
                        <textarea 
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the target job description here for a tailored evaluation..."
                            className="w-full h-[180px] p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6A38C2]/50 focus:border-[#6A38C2] resize-none text-sm transition-all bg-slate-50/50 hover:bg-white"
                        />
                    </div>
                </div>

                <div className="flex justify-center mt-8">
                    <Button 
                        onClick={handleCheckScore}
                        disabled={loading || !file}
                        className="bg-gradient-to-r from-[#6A38C2] to-pink-500 hover:from-[#5b30a6] hover:to-[#d94680] text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg shadow-pink-500/25 transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Analyzing Resume...
                            </>
                        ) : (
                            "Check ATS Score"
                        )}
                    </Button>
                </div>

                {/* Result Section */}
                {loading ? (
                    <div className="mt-16 flex flex-col items-center justify-center text-slate-500 animate-pulse">
                        <Loader2 className="w-10 h-10 animate-spin text-[#6A38C2] mb-4" />
                        <p>Our AI is reviewing your resume. This might take a few seconds...</p>
                    </div>
                ) : (
                    <AtsResult result={result} />
                )}

            </div>
        </div>
    );
};

export default AtsChecker;
