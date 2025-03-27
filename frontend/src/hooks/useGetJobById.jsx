import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice"; // Ensure you have this action
import { JOB_API_END_POINT } from "@/utils/constant";

const useGetJobById = (jobId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchJobById = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });

                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                }
                return res.data;
            } catch (error) {
                console.log("Error in Getting JobID: ", error);
            }
        };

        if (jobId) fetchJobById();
    }, [jobId, dispatch]);
};

export default useGetJobById;
