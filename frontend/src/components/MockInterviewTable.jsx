import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';
import { Eye, Loader2 } from 'lucide-react';

const MockInterviewTable = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${INTERVIEW_API_END_POINT}/history`, { withCredentials: true });
                if (res.data.success) {
                    setInterviews(res.data.interviews);
                }
            } catch (error) {
                console.error("Fetch interview history error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="w-8 h-8 text-[#6A38C2] animate-spin" />
                <p className="mt-2 text-slate-400 text-xs font-bold animate-pulse">Loading practice history...</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableCaption className="text-slate-400 text-xs mt-5">A complete summary of your practice mock interview outcomes.</TableCaption>
                <TableHeader className="border-b border-slate-200">
                    <TableRow className="border-b border-slate-200 hover:bg-transparent">
                        <TableHead className="text-slate-450 font-bold uppercase tracking-wider text-[10px] py-4">Date</TableHead>
                        <TableHead className="text-slate-450 font-bold uppercase tracking-wider text-[10px] py-4">Job Role</TableHead>
                        <TableHead className="text-slate-450 font-bold uppercase tracking-wider text-[10px] py-4">Company</TableHead>
                        <TableHead className="text-slate-450 font-bold uppercase tracking-wider text-[10px] py-4">Readiness</TableHead>
                        <TableHead className="text-right text-slate-450 font-bold uppercase tracking-wider text-[10px] py-4">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        interviews.length <= 0 ? (
                            <TableRow hoverClassName="none" className="hover:bg-transparent border-none">
                                <TableCell colSpan={5} className="text-center py-10 text-slate-400 font-semibold italic text-sm">
                                    You haven't completed any AI mock interviews yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            interviews.map((item) => {
                                const score = item.score || 0;
                                return (
                                    <TableRow key={item._id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                                        <TableCell className="text-slate-500 font-medium py-4 text-xs">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-slate-750 font-bold py-4 text-sm">{item.job?.title || item.customRole || "General Practice"}</TableCell>
                                        <TableCell className="text-slate-500 font-semibold py-4 text-sm">{item.job?.company?.name || "AI Video Simulator"}</TableCell>
                                        <TableCell className="py-4">
                                            <Badge 
                                                className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider border shadow-sm ${
                                                    score >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-200 animate-pulse' : 
                                                    score >= 50 ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                                                    'bg-rose-50 text-rose-600 border-rose-200'
                                                }`}
                                                variant="outline"
                                            >
                                                {score}% Ready
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right py-4">
                                            <Button 
                                                onClick={() => navigate(`/interview-result/${item._id}`)}
                                                variant="ghost" 
                                                size="sm" 
                                                className="text-[#6A38C2] hover:text-[#5b30a6] hover:bg-[#6A38C2]/5 gap-1.5 font-bold text-xs rounded-xl"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                View Scorecard
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )
                    }
                </TableBody>
            </Table>
        </div>
    );
};

export default MockInterviewTable;
