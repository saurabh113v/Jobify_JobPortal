import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className="relative my-12 py-4">
            <Carousel className="w-full max-w-2xl mx-auto px-12">
                <CarouselContent className="-ml-2 md:-ml-4">
                    {
                        category.map((cat, index) => (
                            <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/3 flex justify-center">
                                <Button 
                                    onClick={() => searchJobHandler(cat)} 
                                    variant="outline" 
                                    className="rounded-full w-full py-6 bg-white border-slate-200 hover:border-[#6A38C2] hover:bg-[#6A38C2]/5 hover:text-[#6A38C2] text-slate-600 font-semibold text-xs tracking-wide uppercase transition-all duration-300 hover:scale-105 shadow-sm shadow-slate-100/50"
                                >
                                    {cat}
                                </Button>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious className="bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-[#6A38C2] transition-all duration-300 -left-1 sm:-left-4" />
                <CarouselNext className="bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-[#6A38C2] transition-all duration-300 -right-1 sm:-right-4" />
            </Carousel>
        </div>
    )
}

export default CategoryCarousel