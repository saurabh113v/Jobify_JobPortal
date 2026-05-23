import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const fitlerData = [
    {
        fitlerType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        fitlerType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        fitlerType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();
    const changeHandler = (value) => {
        setSelectedValue(value);
    }
    useEffect(()=>{
        dispatch(setSearchedQuery(selectedValue));
    },[selectedValue]);

    return (
        <div className='w-full bg-white border border-slate-200 p-6 rounded-2xl shadow-md'>
            <div className="flex items-center justify-between pb-3 border-b border-slate-150">
                <h2 className='font-extrabold text-slate-850 text-lg tracking-tight'>Filter Jobs</h2>
                {selectedValue && (
                    <button 
                        onClick={() => setSelectedValue('')} 
                        className="text-xs text-[#6A38C2] hover:text-[#5b30a6] hover:underline font-semibold transition-all"
                    >
                        Clear All
                    </button>
                )}
            </div>
            
            <RadioGroup value={selectedValue} onValueChange={changeHandler} className="mt-4 space-y-5">
                {
                    fitlerData.map((data, index) => (
                        <div key={`filter-group-${index}`} className="space-y-2">
                            <h3 className='font-bold text-xs uppercase tracking-wider text-slate-400'>{data.fitlerType}</h3>
                            <div className="flex flex-col gap-2">
                                {
                                    data.array.map((item, idx) => {
                                        const itemId = `id${index}-${idx}`
                                        return (
                                            <div key={itemId} className='flex items-center space-x-3 py-1 px-2 rounded-xl hover:bg-slate-50 transition-all duration-200 cursor-pointer group'>
                                                <RadioGroupItem 
                                                    value={item} 
                                                    id={itemId} 
                                                    className="border-slate-300 text-[#6A38C2] focus:ring-[#6A38C2]/30" 
                                                />
                                                <Label 
                                                    htmlFor={itemId} 
                                                    className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors cursor-pointer w-full select-none"
                                                >
                                                    {item}
                                                </Label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    ))
                }
            </RadioGroup>
        </div>
    )
}

export default FilterCard