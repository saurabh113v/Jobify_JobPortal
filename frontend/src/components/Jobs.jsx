import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import useGetAllJobs from '@/hooks/useGetAllJobs'; 

const Jobs = () => {
    // This hook fetches jobs from your backend and puts them in Redux
    useGetAllJobs(); 

    // 1. EXTRACT 'allJobs' FROM REDUX HERE
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    
    // 2. Initialize state with the real jobs from Redux, not dummy data
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        if (searchedQuery) {
            let parsedQuery = { query: "", location: "", filter: "" };
            try {
                if (searchedQuery.startsWith('{') && searchedQuery.endsWith('}')) {
                    parsedQuery = JSON.parse(searchedQuery);
                } else {
                    parsedQuery = { query: searchedQuery, location: "", filter: "" };
                }
            } catch (e) {
                parsedQuery = { query: searchedQuery, location: "", filter: "" };
            }

            const filteredJobs = allJobs.filter((job) => {
                // If searchedQuery is a plain string (like from FilterCard or CategoryCarousel)
                if (!searchedQuery.startsWith('{')) {
                    return job?.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                        job?.description?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                        job?.location?.toLowerCase().includes(searchedQuery.toLowerCase());
                }

                // If searched via split bar, apply logical AND matching on valid fields
                const titleMatch = !parsedQuery.query || 
                    job?.title?.toLowerCase().includes(parsedQuery.query.toLowerCase()) ||
                    job?.description?.toLowerCase().includes(parsedQuery.query.toLowerCase());
                    
                const locationMatch = !parsedQuery.location || 
                    job?.location?.toLowerCase().includes(parsedQuery.location.toLowerCase());

                const filterMatch = !parsedQuery.filter || 
                    job?.jobType?.toLowerCase().includes(parsedQuery.filter.toLowerCase());

                return titleMatch && locationMatch && filterMatch;
            })
            setFilterJobs(filteredJobs)
        } else {
            // 4. Reset back to the real 'allJobs' when there is no search query
            setFilterJobs(allJobs)
        }
    }, [allJobs, searchedQuery]); // 5. Add allJobs to the dependency array

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto px-6 mt-8'>
                <div className='flex flex-col md:flex-row gap-8'>
                    {/* Responsive Filter panel */}
                    <div className='w-full md:w-1/4 shrink-0'>
                        <FilterCard />
                    </div>
                    
                    {/* Jobs grid container */}
                    <div className='flex-1'>
                        {
                            filterJobs.length <= 0 ? (
                                <div className="py-20 text-center text-slate-500 font-medium border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                                    No matching jobs found. Try adjusting your filters!
                                </div>
                            ) : (
                                <div className='h-[82vh] overflow-y-auto pb-10 pr-2'>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                                        {
                                            filterJobs.map((job) => (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ duration: 0.3 }}
                                                    key={job?._id}>
                                                    <Job job={job} />
                                                </motion.div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jobs;