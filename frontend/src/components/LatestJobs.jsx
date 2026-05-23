import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux'; 

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
    const {allJobs} = useSelector(store=>store.job);
   
    return (
        <div className='max-w-7xl mx-auto my-24 px-6'>
            <h2 className='text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800 text-center sm:text-left'>
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-[#9363e6]'>Latest & Top </span> 
                Job Openings
            </h2>
            
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8'>
                {
                    allJobs.length <= 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-500 font-medium border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                            No Job Openings Available
                        </div>
                    ) : (
                        allJobs?.slice(0,6).map((job) => <LatestJobCards key={job._id} job={job}/>)
                    )
                }
            </div>
        </div>
    )
}

export default LatestJobs