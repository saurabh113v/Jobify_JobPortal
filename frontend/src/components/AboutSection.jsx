import React from 'react';
import developerPhoto from '../assets/saurabh.jpg';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Github, 
  Linkedin, 
  Globe, 
  Mail, 
  Cpu, 
  Sparkles, 
  Code, 
  Briefcase, 
  Award, 
  Users, 
  CheckCircle,
  Rocket,
  Flame,
  Zap,
  Terminal,
  ShieldCheck
} from 'lucide-react';

const AboutSection = () => {
  const developerInfo = {
    name: "Saurabh Kumar",
    role: "Full-Stack Web Developer",
    bio: "I am a passionate software developer dedicated to crafting elegant, highly scalable, and user-centric web applications. Blending eye-catching modern design systems with robust, high-performance backends, I thrive on turning complex problems into fluid digital experiences. I engineered Jobify to streamline the job application and recruitment lifecycles with absolute simplicity.",
    skills: [
      { name: "React.js", level: "Expert", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
      { name: "Redux Toolkit", level: "Advanced", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
      { name: "Node.js", level: "Expert", color: "bg-green-500/10 text-green-500 border-green-500/20" },
      { name: "Express.js", level: "Expert", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
      { name: "MongoDB", level: "Advanced", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
      { name: "Tailwind CSS", level: "Expert", color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" },
      { name: "RESTful APIs", level: "Expert", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
      { name: "JWT Auth", level: "Advanced", color: "bg-red-500/10 text-red-500 border-red-500/20" }
    ],
    github: "https://github.com/saurabh113v",
    linkedin: "https://linkedin.com/in/saurabh-kumar-52202223a",
    portfolio: "https://portfolio.com",
    email: "saurabh@example.com"
  };

  const companyStats = [
    { icon: <Briefcase className="w-5 h-5 text-white" />, value: "1,200+", label: "Active Jobs", bg: "bg-gradient-to-tr from-[#6A38C2] to-[#9363e6]" },
    { icon: <Users className="w-5 h-5 text-white" />, value: "450+", label: "Verified Recruiters", bg: "bg-gradient-to-tr from-pink-500 to-rose-500" },
    { icon: <Award className="w-5 h-5 text-white" />, value: "98%", label: "Placement Rate", bg: "bg-gradient-to-tr from-amber-500 to-orange-500" },
  ];

  return (
    <div className="relative overflow-hidden bg-slate-50 py-24 text-slate-800">
      
      {/* GLOWING BACKGROUND DECORATIONS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6A38C2]/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl translate-x-1/2 pointer-events-none"></div>
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center mb-20">
        <Badge className="bg-[#6A38C2]/10 text-[#6A38C2] border-[#6A38C2]/20 mb-4 px-4 py-1.5 text-xs font-semibold rounded-full uppercase tracking-wider animate-pulse">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 inline-block text-yellow-500" /> Platform & Creator
        </Badge>
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
          Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] via-[#9363e6] to-pink-500">Jobify</span>
        </h2>
        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-600 leading-relaxed">
          Jobify is an advanced, high-performance career portal designed to bridge the gap between brilliant minds and leading industry sectors. Built with high responsiveness, clean workflows, and rich interfaces.
        </p>
      </div>

      {/* MISSION, STATS & VISION CARDS (GRID) */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        
        {/* CARD 1: Applicant Vision */}
        <div className="group relative bg-white border border-slate-100 p-8 rounded-3xl shadow-md shadow-slate-100/50 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#6A38C2]/30 hover:shadow-2xl hover:shadow-[#6A38C2]/5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#6A38C2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl"></div>
          <div className="relative z-10 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-[#6A38C2]/10 flex items-center justify-center text-[#6A38C2] group-hover:scale-110 transition-transform duration-300">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">For Job Seekers</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Explore thousands of curated listings, apply instantly using your profile, and receive transparent updates regarding your recruitment status at every step.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-500 font-medium">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> One-Click Direct Application</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Dynamic Real-time Status Tracker</li>
            </ul>
          </div>
        </div>

        {/* CARD 2: Central Platform Stats */}
        <div className="group relative bg-white border border-[#6A38C2]/20 p-8 rounded-3xl backdrop-blur-xl shadow-xl shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:border-[#9363e6]/30">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#9363e6]/5 rounded-full blur-2xl group-hover:bg-[#9363e6]/10 transition-all duration-500"></div>
          <div className="relative z-10 h-full flex flex-col justify-between space-y-6">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 mb-5 group-hover:scale-110 transition-transform duration-300">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Metrics</h3>
              <p className="text-slate-500 text-sm leading-relaxed mt-2">
                Delivering high-speed performance and sub-second load times. Our infrastructure supports hundreds of concurrent queries effortlessly.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              {companyStats.map((stat, idx) => (
                <div key={idx} className="text-center p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-all duration-300">
                  <div className={`w-8 h-8 mx-auto rounded-lg ${stat.bg} flex items-center justify-center mb-2 shadow-lg`}>
                    {stat.icon}
                  </div>
                  <div className="text-md font-bold text-slate-800">{stat.value}</div>
                  <div className="text-[8px] uppercase text-slate-500 font-bold tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 3: Recruiter Vision */}
        <div className="group relative bg-white border border-slate-100 p-8 rounded-3xl shadow-md shadow-slate-100/50 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl"></div>
          <div className="relative z-10 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">For Corporate Recruiters</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Register companies, create exact vacancy postings, and utilize our smart candidate evaluation pipeline to shortlist candidates seamlessly.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-500 font-medium">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-pink-500" /> Easy Company Verification</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-pink-500" /> Automated Applicant Sorting</li>
            </ul>
          </div>
        </div>

      </div>

      {/* DEVELOPER SPOTLIGHT CARD */}
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="relative overflow-hidden bg-white border border-slate-200/90 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl hover:border-slate-300 transition-all duration-500">
          
          {/* Card Accent Glows */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#6A38C2]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-center lg:items-start">
            
            {/* LEFT COLUMN: Premium Glowing Image Frame */}
            <div className="relative shrink-0">
              {/* Rotating Animated Shimmer Ring */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#6A38C2] via-pink-500 to-[#9363e6] rounded-[2.5rem] blur-md opacity-75 group-hover:opacity-100 animate-pulse duration-1000"></div>
              
              <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-[2.25rem] bg-white border border-slate-100 p-2 overflow-hidden shadow-2xl">
                <img 
                  src={developerPhoto} 
                  alt={developerInfo.name} 
                  className="w-full h-full object-cover rounded-[1.75rem] object-center hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              <div className="absolute -bottom-3 -right-3 bg-white border border-slate-200 p-3 rounded-2xl shadow-xl flex items-center justify-center text-yellow-500 animate-bounce">
                <Terminal className="w-5 h-5" />
              </div>
            </div>

            {/* RIGHT COLUMN: Professional Bio, Tech Stack & Buttons */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div>
                <Badge className="bg-[#6A38C2] text-white hover:bg-[#5b30a6] px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-[#6A38C2]/20 mb-3">
                  Lead Software Architect
                </Badge>
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center lg:justify-start gap-2">
                  {developerInfo.name} 
                  <ShieldCheck className="w-6 h-6 text-emerald-500 inline-block" />
                </h3>
                <p className="text-[#6A38C2] font-semibold text-sm md:text-base mt-1">{developerInfo.role}</p>
              </div>

              <p className="text-slate-650 leading-relaxed text-sm md:text-base text-justify lg:text-left">
                {developerInfo.bio}
              </p>

              {/* Skill Badges with exact levels and glowing colors */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center justify-center lg:justify-start gap-1.5">
                  <Code className="w-4 h-4 text-[#6A38C2]" /> Technology Stack & Competencies
                </h4>
                <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                  {developerInfo.skills.map((skill, idx) => (
                    <Badge 
                      key={idx} 
                      className={`px-3 py-1 text-[11px] font-medium border bg-white/90 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white shadow-sm shadow-slate-100 ${skill.color}`}
                    >
                      {skill.name}
                      <span className="ml-1.5 opacity-60 text-[9px] font-bold">({skill.level})</span>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Dynamic Interactive Social Buttons */}
              <div className="pt-6 flex flex-wrap gap-4 justify-center lg:justify-start border-t border-slate-100">
                <a href={developerInfo.github} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-10 px-5 gap-2 text-xs text-slate-700 border-slate-200 bg-white hover:bg-slate-50 hover:text-[#6A38C2] hover:border-[#6A38C2] rounded-xl transition-all duration-300">
                    <Github className="w-4 h-4" /> GitHub Profile
                  </Button>
                </a>
                <a href={developerInfo.linkedin} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-10 px-5 gap-2 text-xs text-slate-700 border-slate-200 bg-white hover:bg-slate-50 hover:text-blue-500 hover:border-blue-500 rounded-xl transition-all duration-300">
                    <Linkedin className="w-4 h-4" /> LinkedIn Profile
                  </Button>
                </a>
                <a href={`mailto:${developerInfo.email}`}>
                  <Button className="h-10 px-5 gap-2 text-xs bg-gradient-to-r from-[#6A38C2] to-[#8b5cf6] text-white hover:from-[#7c3aed] hover:to-[#a78bfa] rounded-xl shadow-lg shadow-[#6A38C2]/15 transition-all duration-300">
                    <Mail className="w-4 h-4" /> Connect with Me
                  </Button>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutSection;
