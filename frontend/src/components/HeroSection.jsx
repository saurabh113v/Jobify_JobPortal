import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search, Sparkles, MapPin, Briefcase } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [filter, setFilter] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        const payload = JSON.stringify({ query, location, filter });
        dispatch(setSearchedQuery(payload));
        navigate("/browse");
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchJobHandler();
        }
    }

    return (
        <div className='relative text-center py-20 md:py-28 overflow-hidden'>
            {/* Soft background glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#6A38C2]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
            <div className="absolute top-1/3 left-1/4 w-[250px] h-[250px] bg-pink-500/5 rounded-full blur-[80px] pointer-events-none z-0"></div>

            <div className='relative z-10 flex flex-col gap-6 max-w-4xl mx-auto px-6'>
                {/* Luminous Tag Badge */}
                <div className='inline-flex items-center gap-1.5 mx-auto px-4.5 py-1.5 rounded-full bg-[#6A38C2]/10 border border-[#6A38C2]/20 text-[#6A38C2] font-semibold text-xs uppercase tracking-wider shadow-sm animate-pulse'>
                    <Sparkles className="w-3.5 h-3.5 text-[#6A38C2]" />
                    <span>No. 1 Premium Job Portal</span>
                </div>
                
                {/* Headline */}
                <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight md:leading-none'>
                    Search, Apply & Secure <br /> Your <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] via-[#9363e6] to-pink-500'>Dream Careers</span>
                </h1>
                
                {/* Subtitle */}
                <p className='text-slate-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed'>
                    Connecting elite minds with forward-thinking enterprises. Explore thousands of listings with real-time application trackers.
                </p>
                
                {/* Premium Search Bar */}
                <div className='flex flex-col md:flex-row w-full max-w-4xl bg-white/90 backdrop-blur-md border border-slate-200 p-2 md:pl-4 md:pr-1.5 md:py-1.5 rounded-2xl items-stretch md:items-center gap-3 mx-auto shadow-2xl shadow-indigo-500/5 hover:shadow-indigo-500/10 focus-within:border-[#6A38C2]/60 focus-within:ring-4 focus-within:ring-[#6A38C2]/10 transition-all duration-300 mt-6 group'>
                    
                    {/* Keywords Input */}
                    <div className="flex items-center gap-2 px-2 py-1.5 md:py-0 flex-grow border-b border-slate-100 md:border-b-0">
                        <Search className="w-4 h-4 text-slate-400 shrink-0 group-focus-within:text-[#6A38C2] transition-colors" />
                        <input
                            type="text"
                            placeholder='Search titles, roles, or tech...'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className='bg-transparent text-slate-800 placeholder-slate-400 outline-none border-none w-full text-sm font-semibold py-1 md:py-2'
                        />
                    </div>

                    {/* Divider 1 */}
                    <div className="hidden md:block w-[1px] h-6 bg-slate-200 shrink-0 self-center"></div>

                    {/* Location Input */}
                    <div className="flex items-center gap-2 px-2 py-1.5 md:py-0 flex-grow border-b border-slate-100 md:border-b-0">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 group-focus-within:text-[#6A38C2] transition-colors" />
                        <input
                            type="text"
                            placeholder='City or Remote...'
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className='bg-transparent text-slate-800 placeholder-slate-400 outline-none border-none w-full text-sm font-semibold py-1 md:py-2'
                        />
                    </div>

                    {/* Divider 2 */}
                    <div className="hidden md:block w-[1px] h-6 bg-slate-200 shrink-0 self-center"></div>

                    {/* Job Type Dropdown */}
                    <div className="flex items-center gap-2 px-2 py-1.5 md:py-0 shrink-0">
                        <Briefcase className="w-4 h-4 text-slate-400 shrink-0 group-focus-within:text-[#6A38C2] transition-colors" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className='bg-transparent text-slate-800 placeholder-slate-400 outline-none border-none text-sm font-semibold py-1 md:py-2 pr-4 cursor-pointer min-w-[120px]'
                        >
                            <option value="">All Types</option>
                            <option value="Full-Time">Full-Time</option>
                            <option value="Part-Time">Part-Time</option>
                            <option value="Internship">Internship</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>

                    {/* Search button */}
                    <Button 
                        onClick={searchJobHandler} 
                        className="rounded-xl bg-gradient-to-r from-[#6A38C2] to-[#9363e6] hover:from-[#5b30a6] hover:to-[#8152cc] text-white px-6 py-3 md:py-2.5 h-auto shrink-0 shadow-lg shadow-[#6A38C2]/20 hover:shadow-[#6A38C2]/35 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                        <Search className='h-3.5 w-3.5' />
                        <span>Search Jobs</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection

