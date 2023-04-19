import axios from 'axios'

const API_URL = '/api/waitlist/'

// Get all entries
export const getEntries = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get(API_URL, config)
    return response.data
}

// Get entry by ID
export const getEntryById = async (entryId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get(API_URL + entryId, config)
    return response.data
}

// Create entry
export const createEntry = async (entryData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.post(API_URL, entryData, config)
    return response.data
}

// Update entry
export const updateEntry = async (entryData, token) => {
    console.log('[waitList.api] Attempting to update entry: ')
    console.log(entryData)

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.put(
        API_URL + `${entryData.id}`,
        entryData,
        config
    )
    return response.data
}

// Delete entry
export const deleteEntry = async (entryId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.delete(API_URL + entryId, config)
    return response.data
}
