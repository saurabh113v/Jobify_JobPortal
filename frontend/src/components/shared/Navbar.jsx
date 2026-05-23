import React, { useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2, MessageSquare, ChevronDown, FileText, Briefcase, Sparkles, Video } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { setConversations } from '@/redux/chatSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const { conversations } = useSelector(store => store.chat);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fetch conversations list once on mount if user is logged in
    useEffect(() => {
        if (user) {
            const fetchConversations = async () => {
                try {
                    const res = await axios.get("http://localhost:4000/api/v1/message/conversations", {
                        withCredentials: true
                    });
                    if (res.data.success) {
                        dispatch(setConversations(res.data.conversations));
                    }
                } catch (error) {
                    console.error("Navbar conversations fetch error:", error);
                }
            };
            fetchConversations();
        }
    }, [user, dispatch]);

    // Calculate unread conversations count
    const unreadCount = conversations.reduce((acc, conv) => {
        if (conv.lastMessage && !conv.lastMessage.isRead && conv.lastMessage.senderId !== user?._id) {
            return acc + 1;
        }
        return acc;
    }, 0);

    const logoutHandler = async () => {
        try {
            const res = await axios.post(`${USER_API_END_POINT}/logout`, {}, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/home");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "An error occurred during logout");
        }
    }

    return (
        <div className='sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-6'>
                
                {/* --- SLEEK TYPOGRAPHY LOGO --- */}
                <div className='flex items-center gap-2'>
                    <Link to={user && user.role === 'recruiter' ? "/" : "/home"} className="flex items-center gap-1 group">
                        <h1 className='text-3xl font-extrabold tracking-tighter transition-all duration-300 group-hover:scale-105'>
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] via-[#9363e6] to-pink-500'>
                                Jobify
                            </span>
                        </h1>
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
                    </Link>
                </div>
                {/* ---------------------------- */}
 
                <div className='flex items-center gap-8'>
                    <ul className='hidden md:flex font-semibold items-center gap-8 text-slate-600'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li>
                                        <Link to="/admin/companies" className="hover:text-slate-900 transition-colors relative py-1.5 block group">
                                            Companies
                                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#6A38C2] to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/admin/jobs" className="hover:text-slate-900 transition-colors relative py-1.5 block group">
                                            Jobs
                                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#6A38C2] to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link to="/home" className="hover:text-slate-900 transition-colors relative py-1.5 block group">
                                            Home
                                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#6A38C2] to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/jobs" className="hover:text-slate-900 transition-colors relative py-1.5 block group">
                                            Jobs
                                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#6A38C2] to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/browse" className="hover:text-slate-900 transition-colors relative py-1.5 block group">
                                            Browse
                                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#6A38C2] to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="flex items-center gap-1 hover:text-slate-900 transition-colors relative py-1.5 group outline-none">
                                                    Services
                                                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
                                                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#6A38C2] to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-64 bg-white border border-slate-200 text-slate-900 rounded-2xl shadow-xl p-3 mt-2 z-50">
                                                <div className="flex flex-col gap-1">
                                                    <Link to="/ats-checker" className="flex items-start gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 group">
                                                        <FileText className="w-5 h-5 text-[#9363e6] group-hover:scale-110 transition-transform mt-0.5" />
                                                        <div className="text-left">
                                                            <div className="text-sm font-semibold">ATS Checker</div>
                                                            <div className="text-xs text-slate-400 font-normal">Scan and score your resume</div>
                                                        </div>
                                                    </Link>
                                                    <Link to="/resume-maker" className="flex items-start gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 group">
                                                        <Sparkles className="w-5 h-5 text-[#9363e6] group-hover:scale-110 transition-transform mt-0.5" />
                                                        <div className="text-left">
                                                            <div className="text-sm font-semibold">AI Resume Maker</div>
                                                            <div className="text-xs text-slate-400 font-normal">Build resumes with AI assistance</div>
                                                        </div>
                                                    </Link>
                                                    <Link to="/face-to-face-interview" className="flex items-start gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 group">
                                                        <Video className="w-5 h-5 text-[#9363e6] group-hover:scale-110 transition-transform mt-0.5" />
                                                        <div className="text-left">
                                                            <div className="text-sm font-semibold">AI Mock Interview</div>
                                                            <div className="text-xs text-slate-400 font-normal">Face-to-Face video simulation</div>
                                                        </div>
                                                    </Link>
                                                    {user && (
                                                        <Link to="/profile" className="flex items-start gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 group">
                                                            <Briefcase className="w-5 h-5 text-[#9363e6] group-hover:scale-110 transition-transform mt-0.5" />
                                                            <div className="text-left">
                                                                <div className="text-sm font-semibold">Applied Jobs</div>
                                                                <div className="text-xs text-slate-400 font-normal">Track application statuses</div>
                                                            </div>
                                                        </Link>
                                                    )}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </li>
                                </>
                            )
                        }
                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-3'>
                                <Link to="/login">
                                    <Button variant="outline" className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-300">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-gradient-to-r from-[#6A38C2] to-[#9363e6] hover:from-[#5b30a6] hover:to-[#8152cc] text-white font-medium px-5 rounded-xl shadow-lg shadow-[#6A38C2]/20 hover:shadow-[#6A38C2]/45 hover:-translate-y-[1px] transition-all duration-300">
                                        Signup
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className='flex items-center gap-4'>
                                <Link to="/chat" className="relative p-2 text-slate-600 hover:text-[#6A38C2] hover:bg-slate-100 rounded-full transition-all duration-300 group animate-fade-in" title="Messages">
                                    <MessageSquare className="w-6 h-6 transition-transform group-hover:scale-110" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white border-2 border-white animate-pulse">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Avatar className="cursor-pointer border-2 border-transparent hover:border-[#6A38C2] shadow-md transition-all duration-300">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} className="object-cover" />
                                            <AvatarFallback className="bg-slate-100 text-slate-700">{user?.fullname?.charAt(0) || 'U'}</AvatarFallback>
                                        </Avatar>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 bg-white border border-slate-200 text-slate-900 rounded-2xl shadow-xl p-5 mt-2 z-50">
                                        <div className='space-y-4'>
                                            <div className='flex items-start gap-3.5 pb-3 border-b border-slate-100'>
                                                <Avatar className="h-10 w-10 border border-slate-100">
                                                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} className="object-cover" />
                                                    <AvatarFallback className="bg-slate-100 text-slate-700">{user?.fullname?.charAt(0) || 'U'}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className='font-bold text-slate-800 truncate'>{user?.fullname}</h4>
                                                    <p className='text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed'>{user?.profile?.bio || 'Student'}</p>
                                                </div>
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                {
                                                    user && (
                                                        <Link to="/profile" className='flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 group'>
                                                            <User2 className="w-4 h-4 text-[#9363e6] group-hover:scale-110 transition-transform" />
                                                            <span className="text-sm font-medium">View Profile</span>
                                                        </Link>
                                                    )
                                                }
 
                                                <button onClick={logoutHandler} className='flex w-full items-center gap-3.5 px-3 py-2.5 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all duration-200 group text-left'>
                                                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                    <span className="text-sm font-medium">Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar