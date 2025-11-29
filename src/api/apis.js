import axiosInstance from "./axiosInstance";
import { setAccessToken } from "./tokenService";

export const signIn = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/login', userData)       
         setAccessToken(response.data.data.accessToken);
        return response
    } catch (error) {
        console.error(error);

    }
}
export const createUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/user/create-user', userData)

        return response
    } catch (error) {
    throw error.response ? error.response.data : error;

    }
}
export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get('/user/all-users')

        return response
    } catch (error) {
        console.error(error);

    }
}
export const deleteUser = async (id) => {
    try {
        const response = await axiosInstance.delete(`/user/delete-user/${id}`)

        return response
    } catch (error) {
        console.error(error);

    }
}
export const editUser = async (userData) => {
    try {
        const response = await axiosInstance.patch(`/user/edit-user/${userData._id}`, userData)

        return response
    } catch (error) {
        console.error(error);

    }
}

export const createFaq = async(faqData)=>{
    try {
        const response = await axiosInstance.post('/faq/create-faq',faqData)
        return response.data
    } catch (error) {
                console.error(error);

    }
}
export const getFaqs = async()=>{
    try {
        const response = await axiosInstance.get('/faq/all-faqs')
        return response.data
    } catch (error) {
                console.error(error);

    }
}

export const deletefaq = async (id) => {
    try {
        const response = await axiosInstance.delete(`/faq/delete-faq/${id}`)

        return response.data
    } catch (error) {
        console.error(error);

    }
}
export const editFaq = async (id,faqData) => {
    try {
        const response = await axiosInstance.patch(`/faq/edit-faq/${id}`, faqData)

        return response.data
    } catch (error) {
        console.error(error);

    }
}
export const editHomeFaq = async (id,faqData) => {
    try {
        const response = await axiosInstance.patch(`/faq/edit-home-faq/${id}`, faqData)

        return response.data
    } catch (error) {
        console.error(error);

    }
}
export const editFaqOrder = async (id,faqData) => {
    try {
        const response = await axiosInstance.patch(`/faq/edit-faq-order/${id}`, faqData)

        return response.data
    } catch (error) {
        console.error(error);

    }
}
export const getEnquiries = async (page, limit, filters = {}) => {
  try {
    const params = { page, limit };

    if (filters.search) params.search = filters.search;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;

    const response = await axiosInstance.get(`/enquiry/all-enquiries`, { params });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const deleteEnquiries = async (id) => {
    try {
        const response = await axiosInstance.delete(`/enquiry/delete-enquiry/${id}`)

        return response.data
    } catch (error) {
        console.error(error);

    }
}

export const addBlog = async (blogData) => {
    try {
        const response = await axiosInstance.post(`/blog/add-blog`,blogData,{
        headers: {
          "Content-Type": "multipart/form-data",
        }})

        return response.data
    } catch (error) {
        console.error(error);

    }
}
export const getBlogs = async () => {
    try {
        const response = await axiosInstance.get(`/blog/get-blogs`)
        return response.data
    } catch (error) {
        console.error(error);

    }
}
export const getBlog = async (id) => {
    try {
     const response = await axiosInstance.get(`/blog/get-blog/${id}`)
        return response.data
    } catch (error) {
        console.error(error);

    }
}
export const updateBlog = async (id) => {
    try {
     const response = await axiosInstance.get(`/blog/get-blog/${id}`)
        return response.data
    } catch (error) {
        console.error(error);

    }
}
