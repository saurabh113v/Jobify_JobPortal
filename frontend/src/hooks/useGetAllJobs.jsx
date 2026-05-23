/*
import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);
    
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
        
    // ✅ FIX: Added searchedQuery to the dependency array
    }, [searchedQuery]) 
}

export default useGetAllJobs

*/

import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);
    
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                let keyword = "";
                let location = "";
                let jobType = "";

                if (searchedQuery) {
                    if (searchedQuery.startsWith('{') && searchedQuery.endsWith('}')) {
                        try {
                            const parsed = JSON.parse(searchedQuery);
                            keyword = parsed.query || "";
                            location = parsed.location || "";
                            jobType = parsed.filter || "";
                        } catch (e) {
                            keyword = searchedQuery;
                        }
                    } else {
                        keyword = searchedQuery;
                    }
                }

                const res = await axios.get(
                    `${JOB_API_END_POINT}/get?keyword=${keyword}&location=${location}&jobType=${jobType}`, 
                    { withCredentials: true }
                );
                
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
        
    }, [searchedQuery, dispatch]) 
}

export default useGetAllJobs;