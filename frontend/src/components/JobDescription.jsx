import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <>
            <Navbar />
            <div className='max-w-5xl mx-auto my-10 p-6 bg-white rounded-lg'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                    <div>
                        <h1 className='text-2xl font-bold'>{singleJob?.title}</h1>
                        <div className='flex flex-wrap items-center gap-2 mt-4'>
                            <Badge className="bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-md">
                                {singleJob?.position} Positions
                            </Badge>
                            <Badge className="bg-red-100 text-red-800 font-semibold px-3 py-1 rounded-md">
                                {singleJob?.jobType}
                            </Badge>
                            <Badge className="bg-purple-100 text-purple-800 font-semibold px-3 py-1 rounded-md">
                                {singleJob?.salary} LPA
                            </Badge>
                        </div>

                    </div>
                    <Button
                        onClick={isApplied ? null : applyJobHandler}
                        disabled={isApplied}
                        className={`px-5 py-2 rounded-lg transition-all ${isApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}
                    >
                        {isApplied ? 'Already Applied' : 'Apply Now'}
                    </Button>
                </div>

                <h2 className='border-b-2 border-gray-300 font-medium py-4 mt-4 text-lg'>Job Details</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                    <p><span className='font-bold'>Role:</span> {singleJob?.title}</p>
                    <p><span className='font-bold'>Location:</span> {singleJob?.location}</p>
                    <p><span className='font-bold'>Experience:</span> {singleJob?.experience} yrs</p>
                    <p><span className='font-bold'>Salary:</span> {singleJob?.salary} LPA</p>
                    <p><span className='font-bold'>Applicants:</span> {singleJob?.applications?.length}</p>
                    <p><span className='font-bold'>Posted Date:</span> {singleJob?.createdAt?.split('T')[0]}</p>
                </div>
                <div className='mt-4'>
                    <h2 className='font-bold text-lg mb-2'>Job Description</h2>
                    <p className='text-gray-700'>{singleJob?.description}</p>
                </div>
            </div>
        </>
    );
};

export default JobDescription;