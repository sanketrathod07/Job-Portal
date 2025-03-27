import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const filterData = [
    {
        filterType: "Location",
        category: "location",
        options: ["Delhi, India", "Bangalore, India", "Hyderabad, India", "Pune, India", "Mumbai, India"]
    },
    {
        filterType: "Industry",
        category: "industry",
        options: ["DevOps Engineer", "Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        filterType: "Salary",
        category: "salaryRange",
        options: ["0-4", "4-8", "8-15+"]
    },
    {
        filterType: "Experience Level",
        category: "experienceLevel",
        options: ["1", "2", "3+"]
    }
];


const FilterCard = ({ onFilterChange, selectedFilters }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchedQuery(selectedFilters));
    }, [selectedFilters]);

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            {
                filterData.map((data) => (
                    <div key={data.category}>
                        <h1 className='font-bold text-lg'>{data.filterType}</h1>
                        {
                            data.options.map((item) => (
                                <div className='flex items-center space-x-2 my-2' key={item}>
                                    <input
                                        type="checkbox"
                                        id={item}
                                        checked={selectedFilters[data.category]?.includes(item) || false}
                                        onChange={() => onFilterChange(data.category, item)}
                                    />
                                    <label htmlFor={item}>{item}</label>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    );
};

export default FilterCard;
