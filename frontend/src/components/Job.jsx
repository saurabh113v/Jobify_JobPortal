import React from 'react'
import { Button } from './ui/button'
import { Bookmark, MapPin, Calendar } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({job}) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }
    
    return (
        <div className='group relative bg-white border border-slate-200 p-6 rounded-2xl transition-all duration-300 hover:border-[#6A38C2]/40 hover:shadow-xl hover:shadow-[#6A38C2]/5 flex flex-col justify-between gap-5 h-full overflow-hidden'>
            {/* Soft inner glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#6A38C2]/2 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl pointer-events-none"></div>

            <div className="relative z-10 space-y-4">
                <div className='flex items-center justify-between'>
                    <div className="flex items-center gap-1.5 text-xs text-slate-450 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#6A38C2]/80" />
                        <span>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</span>
                    </div>
                    <Button 
                        variant="ghost" 
                        className="rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 w-9 h-9 flex items-center justify-center p-0 transition-all duration-300"
                    >
                        <Bookmark className="w-4 h-4" />
                    </Button>
                </div>

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
                        <h3 className='font-bold text-slate-700 group-hover:text-[#6A38C2] truncate transition-colors text-base'>{job?.company?.name || "Company Name"}</h3>
                        <div className="flex items-center gap-1 text-xs text-slate-450 font-semibold mt-0.5">
                            <MapPin className="w-3 h-3 text-[#6A38C2]/80" />
                            <span>India</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <h4 className='font-extrabold text-lg text-slate-800 group-hover:text-slate-900 truncate transition-colors'>{job?.title}</h4>
                    <p className='text-sm text-slate-600 leading-relaxed line-clamp-2'>{job?.description}</p>
                </div>

                <div className='flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100'>
                    <Badge className='bg-blue-50 text-blue-600 border border-blue-100 font-bold px-2 py-0.5 text-[10px] rounded-lg tracking-wide uppercase hover:bg-blue-100' variant="outline">
                        {job?.position} Positions
                    </Badge>
                    <Badge className='bg-pink-50 text-pink-600 border border-pink-100 font-bold px-2 py-0.5 text-[10px] rounded-lg tracking-wide uppercase hover:bg-pink-100' variant="outline">
                        {job?.jobType}
                    </Badge>
                    <Badge className='bg-[#6A38C2]/5 text-[#6A38C2] border border-[#6A38C2]/10 font-bold px-2 py-0.5 text-[10px] rounded-lg tracking-wide uppercase hover:bg-[#6A38C2]/10' variant="outline">
                        {job?.salary} LPA
                    </Badge>
                </div>
            </div>

            <div className='relative z-10 flex items-center gap-3 pt-1'>
                <Button 
                    onClick={() => navigate(`/description/${job?._id}`)} 
                    variant="outline" 
                    className="flex-1 border-slate-200 hover:border-slate-350 hover:bg-slate-50 hover:text-slate-900 text-slate-600 font-semibold text-xs py-5 rounded-xl transition-all duration-300"
                >
                    Details
                </Button>
                <Button 
                    className="flex-1 bg-gradient-to-r from-[#6A38C2] to-[#9363e6] hover:from-[#5b30a6] hover:to-[#8152cc] text-white font-semibold text-xs py-5 rounded-xl shadow-lg shadow-[#6A38C2]/10 hover:shadow-[#6A38C2]/30 transition-all duration-300"
                >
                    Save Later
                </Button>
            </div>
        </div>
    )
}

export default Job