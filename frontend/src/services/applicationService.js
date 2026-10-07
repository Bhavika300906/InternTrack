import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/applications/";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        Authorization: `Token ${token}`,
    };
};

export const getApplications = async () => {
    const response = await axios.get(API_URL, {
        headers: getAuthHeaders(),
    });

    return response.data;
};

export const getApplication = async (id) => {
    const response = await axios.get(
        `${API_URL}${id}/`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};

export const createApplication = async (applicationData) => {
    const response = await axios.post(
        API_URL,
        applicationData,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};

export const updateApplication = async (
    id,
    applicationData
) => {
    const response = await axios.patch(
        `${API_URL}${id}/`,
        applicationData,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};

export const deleteApplication = async (id) => {
    await axios.delete(
        `${API_URL}${id}/`,
        {
            headers: getAuthHeaders(),
        }
    );
};