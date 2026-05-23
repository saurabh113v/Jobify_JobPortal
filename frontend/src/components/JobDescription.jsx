import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { setSelectedConversation } from '@/redux/chatSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { Calendar, Users, Briefcase, MapPin, DollarSign, Award, Clock } from 'lucide-react'

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const userApplication = singleJob?.applications?.find(application => {
        const applicantId = typeof application.applicant === 'object' ? application.applicant?._id : application.applicant;
        return applicantId === user?._id;
    });
    const isIntiallyApplied = !!userApplication;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const messageRecruiterHandler = () => {
        if (!user) {
            toast.error("Please login as a student to chat with the recruiter.");
            navigate("/login");
            return;
        }
        const recipient = singleJob?.created_by || singleJob?.company?.userId;
        if (!recipient) {
            toast.error("Recruiter information is not available.");
            return;
        }
        dispatch(setSelectedConversation({ otherUser: recipient }));
        navigate("/chat");
    }

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true); // Update the local state
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id, status:'pending'}]}
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res.data.message);

            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message || "An error occurred.");
        }
    }

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    const formattedDate = singleJob?.createdAt ? new Date(singleJob.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'N/A';

    return (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between">
            <div>
                <Navbar />
                
                <main className='max-w-6xl mx-auto py-12 px-6 relative z-10'>
                    {/* Background glow highlights */}
                    <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#6A38C2]/5 rounded-full blur-[100px] pointer-events-none"></div>

                    {/* TOP DETAILS HEADER PANEL */}
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200/60'>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 px-3 py-1 rounded-md border border-slate-200">
                                    {singleJob?.company?.name}
                                </span>
                            </div>
                            <h1 className='text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight'>{singleJob?.title}</h1>
                            <div className='flex flex-wrap items-center gap-2 mt-4'>
                                <Badge className='bg-blue-50 text-blue-600 border border-blue-100 font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wide' variant="outline">
                                    {singleJob?.position} Positions
                                </Badge>
                                <Badge className='bg-pink-50 text-pink-600 border border-pink-100 font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wide' variant="outline">
                                    {singleJob?.jobType}
                                </Badge>
                                <Badge className='bg-[#6A38C2]/5 text-[#6A38C2] border border-[#6A38C2]/10 font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wide' variant="outline">
                                    {singleJob?.salary} LPA
                                </Badge>
                            </div>
                        </div>
                        
                        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0'>
                            {(!user || user.role !== 'recruiter') && (singleJob?.created_by || singleJob?.company?.userId) && (
                                <Button
                                    onClick={messageRecruiterHandler}
                                    className="rounded-xl py-6 px-6 text-sm font-semibold tracking-wide border-2 border-[#6A38C2] text-[#6A38C2] bg-transparent hover:bg-[#6A38C2]/5 transition-all duration-300 shadow-md hover:shadow-[#6A38C2]/10"
                                >
                                    Message Recruiter
                                </Button>
                            )}

                            {isApplied && (
                                <Badge className={`px-4 py-2 text-xs font-bold rounded-xl uppercase border shadow-sm flex items-center justify-center ${
                                    (userApplication?.status || 'pending') === "accepted" ? "bg-emerald-50 text-emerald-600 border-emerald-250" :
                                    (userApplication?.status || 'pending') === "rejected" ? "bg-rose-50 text-rose-600 border-rose-250" :
                                    "bg-amber-50 text-amber-600 border-amber-250"
                                }`} variant="outline">
                                    Status: {userApplication?.status || 'pending'}
                                </Badge>
                            )}
                            <Button
                                onClick={isApplied ? null : applyJobHandler}
                                disabled={isApplied}
                                className={`rounded-xl py-6 px-8 text-sm font-semibold tracking-wide transition-all duration-300 ${
                                    isApplied 
                                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-[#6A38C2] to-[#9363e6] hover:from-[#5b30a6] hover:to-[#8152cc] text-white shadow-lg shadow-[#6A38C2]/20 hover:shadow-[#6A38C2]/35 hover:-translate-y-[1px]'
                                }`}
                            >
                                {isApplied ? 'Already Applied' : 'Apply Now'}
                            </Button>
                        </div>
                    </div>

                    {/* MAIN SPECIFICATIONS GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
                        {/* LEFT COLUMN: Detailed Information */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                                <h2 className='text-xl font-bold text-slate-800 tracking-tight border-b border-slate-150 pb-3'>Job Overview</h2>
                                <p className='text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-line'>
                                    {singleJob?.description}
                                </p>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Summary cards */}
                        <div className="space-y-6">
                            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md shadow-slate-100">
                                <h3 className="text-base font-bold text-slate-500 border-b border-slate-150 pb-3 mb-5 uppercase tracking-wider text-xs">Job Specifications</h3>
                                
                                <div className="space-y-4.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-[#6A38C2] shrink-0">
                                            <Briefcase className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Role Title</div>
                                            <div className="text-sm font-semibold text-slate-700 mt-0.5">{singleJob?.title}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-pink-500 shrink-0">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Location</div>
                                            <div className="text-sm font-semibold text-slate-700 mt-0.5">{singleJob?.location}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-blue-500 shrink-0">
                                            <Award className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Experience Needed</div>
                                            <div className="text-sm font-semibold text-slate-700 mt-0.5">{singleJob?.experience} Years</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-emerald-600 shrink-0">
                                            <DollarSign className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Annual Salary</div>
                                            <div className="text-sm font-semibold text-slate-700 mt-0.5">{singleJob?.salary} LPA</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-purple-500 shrink-0">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Total Applicants</div>
                                            <div className="text-sm font-semibold text-slate-700 mt-0.5">{singleJob?.applications?.length || 0}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-amber-600 shrink-0">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Posted Date</div>
                                            <div className="text-sm font-semibold text-slate-700 mt-0.5">{formattedDate}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
            <Footer />
        </div>
    )
}

export default JobDescription