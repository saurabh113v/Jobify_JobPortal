import React from 'react';
import { Github, Linkedin, Twitter, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 bg-white py-12 text-slate-500 relative overflow-hidden">
      
      {/* Background Accent Sphere */}
      <div className="absolute bottom-0 left-1/2 w-[300px] h-[300px] bg-[#6A38C2]/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center justify-center md:justify-start gap-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] via-[#9363e6] to-pink-500">
                Jobify
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
            </h2>
            <p className="text-xs text-slate-400 mt-1.5">© 2026 Jobify Platforms. Engineered for high performance.</p>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>by</span>
            <a 
              href="https://linkedin.com/in/saurabh-kumar-52202223a" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-500 hover:text-slate-900 transition-colors underline decoration-[#6A38C2]/50 hover:decoration-[#6A38C2] decoration-2"
            >
              Saurabh Kumar
            </a>
          </div>

          <div className="flex space-x-4">
            <a 
              href="https://github.com/saurabh113v" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 hover:text-black hover:bg-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="https://linkedin.com/in/saurabh-kumar-52202223a" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-center text-[#0077b5] hover:text-[#005582] hover:bg-blue-100/50 hover:border-blue-200 hover:shadow-md transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-xl bg-sky-50/60 border border-sky-100 flex items-center justify-center text-[#1DA1F2] hover:text-[#0c85d0] hover:bg-sky-100/50 hover:border-sky-200 hover:shadow-md transition-all duration-300"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;