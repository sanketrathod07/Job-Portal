import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector((store) => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [selectedFilters, setSelectedFilters] = useState({
        location: [],
        industry: [],
        salaryRange: [],
        experienceLevel: [],
    });

    const [isFilterVisible, setIsFilterVisible] = useState(false);

    useEffect(() => {
        applyFilters();
    }, [allJobs, searchedQuery, selectedFilters]);

    const applyFilters = () => {
        let filteredJobs = allJobs;
        const query = typeof searchedQuery === "string" ? searchedQuery.toLowerCase() : "";

        if (query) {
            filteredJobs = filteredJobs.filter(
                (job) =>
                    job.title.toLowerCase().includes(query) ||
                    job.description.toLowerCase().includes(query) ||
                    job.location.toLowerCase().includes(query)
            );
        }

        Object.keys(selectedFilters).forEach((category) => {
            if (selectedFilters[category]?.length > 0) {
                filteredJobs = filteredJobs.filter((job) => {
                    if (category === "location") {
                        return selectedFilters[category].some((filterValue) =>
                            job.location?.toLowerCase().includes(filterValue.toLowerCase())
                        );
                    }

                    if (category === "salaryRange") {
                        return selectedFilters[category].some((range) => {
                            const [min, max] = range.split("-").map((s) => parseInt(s) * 100000);
                            return job.salary >= min && job.salary <= max;
                        });
                    }

                    if (category === "industry") {
                        return selectedFilters[category].some((industry) =>
                            job.title?.toLowerCase().includes(industry.toLowerCase())
                        );
                    }

                    if (category === "experienceLevel") {
                        return selectedFilters[category].includes(job.experienceLevel.toString());
                    }

                    return false;
                });
            }
        });

        setFilterJobs(filteredJobs);
    };

    const handleFilterChange = (category, value) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };

            if (!updatedFilters[category]) {
                updatedFilters[category] = [];
            }

            if (updatedFilters[category].includes(value)) {
                updatedFilters[category] = updatedFilters[category].filter((item) => item !== value);
            } else {
                updatedFilters[category] = [...updatedFilters[category], value];
            }

            return updatedFilters;
        });
    };

    const clearFilters = () => {
        setSelectedFilters({
            location: [],
            industry: [],
            salaryRange: [],
            experienceLevel: [],
        });

        setFilterJobs(allJobs);
        setIsFilterVisible(false);
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-[100rem] mx-auto mt-5 px-4">
                {/* Mobile Filter Toggle Button */}
                <div className="md:hidden flex justify-between items-center mb-4">
                    <h1 className="text-lg font-bold">Job Listings</h1>
                    <button
                        onClick={() => setIsFilterVisible(!isFilterVisible)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2"
                    >
                        Filters {isFilterVisible ? "▲" : "▼"}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row">
                    {/* Desktop Filter Sidebar (Always Visible) */}
                    <div className="hidden md:block md:w-1/4">
                        <FilterCard onFilterChange={handleFilterChange} selectedFilters={selectedFilters} />
                        <button onClick={clearFilters} className="mt-4 p-2 bg-red-500 text-white rounded w-[80%]">
                            Clear Filters
                        </button>
                    </div>

                    {/* Mobile Filter Sidebar with Animation */}
                    <AnimatePresence>
                        {isFilterVisible && (
                            <motion.div
                                initial={{ y: "100vh" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100vh" }}
                                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 z-50 md:hidden"
                            >
                                <FilterCard onFilterChange={handleFilterChange} selectedFilters={selectedFilters} />
                                <button onClick={clearFilters} className="mt-4 p-2 bg-red-500 text-white rounded w-full">
                                    Clear Filters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Job Listings */}
                    <div className="flex-1 overflow-y-auto pb-5">
                        {filterJobs.length <= 0 ? (
                            <span>No jobs found</span>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {filterJobs.map((job) => (
                                    <motion.div
                                        key={job?._id}
                                        initial={{ y: 100 }}
                                        animate={{ y: 0 }}
                                        exit={{ y: 100 }}
                                        transition={{ duration: 0.3 }}
                                        className="md:animate-none"
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
