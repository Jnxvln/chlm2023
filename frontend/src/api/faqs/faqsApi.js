import axios from 'axios'

const API_URL = '/api/faq/'
const ACTIVE_API_URL = '/api/faq-active'

// Get all FAQs
export const getFaqs = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get(API_URL, config)
    return response.data
}

// Get ony active FAQs
export const getActiveFaqs = async () => {
    const response = await axios.get(ACTIVE_API_URL)
    return response.data
}

// Get FAQ by ID
export const getFaqById = async (faqId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get(API_URL + faqId, config)
    return response.data
}

// Create FAQ
export const createFaq = async (faqData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.post(API_URL, faqData, config)
    return response.data
}

// Update FAQ
export const updateFaq = async (faqData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.put(
        API_URL + `${faqData._id}`,
        faqData,
        config
    )
    return response.data
}

// Delete FAQ
export const deleteFaq = async (faqId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.delete(API_URL + faqId, config)
    return response.data
}
