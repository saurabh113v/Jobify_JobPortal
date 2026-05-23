import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectedConversation } from '@/redux/chatSlice'
import { MessageSquare } from 'lucide-react'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const messageRecruiterHandler = (recruiter) => {
        if (!recruiter) return;
        dispatch(setSelectedConversation({ otherUser: recruiter }));
        navigate("/chat");
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableCaption className="text-slate-400 text-xs mt-5">A comprehensive history of your submitted applications.</TableCaption>
                <TableHeader className="border-b border-slate-200">
                    <TableRow className="border-b border-slate-200 hover:bg-transparent">
                        <TableHead className="text-slate-450 font-bold uppercase tracking-wider text-[10px] py-4">Date</TableHead>
                        <TableHead className="text-slate-450 font-bold uppercase tracking-wider text-[10px] py-4">Job Role</TableHead>
                        <TableHead className="text-slate-450 font-bold uppercase tracking-wider text-[10px] py-4">Company</TableHead>
                        <TableHead className="text-slate-450 font-bold uppercase tracking-wider text-[10px] py-4">Status</TableHead>
                        <TableHead className="text-right text-slate-450 font-bold uppercase tracking-wider text-[10px] py-4">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ? (
                            <TableRow hoverClassName="none" className="hover:bg-transparent border-none">
                                <TableCell colSpan={5} className="text-center py-10 text-slate-400 font-semibold italic text-sm">
                                    You haven't submitted any job applications yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            allAppliedJobs.map((appliedJob) => {
                                const appliedStatus = appliedJob?.status || 'pending';
                                return (
                                    <TableRow key={appliedJob._id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                                        <TableCell className="text-slate-500 font-medium py-4 text-xs">
                                            {appliedJob?.createdAt ? new Date(appliedJob.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-slate-750 font-bold py-4 text-sm">{appliedJob.job?.title}</TableCell>
                                        <TableCell className="text-slate-500 font-semibold py-4 text-sm">{appliedJob.job?.company?.name}</TableCell>
                                        <TableCell className="py-4">
                                            <Badge 
                                                className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider border shadow-sm ${
                                                    appliedStatus === "rejected" ? 'bg-rose-50 text-rose-600 border-rose-200' : 
                                                    appliedStatus === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                                                    'bg-emerald-50 text-emerald-600 border-emerald-250'
                                                }`}
                                                variant="outline"
                                            >
                                                {appliedStatus.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right py-4">
                                            {(appliedJob.job?.created_by || appliedJob.job?.company?.userId) ? (
                                                <Button 
                                                    onClick={() => messageRecruiterHandler(appliedJob.job?.created_by || appliedJob.job?.company?.userId)}
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="text-[#6A38C2] hover:text-[#5b30a6] hover:bg-[#6A38C2]/5 gap-1.5 font-bold text-xs rounded-xl"
                                                >
                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                    Chat
                                                </Button>
                                            ) : (
                                                <span className="text-slate-400 text-xs">-</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable