import axios from 'axios'

const API_URL = '/api/hauls/'

// Get all hauls
export const getHauls = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get(API_URL, config)
    return response.data
}

// Create haul
export const createHaul = async (haulData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.post(API_URL, haulData, config)
    return response.data
}

// Update haul
export const updateHaul = async (haulData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.put(API_URL + haulData._id, haulData, config)
    return response.data
}

// Delete haul
export const deleteHaul = async (haulId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.delete(API_URL + haulId, config)
    return response.data
}
