import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Browse = () => {
    useGetAllJobs();
    const {allJobs} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[])
    return (
        <div className="min-h-screen flex flex-col justify-between selection:bg-[#6A38C2]/10 selection:text-[#6A38C2]">
            <Navbar />
            
            <div className="flex-grow max-w-7xl mx-auto my-12 px-6 w-full relative z-10">
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#6A38C2]/5 rounded-full blur-[80px] pointer-events-none"></div>
                
                <h2 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight flex items-center gap-2.5">
                    <span>Search Results</span>
                    <span className="text-[#6A38C2] font-bold bg-white border border-slate-200 rounded-xl px-3.5 py-1 text-base shadow-sm">
                        {allJobs.length}
                    </span>
                </h2>
                
                {allJobs.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            allJobs.map((job) => {
                                return (
                                    <Job key={job._id} job={job}/>
                                )
                            })
                        }
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50/50 border border-slate-200 rounded-2xl p-8">
                        <p className="text-slate-600 text-lg font-medium">No jobs matching your query were found.</p>
                        <p className="text-slate-450 text-sm mt-1.5">Try searching with other keywords or filters.</p>
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    )
}

export default Browse