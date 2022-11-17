import axios from 'axios'

const API_URL = '/api/workdays/'

// Get absolutely all workdays
export const getAllWorkdays = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get(API_URL, config)
    return response.data
}

// Get all workdays for specified driver
export const getWorkdaysByDriverId = async (driverId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get(`${API_URL}for/${driverId}`, config)
    return response.data
}

// Get all workdays for specified driver during specified date range
export const getWorkdaysByDriverIdAndDateRange = async (
    driverId,
    rangeStart,
    rangeEnd,
    token
) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get(
        `${API_URL}for/${driverId}/${rangeStart}/${rangeEnd}`,
        config
    )

    return response.data
}

// Create workday
export const createWorkday = async (formData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.post(API_URL, formData, config)
    return response.data
}

// Update workday
export const updateWorkday = async (formData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.put(
        `${API_URL}${formData._id}`,
        formData,
        config
    )
    return response.data
}

// Delete workday
export const deleteWorkday = async (workdayId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.delete(API_URL + workdayId, config)
    return response.data
}
