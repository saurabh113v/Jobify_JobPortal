import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
        <div 
            onClick={()=> navigate(`/description/${job._id}`)} 
            className='group relative bg-white border border-slate-200/80 p-6 rounded-2xl cursor-pointer hover:-translate-y-1.5 hover:border-[#6A38C2]/40 hover:shadow-xl hover:shadow-[#6A38C2]/5 transition-all duration-300 relative overflow-hidden'
        >
            {/* Ambient card background glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#6A38C2]/2 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                <div className='flex items-center gap-3.5'>
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#6A38C2] transition-colors">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={job?.company?.logo} alt="Company Logo" className="object-cover" />
                            <AvatarFallback className="font-extrabold text-sm bg-slate-100 text-slate-600">
                                {job?.company?.name?.charAt(0) || "C"}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="min-w-0">
                        <h3 className='font-extrabold text-sm uppercase tracking-wider text-slate-400 group-hover:text-[#6A38C2] truncate transition-colors'>{job?.company?.name}</h3>
                        <p className='text-xs text-slate-450 font-semibold mt-0.5'>India</p>
                    </div>
                </div>
                
                <div>
                    <h4 className='font-bold text-lg text-slate-800 group-hover:text-[#6A38C2] transition-colors'>{job?.title}</h4>
                    <p className='text-sm text-slate-600 mt-2 leading-relaxed line-clamp-2'>{job?.description}</p>
                </div>
                
                <div className='flex flex-wrap items-center gap-2 pt-2 border-t border-slate-150 mt-1'>
                    <Badge className='bg-blue-50 text-blue-600 border border-blue-100 font-bold hover:bg-blue-100 px-2.5 py-0.5 text-[10px] rounded-lg tracking-wide uppercase transition-colors' variant="outline">
                        {job?.position} Positions
                    </Badge>
                    <Badge className='bg-pink-50 text-pink-600 border border-pink-100 font-bold hover:bg-pink-100 px-2.5 py-0.5 text-[10px] rounded-lg tracking-wide uppercase transition-colors' variant="outline">
                        {job?.jobType}
                    </Badge>
                    <Badge className='bg-[#6A38C2]/5 text-[#6A38C2] border border-[#6A38C2]/10 font-bold hover:bg-[#6A38C2]/10 px-2.5 py-0.5 text-[10px] rounded-lg tracking-wide uppercase transition-colors' variant="outline">
                        {job?.salary} LPA
                    </Badge>
                </div>
            </div>
        </div>
    )
}

export default LatestJobCards