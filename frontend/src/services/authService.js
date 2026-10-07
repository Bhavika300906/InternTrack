import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

export const registerUser = async (userData) => {
    const response = await axios.post(
        `${API_URL}register/`,
        userData
    );

    return response.data;
};

export const loginUser = async (userData) => {
    const response = await axios.post(
        `${API_URL}login/`,
        userData
    );

    return response.data;
};

export const logoutUser = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
        `${API_URL}logout/`,
        {},
        {
            headers: {
                Authorization: `Token ${token}`,
            },
        }
    );

    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API_URL}user/`,
        {
            headers: {
                Authorization: `Token ${token}`,
            },
        }
    );

    return response.data;
};

export const changePassword = async (passwordData) => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
        `${API_URL}change-password/`,
        passwordData,
        {
            headers: {
                Authorization: `Token ${token}`,
            },
        }
    );

    return response.data;
};

export const getProfile = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API_URL}profile/`,
        {
            headers: {
                Authorization: `Token ${token}`,
            },
        }
    );

    return response.data;
};


export const updateProfile = async (profileData) => {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
        `${API_URL}profile/`,
        profileData,
        {
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};