import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { 
    ChevronRight, 
    ChevronLeft, 
    Sparkles, 
    Download, 
    Plus, 
    Trash2, 
    User, 
    Briefcase, 
    GraduationCap, 
    FolderGit2, 
    Cpu, 
    FileText, 
    Palette,
    ArrowLeft
} from 'lucide-react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'

const ResumeMaker = () => {
    const { user } = useSelector(store => store.auth);

    // Initial state matching standard resume fields
    const [personalDetails, setPersonalDetails] = useState({
        fullName: user?.fullname || '',
        jobTitle: user?.profile?.bio || '',
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        linkedin: '',
        portfolio: '',
        summary: ''
    });

    const [experiences, setExperiences] = useState([
        { id: 1, title: 'Software Engineer Intern', company: 'Tech Corp', dates: 'June 2025 - Present', description: 'Developed React dashboard applications and integrated state-of-the-art API webhooks.' }
    ]);

    const [educations, setEducations] = useState([
        { id: 1, school: 'State University', degree: 'B.S. in Computer Science', dates: '2022 - 2026', grade: 'GPA: 3.8/4.0' }
    ]);

    const [projects, setProjects] = useState([
        { id: 1, name: 'E-Commerce Portal', tech: 'React, Node.js, MongoDB', description: 'Designed a highly interactive marketplace portal with secure payment triggers and search.' }
    ]);

    const [skills, setSkills] = useState(
        user?.profile?.skills || ['React', 'JavaScript', 'Tailwind CSS', 'Node.js']
    );

    const [newSkill, setNewSkill] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('minimalist'); // 'minimalist' | 'modern' | 'executive'
    const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'template'

    // AI loading states
    const [aiLoadingSummary, setAiLoadingSummary] = useState(false);
    const [aiLoadingExperience, setAiLoadingExperience] = useState({});

    // Personal details handler
    const handlePersonalChange = (e) => {
        setPersonalDetails({ ...personalDetails, [e.target.name]: e.target.value });
    };

    // Experience handlers
    const addExperience = () => {
        setExperiences([...experiences, { id: Date.now(), title: '', company: '', dates: '', description: '' }]);
    };

    const removeExperience = (id) => {
        setExperiences(experiences.filter(exp => exp.id !== id));
    };

    const handleExperienceChange = (id, field, value) => {
        setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
    };

    // Education handlers
    const addEducation = () => {
        setEducations([...educations, { id: Date.now(), school: '', degree: '', dates: '', grade: '' }]);
    };

    const removeEducation = (id) => {
        setEducations(educations.filter(edu => edu.id !== id));
    };

    const handleEducationChange = (id, field, value) => {
        setEducations(educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
    };

    // Project handlers
    const addProject = () => {
        setProjects([...projects, { id: Date.now(), name: '', tech: '', description: '' }]);
    };

    const removeProject = (id) => {
        setProjects(projects.filter(proj => proj.id !== id));
    };

    const handleProjectChange = (id, field, value) => {
        setProjects(projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj));
    };

    // Skills handlers
    const addSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    // AI summary generation
    const generateSummaryWithAI = async () => {
        if (!personalDetails.jobTitle) {
            toast.error("Please enter a Target Job Title first to guide the AI.");
            return;
        }

        setAiLoadingSummary(true);
        try {
            const res = await axios.post("http://localhost:4000/api/v1/resume/refine-summary", {
                role: personalDetails.jobTitle,
                skills: skills,
                draftSummary: personalDetails.summary
            }, { withCredentials: true });

            if (res.data.success) {
                setPersonalDetails(prev => ({ ...prev, summary: res.data.data.summary }));
                toast.success("AI generated summary successfully!");
            }
        } catch (error) {
            console.error("AI summary error:", error);
            toast.error(error.response?.data?.message || "Failed to generate AI summary.");
        } finally {
            setAiLoadingSummary(false);
        }
    };

    // AI experience bullet point refinement
    const refineExperienceBulletsWithAI = async (id, draftText, title, company) => {
        if (!draftText) {
            toast.error("Please provide some basic draft or tasks for this role first.");
            return;
        }

        setAiLoadingExperience(prev => ({ ...prev, [id]: true }));
        try {
            const res = await axios.post("http://localhost:4000/api/v1/resume/refine-bullets", {
                role: title || personalDetails.jobTitle,
                company: company,
                rawBullets: draftText
            }, { withCredentials: true });

            if (res.data.success) {
                const bulletString = res.data.data.bullets.join("\n• ");
                handleExperienceChange(id, 'description', `• ${bulletString}`);
                toast.success("Refined experience description using AI!");
            }
        } catch (error) {
            console.error("AI experience error:", error);
            toast.error(error.response?.data?.message || "Failed to refine experience.");
        } finally {
            setAiLoadingExperience(prev => ({ ...prev, [id]: false }));
        }
    };

    // Browser standard print command
    const handleDownloadPDF = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col no-print">
            <Navbar />
            
            {/* Custom Print Style Injection */}
            <style>{`
                @media print {
                    /* Hide everything except the resume sheet container */
                    body * {
                        visibility: hidden !important;
                    }
                    #resume-preview-sheet, #resume-preview-sheet * {
                        visibility: visible !important;
                    }
                    #resume-preview-sheet {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                        background: white !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden">
                
                {/* LEFT BUILDER PANE */}
                <div className="w-full lg:w-1/2 flex flex-col border-r border-slate-200 bg-white h-full overflow-hidden">
                    
                    {/* Header Controls */}
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link to="/home" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                                    AI Resume Builder
                                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                                        <Sparkles className="w-2.5 h-2.5" /> AI Enabled
                                    </span>
                                </h1>
                                <p className="text-xs text-slate-400">Fill in details and preview templates</p>
                            </div>
                        </div>
                        <Button 
                            onClick={handleDownloadPDF}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 rounded-xl shadow-md transition-all font-medium py-1.5"
                        >
                            <Download className="w-4 h-4" /> Download PDF
                        </Button>
                    </div>

                    {/* Step Navigation Tabs */}
                    <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none px-3 bg-slate-50/50">
                        {[
                            { id: 'personal', label: 'Personal', icon: User },
                            { id: 'experience', label: 'Work Experience', icon: Briefcase },
                            { id: 'education', label: 'Education', icon: GraduationCap },
                            { id: 'projects', label: 'Projects', icon: FolderGit2 },
                            { id: 'skills', label: 'Skills', icon: Cpu },
                            { id: 'template', label: 'Template picker', icon: Palette }
                        ].map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                                        isActive 
                                        ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm' 
                                        : 'border-transparent text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Dynamic Form Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        
                        {/* 1. PERSONAL DETAILS */}
                        {activeTab === 'personal' && (
                            <div className="space-y-4">
                                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Personal Details</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 block mb-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            name="fullName" 
                                            value={personalDetails.fullName} 
                                            onChange={handlePersonalChange}
                                            className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 block mb-1">Target Job Title</label>
                                        <input 
                                            type="text" 
                                            name="jobTitle" 
                                            value={personalDetails.jobTitle} 
                                            onChange={handlePersonalChange}
                                            className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="Full Stack Developer"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 block mb-1">Email</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={personalDetails.email} 
                                            onChange={handlePersonalChange}
                                            className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="john.doe@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 block mb-1">Phone</label>
                                        <input 
                                            type="text" 
                                            name="phone" 
                                            value={personalDetails.phone} 
                                            onChange={handlePersonalChange}
                                            className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="+1 (555) 019-2834"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 block mb-1">LinkedIn Profile</label>
                                        <input 
                                            type="text" 
                                            name="linkedin" 
                                            value={personalDetails.linkedin} 
                                            onChange={handlePersonalChange}
                                            className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="linkedin.com/in/johndoe"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 block mb-1">Portfolio/GitHub Website</label>
                                        <input 
                                            type="text" 
                                            name="portfolio" 
                                            value={personalDetails.portfolio} 
                                            onChange={handlePersonalChange}
                                            className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="johndoe.dev"
                                        />
                                    </div>
                                </div>
                                <div className="relative pt-2">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-semibold text-slate-500">Professional Summary</label>
                                        <button 
                                            onClick={generateSummaryWithAI}
                                            disabled={aiLoadingSummary}
                                            className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-lg flex items-center gap-1 transition-all disabled:opacity-50"
                                        >
                                            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> 
                                            {aiLoadingSummary ? "Generating..." : "Write summary with AI"}
                                        </button>
                                    </div>
                                    <textarea 
                                        name="summary" 
                                        rows="4"
                                        value={personalDetails.summary} 
                                        onChange={handlePersonalChange}
                                        className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 outline-none transition-all resize-none"
                                        placeholder="Draft a quick bio, or click the AI button above to instantly generate a tailored, professional summary!"
                                    />
                                </div>
                            </div>
                        )}

                        {/* 2. EXPERIENCE */}
                        {activeTab === 'experience' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Work Experience</h2>
                                    <button 
                                        onClick={addExperience}
                                        className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all"
                                    >
                                        <Plus className="w-4 h-4" /> Add Block
                                    </button>
                                </div>

                                {experiences.map((exp, index) => (
                                    <div key={exp.id} className="p-4 border border-slate-100 bg-slate-50/50 rounded-2xl relative space-y-4">
                                        <button 
                                            onClick={() => removeExperience(exp.id)}
                                            className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-all"
                                            title="Delete Block"
                                        >
                                            <Trash2 className="w-4.5 h-4.5" />
                                        </button>
                                        <div className="text-xs font-bold text-indigo-600">Block #{index + 1}</div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Job Title</label>
                                                <input 
                                                    type="text"
                                                    value={exp.title}
                                                    onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)}
                                                    className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none"
                                                    placeholder="Software Engineer"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Company</label>
                                                <input 
                                                    type="text"
                                                    value={exp.company}
                                                    onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                                                    className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none"
                                                    placeholder="Google"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Date Range / Duration</label>
                                            <input 
                                                type="text"
                                                value={exp.dates}
                                                onChange={(e) => handleExperienceChange(exp.id, 'dates', e.target.value)}
                                                className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none"
                                                placeholder="May 2024 - Present"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="text-[10px] font-bold text-slate-500">Tasks & Achievements</label>
                                                <button 
                                                    onClick={() => refineExperienceBulletsWithAI(exp.id, exp.description, exp.title, exp.company)}
                                                    disabled={aiLoadingExperience[exp.id]}
                                                    className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 transition-all disabled:opacity-50"
                                                >
                                                    <Sparkles className="w-3 h-3 animate-pulse" /> 
                                                    {aiLoadingExperience[exp.id] ? "Optimizing..." : "Refine description with AI"}
                                                </button>
                                            </div>
                                            <textarea 
                                                rows="3"
                                                value={exp.description}
                                                onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                                                className="w-full text-sm bg-white border border-slate-200 rounded-xl p-3 outline-none resize-none"
                                                placeholder="Draft raw tasks (e.g. built feature, worked with database) and click AI above to rewrite into strong action bullet points."
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 3. EDUCATION */}
                        {activeTab === 'education' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Education</h2>
                                    <button 
                                        onClick={addEducation}
                                        className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all"
                                    >
                                        <Plus className="w-4 h-4" /> Add Block
                                    </button>
                                </div>

                                {educations.map((edu, index) => (
                                    <div key={edu.id} className="p-4 border border-slate-100 bg-slate-50/50 rounded-2xl relative space-y-4">
                                        <button 
                                            onClick={() => removeEducation(edu.id)}
                                            className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-all"
                                        >
                                            <Trash2 className="w-4.5 h-4.5" />
                                        </button>
                                        <div className="text-xs font-bold text-indigo-600">Block #{index + 1}</div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">School / College</label>
                                                <input 
                                                    type="text"
                                                    value={edu.school}
                                                    onChange={(e) => handleEducationChange(edu.id, 'school', e.target.value)}
                                                    className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none"
                                                    placeholder="MIT"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Degree / Major</label>
                                                <input 
                                                    type="text"
                                                    value={edu.degree}
                                                    onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                                                    className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none"
                                                    placeholder="Bachelor in Computer Science"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Dates / Year</label>
                                                <input 
                                                    type="text"
                                                    value={edu.dates}
                                                    onChange={(e) => handleEducationChange(edu.id, 'dates', e.target.value)}
                                                    className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none"
                                                    placeholder="2020 - 2024"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">GPA / Grade (Optional)</label>
                                                <input 
                                                    type="text"
                                                    value={edu.grade}
                                                    onChange={(e) => handleEducationChange(edu.id, 'grade', e.target.value)}
                                                    className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none"
                                                    placeholder="GPA: 3.9/4.0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 4. PROJECTS */}
                        {activeTab === 'projects' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Projects</h2>
                                    <button 
                                        onClick={addProject}
                                        className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all"
                                    >
                                        <Plus className="w-4 h-4" /> Add Block
                                    </button>
                                </div>

                                {projects.map((proj, index) => (
                                    <div key={proj.id} className="p-4 border border-slate-100 bg-slate-50/50 rounded-2xl relative space-y-4">
                                        <button 
                                            onClick={() => removeProject(proj.id)}
                                            className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-all"
                                        >
                                            <Trash2 className="w-4.5 h-4.5" />
                                        </button>
                                        <div className="text-xs font-bold text-indigo-600">Block #{index + 1}</div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Project Name</label>
                                                <input 
                                                    type="text"
                                                    value={proj.name}
                                                    onChange={(e) => handleProjectChange(proj.id, 'name', e.target.value)}
                                                    className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none"
                                                    placeholder="Task Scheduler"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Technologies Used</label>
                                                <input 
                                                    type="text"
                                                    value={proj.tech}
                                                    onChange={(e) => handleProjectChange(proj.id, 'tech', e.target.value)}
                                                    className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none"
                                                    placeholder="React, Redis, Node.js"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Project Description</label>
                                            <textarea 
                                                rows="2"
                                                value={proj.description}
                                                onChange={(e) => handleProjectChange(proj.id, 'description', e.target.value)}
                                                className="w-full text-sm bg-white border border-slate-200 rounded-xl p-3 outline-none resize-none"
                                                placeholder="Briefly state key technologies, structures, or results accomplished."
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 5. SKILLS */}
                        {activeTab === 'skills' && (
                            <div className="space-y-4">
                                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Technical & Soft Skills</h2>
                                
                                <form onSubmit={addSkill} className="flex gap-2">
                                    <input 
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500/25 outline-none"
                                        placeholder="Add a skill (e.g. Python, Agile, Kubernetes)"
                                    />
                                    <button 
                                        type="submit"
                                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition-all"
                                    >
                                        <Plus className="w-4 h-4" /> Add
                                    </button>
                                </form>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {skills.map(skill => (
                                        <span 
                                            key={skill}
                                            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                                        >
                                            {skill}
                                            <button 
                                                type="button" 
                                                onClick={() => removeSkill(skill)}
                                                className="text-slate-400 hover:text-slate-700 transition-colors"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 6. TEMPLATE PICKER */}
                        {activeTab === 'template' && (
                            <div className="space-y-4">
                                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Choose Resume Theme Template</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {[
                                        { id: 'minimalist', name: 'Classic Minimalist', desc: 'Elegant typography, clean dividers, high-density professional style', accent: 'bg-slate-800' },
                                        { id: 'modern', name: 'Modern Dual-Sidebar', desc: 'Distinct layout showcasing skills, degree, and details in a split-accent row', accent: 'bg-indigo-600' },
                                        { id: 'executive', name: 'Creative Executive', desc: 'Bold top heading, structured timelines, sleek timeline borders', accent: 'bg-amber-600' },
                                        { id: 'atsGold', name: 'ATS Gold Standard', desc: '100% ATS-compliant single-column layout, standard headers, high parsing score', accent: 'bg-emerald-600' },
                                        { id: 'techElite', name: 'Tech Elite Chronological', desc: 'Sleek teal-accents, prominent tech stack highlights, impact-focused bullets', accent: 'bg-teal-600' },
                                        { id: 'corporateHybrid', name: 'Corporate Executive Hybrid', desc: 'Elegant serif headers, sleek horizontal dividers, high-impact consulting layout', accent: 'bg-slate-900' }
                                    ].map(temp => {
                                        const isSelected = selectedTemplate === temp.id;
                                        return (
                                            <button
                                                key={temp.id}
                                                onClick={() => setSelectedTemplate(temp.id)}
                                                className={`text-left p-4 border rounded-2xl transition-all duration-300 flex flex-col justify-between h-44 outline-none ${
                                                    isSelected 
                                                    ? 'border-indigo-600 ring-2 ring-indigo-500/25 bg-indigo-50/15' 
                                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
                                                }`}
                                            >
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-xs font-bold text-slate-900">{temp.name}</div>
                                                        <span className={`w-3.5 h-3.5 rounded-full ${temp.accent} block shadow-sm`} />
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 leading-normal">{temp.desc}</p>
                                                </div>
                                                <div className="flex justify-end pt-3">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                        isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
                                                    }`}>
                                                        {isSelected ? 'Active' : 'Select'}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Step Navigation Controls */}
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <button
                            disabled={activeTab === 'personal'}
                            onClick={() => {
                                const order = ['personal', 'experience', 'education', 'projects', 'skills', 'template'];
                                const currentIndex = order.indexOf(activeTab);
                                if (currentIndex > 0) setActiveTab(order[currentIndex - 1]);
                            }}
                            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>

                        <button
                            disabled={activeTab === 'template'}
                            onClick={() => {
                                const order = ['personal', 'experience', 'education', 'projects', 'skills', 'template'];
                                const currentIndex = order.indexOf(activeTab);
                                if (currentIndex < order.length - 1) setActiveTab(order[currentIndex + 1]);
                            }}
                            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-30 transition-all"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                </div>

                {/* RIGHT LIVE PREVIEW PANE */}
                <div className="flex-1 bg-slate-200/60 p-6 overflow-y-auto flex justify-center items-start h-full">
                    
                    {/* PAPER RENDER PAGE */}
                    <div 
                        id="resume-preview-sheet"
                        className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-10 select-none overflow-hidden text-slate-900 border border-slate-200 transition-all duration-300 relative"
                        style={{ 
                            fontFamily: (selectedTemplate === 'minimalist' || selectedTemplate === 'corporateHybrid') 
                                ? 'Georgia, serif' 
                                : 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' 
                        }}
                    >
                        
                        {/* ======================================= */}
                        {/* 1. CLASSIC MINIMALIST TEMPLATE */}
                        {/* ======================================= */}
                        {selectedTemplate === 'minimalist' && (
                            <div className="space-y-6">
                                {/* Header Details */}
                                <div className="text-center space-y-2 pb-4 border-b border-slate-200">
                                    <h1 className="text-3xl font-extrabold tracking-tight uppercase text-slate-800">{personalDetails.fullName || 'FULL NAME'}</h1>
                                    <p className="text-sm font-bold tracking-widest text-[#6A38C2] uppercase">{personalDetails.jobTitle || 'TARGET JOB TITLE'}</p>
                                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                                        {personalDetails.email && <span>{personalDetails.email}</span>}
                                        {personalDetails.phone && <span>• {personalDetails.phone}</span>}
                                        {personalDetails.linkedin && <span>• {personalDetails.linkedin}</span>}
                                        {personalDetails.portfolio && <span>• {personalDetails.portfolio}</span>}
                                    </div>
                                </div>

                                {/* Summary */}
                                {personalDetails.summary && (
                                    <div className="space-y-1.5">
                                        <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Professional Summary</h3>
                                        <p className="text-xs text-slate-700 leading-relaxed text-justify">{personalDetails.summary}</p>
                                    </div>
                                )}

                                {/* Experience */}
                                {experiences.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Work Experience</h3>
                                        <div className="space-y-4">
                                            {experiences.map(exp => (
                                                <div key={exp.id} className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-xs font-bold text-slate-800">{exp.title || 'Job Title'} <span className="font-normal text-slate-500">at {exp.company || 'Company'}</span></h4>
                                                        <span className="text-[10px] font-semibold text-slate-400">{exp.dates || 'Duration'}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{exp.description || 'Description'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {educations.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Education</h3>
                                        <div className="space-y-3">
                                            {educations.map(edu => (
                                                <div key={edu.id} className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-800">{edu.school || 'School'}</h4>
                                                        <p className="text-[11px] text-slate-500 font-medium">{edu.degree || 'Degree'} {edu.grade ? `— ${edu.grade}` : ''}</p>
                                                    </div>
                                                    <span className="text-[10px] font-semibold text-slate-400">{edu.dates || 'Dates'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Projects */}
                                {projects.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Projects</h3>
                                        <div className="space-y-3">
                                            {projects.map(proj => (
                                                <div key={proj.id} className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-xs font-bold text-slate-800">{proj.name || 'Project Name'}</h4>
                                                        <span className="text-[10px] font-semibold text-slate-400 font-mono">{proj.tech || 'Tech Stack'}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 leading-relaxed">{proj.description || 'Description'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Skills */}
                                {skills.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Technical Skills</h3>
                                        <p className="text-xs text-slate-700 leading-normal font-medium">{skills.join(', ')}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ======================================= */}
                        {/* 2. MODERN DUAL-SIDEBAR TEMPLATE */}
                        {/* ======================================= */}
                        {selectedTemplate === 'modern' && (
                            <div className="flex gap-8 h-full">
                                {/* Left accent side pane */}
                                <div className="w-[30%] bg-indigo-950/90 text-indigo-50 p-6 rounded-2xl flex flex-col gap-6 text-xs h-full">
                                    <div className="space-y-1">
                                        <h2 className="text-base font-extrabold uppercase truncate tracking-tight">{personalDetails.fullName || 'Name'}</h2>
                                        <p className="text-[10px] font-bold tracking-wider text-indigo-300 uppercase leading-none truncate">{personalDetails.jobTitle || 'Job Title'}</p>
                                    </div>

                                    {/* Contact */}
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 border-b border-indigo-800 pb-1">Contact</h4>
                                        <div className="space-y-2 text-[10px] font-medium leading-relaxed break-all">
                                            {personalDetails.email && <div>✉ {personalDetails.email}</div>}
                                            {personalDetails.phone && <div>☎ {personalDetails.phone}</div>}
                                            {personalDetails.linkedin && <div>🔗 {personalDetails.linkedin}</div>}
                                            {personalDetails.portfolio && <div>🌐 {personalDetails.portfolio}</div>}
                                        </div>
                                    </div>

                                    {/* Skills as tags inside sidebar */}
                                    {skills.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 border-b border-indigo-800 pb-1">Skills</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {skills.map(skill => (
                                                    <span key={skill} className="bg-indigo-900 text-indigo-100 font-bold text-[9px] px-2 py-0.5 rounded-md">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Education in sidebar */}
                                    {educations.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 border-b border-indigo-800 pb-1">Education</h4>
                                            <div className="space-y-3">
                                                {educations.map(edu => (
                                                    <div key={edu.id} className="space-y-0.5">
                                                        <div className="font-extrabold text-[10px] truncate">{edu.school || 'School'}</div>
                                                        <div className="text-[9px] text-indigo-200">{edu.degree || 'Degree'}</div>
                                                        <div className="text-[9px] font-semibold text-indigo-300/80">{edu.dates || 'Dates'} {edu.grade ? `| ${edu.grade}` : ''}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right primary content pane */}
                                <div className="flex-1 space-y-6">
                                    {/* Professional Summary */}
                                    {personalDetails.summary && (
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-extrabold text-indigo-950 uppercase tracking-widest border-l-4 border-indigo-600 pl-2">Summary</h3>
                                            <p className="text-xs text-slate-600 leading-relaxed text-justify">{personalDetails.summary}</p>
                                        </div>
                                    )}

                                    {/* Work Experience */}
                                    {experiences.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xs font-extrabold text-indigo-950 uppercase tracking-widest border-l-4 border-indigo-600 pl-2">Experience</h3>
                                            <div className="space-y-4">
                                                {experiences.map(exp => (
                                                    <div key={exp.id} className="space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-xs font-bold text-slate-800">{exp.title || 'Title'} at <span className="text-indigo-600">{exp.company || 'Company'}</span></h4>
                                                            <span className="text-[10px] font-semibold text-slate-400">{exp.dates}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Projects */}
                                    {projects.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xs font-extrabold text-indigo-950 uppercase tracking-widest border-l-4 border-indigo-600 pl-2">Projects</h3>
                                            <div className="space-y-4">
                                                {projects.map(proj => (
                                                    <div key={proj.id} className="space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-xs font-bold text-slate-800">{proj.name}</h4>
                                                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{proj.tech}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ======================================= */}
                        {/* 3. CREATIVE EXECUTIVE TEMPLATE */}
                        {/* ======================================= */}
                        {selectedTemplate === 'executive' && (
                            <div className="space-y-6">
                                {/* Top Bold Header Panel */}
                                <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="space-y-1">
                                        <h1 className="text-2xl font-black uppercase tracking-tight">{personalDetails.fullName || 'FULL NAME'}</h1>
                                        <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">{personalDetails.jobTitle || 'TARGET JOB TITLE'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-300 font-semibold leading-normal">
                                        {personalDetails.email && <div>✉ {personalDetails.email}</div>}
                                        {personalDetails.phone && <div>☎ {personalDetails.phone}</div>}
                                        {personalDetails.linkedin && <div>🔗 {personalDetails.linkedin}</div>}
                                        {personalDetails.portfolio && <div>🌐 {personalDetails.portfolio}</div>}
                                    </div>
                                </div>

                                {/* Main Layout Column */}
                                <div className="space-y-6">
                                    
                                    {/* Summary */}
                                    {personalDetails.summary && (
                                        <div className="space-y-1">
                                            <h3 className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">Summary</h3>
                                            <div className="w-full h-0.5 bg-slate-100" />
                                            <p className="text-xs text-slate-600 leading-relaxed pt-1.5 text-justify">{personalDetails.summary}</p>
                                        </div>
                                    )}

                                    {/* Experience timeline layout */}
                                    {experiences.length > 0 && (
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">Professional Experience</h3>
                                            <div className="w-full h-0.5 bg-slate-100" />
                                            <div className="space-y-4 pt-1.5 pl-2 border-l border-slate-200 ml-1">
                                                {experiences.map(exp => (
                                                    <div key={exp.id} className="relative space-y-0.5">
                                                        <div className="absolute -left-[12.5px] top-1.5 w-2 h-2 rounded-full bg-slate-400 border border-white" />
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-xs font-bold text-slate-800">{exp.title} <span className="font-medium text-amber-600">@ {exp.company}</span></h4>
                                                            <span className="text-[10px] font-bold text-slate-400">{exp.dates}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Dual Row for Education / Projects */}
                                    <div className="grid grid-cols-2 gap-8">
                                        {/* Education */}
                                        {educations.length > 0 && (
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">Education</h3>
                                                <div className="w-full h-0.5 bg-slate-100" />
                                                <div className="space-y-3 pt-1.5">
                                                    {educations.map(edu => (
                                                        <div key={edu.id} className="space-y-0.5">
                                                            <h4 className="text-xs font-bold text-slate-800">{edu.school}</h4>
                                                            <p className="text-[10px] text-slate-500 font-semibold">{edu.degree} {edu.grade ? `(${edu.grade})` : ''}</p>
                                                            <div className="text-[9px] font-bold text-slate-400">{edu.dates}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Projects */}
                                        {projects.length > 0 && (
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">Key Projects</h3>
                                                <div className="w-full h-0.5 bg-slate-100" />
                                                <div className="space-y-3 pt-1.5">
                                                    {projects.map(proj => (
                                                        <div key={proj.id} className="space-y-0.5">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="text-xs font-bold text-slate-800">{proj.name}</h4>
                                                                <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-bold">{proj.tech}</span>
                                                            </div>
                                                            <p className="text-[10px] text-slate-600 leading-normal">{proj.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Skills inside tags */}
                                    {skills.length > 0 && (
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">Technical Expertise</h3>
                                            <div className="w-full h-0.5 bg-slate-100" />
                                            <div className="flex flex-wrap gap-1 pt-1.5">
                                                {skills.map(skill => (
                                                    <span key={skill} className="bg-slate-100 text-slate-700 font-semibold text-[10px] px-2.5 py-1 rounded-md">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}

                        {/* ======================================= */}
                        {/* 4. ATS GOLD STANDARD TEMPLATE */}
                        {/* ======================================= */}
                        {selectedTemplate === 'atsGold' && (
                            <div className="space-y-5 text-slate-900">
                                {/* Centered Header */}
                                <div className="text-center space-y-1.5 pb-2">
                                    <h1 className="text-2xl font-bold tracking-tight text-slate-950 uppercase">{personalDetails.fullName || 'FULL NAME'}</h1>
                                    <p className="text-xs font-bold tracking-widest text-slate-700 uppercase">{personalDetails.jobTitle || 'TARGET JOB TITLE'}</p>
                                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-xs text-slate-600 font-medium">
                                        {personalDetails.email && <span>{personalDetails.email}</span>}
                                        {personalDetails.phone && <span>| {personalDetails.phone}</span>}
                                        {personalDetails.linkedin && <span>| {personalDetails.linkedin}</span>}
                                        {personalDetails.portfolio && <span>| {personalDetails.portfolio}</span>}
                                    </div>
                                </div>

                                {/* Summary */}
                                {personalDetails.summary && (
                                    <div className="space-y-1">
                                        <h3 className="text-xs font-bold tracking-wider text-slate-950 uppercase border-b border-slate-400 pb-0.5">Professional Summary</h3>
                                        <p className="text-xs text-slate-800 leading-relaxed text-justify mt-1">{personalDetails.summary}</p>
                                    </div>
                                )}

                                {/* Experience */}
                                {experiences.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold tracking-wider text-slate-950 uppercase border-b border-slate-400 pb-0.5">Work Experience</h3>
                                        <div className="space-y-3 mt-1">
                                            {experiences.map(exp => (
                                                <div key={exp.id} className="space-y-0.5">
                                                    <div className="flex items-baseline justify-between">
                                                        <h4 className="text-xs font-bold text-slate-900">
                                                            {exp.title || 'Job Title'} <span className="font-normal text-slate-600">| {exp.company || 'Company'}</span>
                                                        </h4>
                                                        <span className="text-[11px] font-semibold text-slate-700">{exp.dates || 'Duration'}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pl-1">{exp.description || 'Description'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {educations.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold tracking-wider text-slate-950 uppercase border-b border-slate-400 pb-0.5">Education</h3>
                                        <div className="space-y-2.5 mt-1">
                                            {educations.map(edu => (
                                                <div key={edu.id} className="space-y-0.5">
                                                    <div className="flex items-baseline justify-between">
                                                        <h4 className="text-xs font-bold text-slate-900">
                                                            {edu.school || 'School'} <span className="font-normal text-slate-600">| {edu.degree || 'Degree'}</span>
                                                        </h4>
                                                        <span className="text-[11px] font-semibold text-slate-700">{edu.dates || 'Dates'}</span>
                                                    </div>
                                                    {edu.grade && <p className="text-[11px] text-slate-600 font-medium pl-1">{edu.grade}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Projects */}
                                {projects.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold tracking-wider text-slate-950 uppercase border-b border-slate-400 pb-0.5">Academic & Personal Projects</h3>
                                        <div className="space-y-3 mt-1">
                                            {projects.map(proj => (
                                                <div key={proj.id} className="space-y-0.5">
                                                    <div className="flex items-baseline justify-between">
                                                        <h4 className="text-xs font-bold text-slate-900">
                                                            {proj.name || 'Project Name'} <span className="font-normal font-mono text-[10px] text-slate-600">({proj.tech || 'Tech Stack'})</span>
                                                        </h4>
                                                    </div>
                                                    <p className="text-xs text-slate-700 leading-relaxed pl-1">{proj.description || 'Description'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Skills */}
                                {skills.length > 0 && (
                                    <div className="space-y-1">
                                        <h3 className="text-xs font-bold tracking-wider text-slate-950 uppercase border-b border-slate-400 pb-0.5">Technical Skills</h3>
                                        <p className="text-xs text-slate-800 leading-relaxed mt-1"><span className="font-semibold text-slate-950">Expertise: </span>{skills.join(', ')}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ======================================= */}
                        {/* 5. TECH ELITE CHRONOLOGICAL TEMPLATE */}
                        {/* ======================================= */}
                        {selectedTemplate === 'techElite' && (
                            <div className="space-y-5 text-slate-900">
                                {/* Tech Grid Split Header */}
                                <div className="flex justify-between items-start border-b-2 border-teal-600 pb-4">
                                    <div>
                                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{personalDetails.fullName || 'FULL NAME'}</h1>
                                        <p className="text-xs font-bold uppercase tracking-wider text-teal-600 mt-1">{personalDetails.jobTitle || 'TARGET JOB TITLE'}</p>
                                    </div>
                                    <div className="text-right text-[10px] font-mono text-slate-500 space-y-0.5">
                                        {personalDetails.email && <div>{personalDetails.email}</div>}
                                        {personalDetails.phone && <div>{personalDetails.phone}</div>}
                                        {personalDetails.linkedin && <div>{personalDetails.linkedin}</div>}
                                        {personalDetails.portfolio && <div>{personalDetails.portfolio}</div>}
                                    </div>
                                </div>

                                {/* Summary */}
                                {personalDetails.summary && (
                                    <div className="space-y-1.5">
                                        <h3 className="text-xs font-bold text-teal-700 uppercase tracking-widest flex items-center gap-1.5">
                                            <span className="w-1.5 h-3.5 bg-teal-600 rounded-sm inline-block" /> Summary
                                        </h3>
                                        <p className="text-xs text-slate-600 leading-relaxed text-justify">{personalDetails.summary}</p>
                                    </div>
                                )}

                                {/* Work Experience Timeline */}
                                {experiences.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold text-teal-700 uppercase tracking-widest flex items-center gap-1.5">
                                            <span className="w-1.5 h-3.5 bg-teal-600 rounded-sm inline-block" /> Work Experience
                                        </h3>
                                        <div className="space-y-3.5 pt-1.5 pl-2 border-l border-slate-200 ml-1">
                                            {experiences.map(exp => (
                                                <div key={exp.id} className="relative space-y-1">
                                                    <span className="absolute -left-[12.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-teal-600 border-2 border-white" />
                                                    <div className="flex justify-between items-baseline">
                                                        <h4 className="text-xs font-bold text-slate-800">
                                                            {exp.title || 'Title'} <span className="text-teal-700 font-semibold">@ {exp.company || 'Company'}</span>
                                                        </h4>
                                                        <span className="text-[10px] font-mono text-slate-400 font-semibold">{exp.dates}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pl-1">{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Projects with Tech Tags */}
                                {projects.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold text-teal-700 uppercase tracking-widest flex items-center gap-1.5">
                                            <span className="w-1.5 h-3.5 bg-teal-600 rounded-sm inline-block" /> Projects
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {projects.map(proj => (
                                                <div key={proj.id} className="space-y-1 border border-slate-100 p-2.5 rounded-xl bg-slate-50/40">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="text-xs font-bold text-slate-800">{proj.name || 'Project'}</h4>
                                                        <div className="flex flex-wrap gap-1">
                                                            {(proj.tech || '').split(',').filter(t => t.trim()).map((t, idx) => (
                                                                <span key={idx} className="bg-slate-100 text-slate-600 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded">
                                                                    {t.trim()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {educations.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold text-teal-700 uppercase tracking-widest flex items-center gap-1.5">
                                            <span className="w-1.5 h-3.5 bg-teal-600 rounded-sm inline-block" /> Education
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                            {educations.map(edu => (
                                                <div key={edu.id} className="border border-slate-100 p-2.5 rounded-xl bg-slate-50/40 space-y-0.5">
                                                    <h4 className="text-xs font-bold text-slate-800">{edu.school}</h4>
                                                    <p className="text-[11px] text-teal-700 font-semibold">{edu.degree}</p>
                                                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold mt-1 pt-1 border-t border-slate-100">
                                                        <span>{edu.dates}</span>
                                                        {edu.grade && <span className="text-slate-600">{edu.grade}</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Skills as Outline Badges */}
                                {skills.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold text-teal-700 uppercase tracking-widest flex items-center gap-1.5">
                                            <span className="w-1.5 h-3.5 bg-teal-600 rounded-sm inline-block" /> Skills & Tools
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                                            {skills.map(skill => (
                                                <span key={skill} className="bg-teal-50/50 text-teal-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded border border-teal-100/60 shadow-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ======================================= */}
                        {/* 6. CORPORATE EXECUTIVE HYBRID TEMPLATE */}
                        {/* ======================================= */}
                        {selectedTemplate === 'corporateHybrid' && (
                            <div className="space-y-5 text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
                                {/* Top Heavy Border and Centered Header */}
                                <div className="border-t-4 border-slate-900 pt-4 text-center space-y-1.5">
                                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">{personalDetails.fullName || 'FULL NAME'}</h1>
                                    <p className="text-xs font-bold italic tracking-wider text-slate-600 uppercase">{personalDetails.jobTitle || 'TARGET JOB TITLE'}</p>
                                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-0.5 text-[10px] text-slate-500 font-medium pt-1">
                                        {personalDetails.email && <span>{personalDetails.email}</span>}
                                        {personalDetails.phone && <span>• {personalDetails.phone}</span>}
                                        {personalDetails.linkedin && <span>• {personalDetails.linkedin}</span>}
                                        {personalDetails.portfolio && <span>• {personalDetails.portfolio}</span>}
                                    </div>
                                </div>

                                {/* Summary */}
                                {personalDetails.summary && (
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xs font-bold text-slate-900 tracking-widest uppercase">Summary</h3>
                                            <div className="flex-1 h-[1px] bg-slate-300" />
                                        </div>
                                        <p className="text-xs italic text-slate-700 leading-relaxed text-justify">{personalDetails.summary}</p>
                                    </div>
                                )}

                                {/* Work Experience */}
                                {experiences.length > 0 && (
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xs font-bold text-slate-900 tracking-widest uppercase">Professional Experience</h3>
                                            <div className="flex-1 h-[1px] bg-slate-300" />
                                        </div>
                                        <div className="space-y-4">
                                            {experiences.map(exp => (
                                                <div key={exp.id} className="space-y-1">
                                                    <div className="flex justify-between items-baseline">
                                                        <h4 className="text-xs font-bold text-slate-900">
                                                            {exp.company || 'Company'} <span className="font-normal italic text-slate-700">— {exp.title || 'Role'}</span>
                                                        </h4>
                                                        <span className="text-[10px] text-slate-500 font-medium italic">{exp.dates}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pl-1">{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Projects */}
                                {projects.length > 0 && (
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xs font-bold text-slate-900 tracking-widest uppercase">Selected Projects</h3>
                                            <div className="flex-1 h-[1px] bg-slate-300" />
                                        </div>
                                        <div className="space-y-3.5">
                                            {projects.map(proj => (
                                                <div key={proj.id} className="space-y-0.5">
                                                    <div className="flex justify-between items-baseline">
                                                        <h4 className="text-xs font-bold text-slate-900">
                                                            {proj.name} <span className="text-[9px] text-slate-500 font-normal italic">({proj.tech})</span>
                                                        </h4>
                                                    </div>
                                                    <p className="text-[11px] text-slate-600 leading-relaxed pl-1">{proj.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {educations.length > 0 && (
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xs font-bold text-slate-900 tracking-widest uppercase">Education</h3>
                                            <div className="flex-1 h-[1px] bg-slate-300" />
                                        </div>
                                        <div className="space-y-3">
                                            {educations.map(edu => (
                                                <div key={edu.id} className="space-y-0.5">
                                                    <div className="flex justify-between items-baseline">
                                                        <h4 className="text-xs font-bold text-slate-900">{edu.school}</h4>
                                                        <span className="text-[10px] text-slate-500 font-medium italic">{edu.dates}</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-600 font-medium italic pl-1">{edu.degree} {edu.grade ? `(${edu.grade})` : ''}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Skills */}
                                {skills.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xs font-bold text-slate-900 tracking-widest uppercase">Expertise & Skills</h3>
                                            <div className="flex-1 h-[1px] bg-slate-300" />
                                        </div>
                                        <p className="text-xs text-slate-700 leading-relaxed pl-1 italic font-medium">
                                            {skills.join(', ')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    )
}

export default ResumeMaker
