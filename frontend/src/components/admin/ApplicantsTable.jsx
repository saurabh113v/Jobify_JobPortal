import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedConversation } from '@/redux/chatSlice';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const messageHandler = (candidate) => {
        if (!candidate) return;
        dispatch(setSelectedConversation({ otherUser: candidate }));
        navigate("/chat");
    }

    const statusHandler = async (status, id) => {
        console.log('called');
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            console.log(res);
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <tr key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell >
                                    {
                                        item.applicant?.profile?.resume ? <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a> : <span>NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal className="hover:text-[#6A38C2] transition-colors" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-36 bg-white border border-slate-100 rounded-xl shadow-lg p-2 space-y-0.5 z-50">
                                            {
                                                shortlistingStatus.map((status, index) => {
                                                    return (
                                                        <div 
                                                            onClick={() => statusHandler(status, item?._id)} 
                                                            key={index} 
                                                            className='flex w-full items-center px-2.5 py-1.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 cursor-pointer font-medium'
                                                        >
                                                            <span>{status}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <div 
                                                onClick={() => messageHandler(item?.applicant)}
                                                className='flex w-full items-center px-2.5 py-1.5 rounded-lg text-sm text-[#6A38C2] hover:bg-[#6A38C2]/5 cursor-pointer font-semibold border-t border-slate-100/80 mt-1 pt-1.5'
                                            >
                                                <span>Message</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>

                                </TableCell>

                            </tr>
                        ))
                    }

                </TableBody>

            </Table>
        </div>
    )
}

export default ApplicantsTable