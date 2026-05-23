import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import AppliedJobTable from './AppliedJobTable'
import MockInterviewTable from './MockInterviewTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { Contact, Mail, Pen, FileText, Globe, Award, Brain } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const isResume = !!user?.profile?.resume;

    return (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between">
            <div>
                <Navbar />
                
                <main className="max-w-4xl mx-auto px-6 py-10 relative z-10">
                    {/* Background glow highlights */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#6A38C2]/5 rounded-full blur-[100px] pointer-events-none"></div>

                    {/* PROFILE HEADER DETAILS PANEL */}
                    <div className='bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden shadow-xl shadow-slate-100/50'>
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#6A38C2]/5 rounded-full blur-3xl pointer-events-none"></div>

                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-slate-150 relative z-10'>
                            <div className='flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left'>
                                <Avatar className="h-24 w-24 border-2 border-[#6A38C2] shadow-lg shadow-[#6A38C2]/15">
                                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} className="object-cover" />
                                    <AvatarFallback className="font-extrabold text-2xl bg-slate-100 text-slate-600">
                                        {user?.fullname?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <h1 className='font-extrabold text-2xl text-slate-900 tracking-tight'>{user?.fullname}</h1>
                                    <p className="text-sm text-slate-600 font-medium max-w-md leading-relaxed">
                                        {user?.profile?.bio || "No professional bio added yet."}
                                    </p>
                                </div>
                            </div>
                            <Button 
                                onClick={() => setOpen(true)} 
                                className="w-10 h-10 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-500 hover:text-slate-950 rounded-xl shrink-0 self-end sm:self-center" 
                                variant="outline" 
                                size="icon"
                            >
                                <Pen className="w-4 h-4" />
                            </Button>
                        </div>
                        
                        {/* CONTACT DETAILS PANEL */}
                        <div className='my-6 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10'>
                            <div className='flex items-center gap-3.5 px-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 hover:border-[#6A38C2]/30 transition-all duration-300'>
                                <Mail className="w-4 h-4 text-[#6A38C2]" />
                                <span className="text-sm font-semibold text-slate-650">{user?.email}</span>
                            </div>
                            <div className='flex items-center gap-3.5 px-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 hover:border-[#6A38C2]/30 transition-all duration-300'>
                                <Contact className="w-4 h-4 text-[#6A38C2]" />
                                <span className="text-sm font-semibold text-slate-650">{user?.phoneNumber || "Not Provided"}</span>
                            </div>
                        </div>

                        {/* SKILLS PANEL (STUDENT ONLY) */}
                        {user?.role === 'student' && (
                            <div className='my-6 relative z-10'>
                                <h3 className='font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5'>
                                    <Award className="w-4 h-4 text-[#6A38C2]" />
                                    SKILLS & COMPETENCIES
                                </h3>
                                <div className='flex flex-wrap items-center gap-2'>
                                    {
                                        user?.profile?.skills && user.profile.skills.length !== 0 ? (
                                            user.profile.skills.map((item, index) => (
                                                <Badge 
                                                    key={index}
                                                    className="bg-[#6A38C2]/5 text-[#6A38C2] border border-[#6A38C2]/10 font-bold hover:bg-[#6A38C2]/10 px-3.5 py-1 text-xs rounded-full uppercase tracking-wider transition-colors"
                                                    variant="outline"
                                                >
                                                    {item}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-slate-400 font-semibold italic">No skills listed yet.</span>
                                        )
                                    }
                                </div>
                            </div>
                        )}

                        {/* RESUME ATTACHMENT PANEL (STUDENT ONLY) */}
                        {user?.role === 'student' && (
                            <div className='mt-6 pt-5 border-t border-slate-150 flex flex-col gap-2 relative z-10'>
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-450 flex items-center gap-1.5">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    ATTACHED RESUME
                                </Label>
                                {
                                    isResume ? (
                                        <a 
                                            target='_blank' 
                                            rel="noopener noreferrer" 
                                            href={user?.profile?.resume} 
                                            className='w-fit flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-100 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-all duration-300 cursor-pointer shadow-sm shadow-blue-500/5'
                                        >
                                            <FileText className="w-3.5 h-3.5" />
                                            <span className="truncate">{user?.profile?.resumeOriginalName || "View Resume File"}</span>
                                        </a>
                                    ) : (
                                        <span className="text-xs text-slate-400 font-semibold italic">No resume attached yet. Open profile edit panel to upload.</span>
                                    )
                                }
                            </div>
                        )}
                    </div>

                    {/* APPLIED JOBS TABLE SECTION (STUDENT ONLY) */}
                    {user?.role === 'student' && (
                        <div className='mt-10 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100/50'>
                            <h3 className='font-extrabold text-xl text-slate-800 mb-6 tracking-tight flex items-center gap-2'>
                                Applied Jobs
                            </h3>
                            <AppliedJobTable />
                        </div>
                    )}

                    {/* AI MOCK PRACTICE LOG (STUDENT ONLY) */}
                    {user?.role === 'student' && (
                        <div className='mt-10 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100/50'>
                            <h3 className='font-extrabold text-xl text-slate-800 mb-6 tracking-tight flex items-center gap-2'>
                                <Brain className="w-5 h-5 text-emerald-500 animate-pulse" />
                                AI Mock Practice Log
                            </h3>
                            <MockInterviewTable />
                        </div>
                    )}
                </main>
            </div>
            
            {open && <UpdateProfileDialog open={open} setOpen={setOpen}/>}
            <Footer />
        </div>
    )
}

export default Profile