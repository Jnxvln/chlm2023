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

// Get all hauls within date range
export const getAllHaulsByDateRange = async (dateStart, dateEnd, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get(
        `${API_URL}range/${dateStart}/${dateEnd}`,
        config
    )
    return response.data
}

// Get hauls by driver ID within date range
export const getHaulsByDriverIdAndDateRange = async (
    driverId,
    dateStart,
    dateEnd,
    token
) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get(
        `${API_URL}for/${driverId}/${dateStart}/${dateEnd}`,
        config
    )
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
