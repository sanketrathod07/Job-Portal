import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const useUpdateJobById = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const updateJob = async (jobId, updatedData) => {
        try {
            const res = await axios.put(`${JOB_API_END_POINT}/update/${jobId}`, updatedData, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setAllJobs(res.data.jobs));
                navigate('/admin/jobs');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update job");
        }
    };

    return updateJob;
};

export default useUpdateJobById;
