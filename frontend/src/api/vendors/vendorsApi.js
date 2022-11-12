import axios from 'axios'

const API_URL = '/api/vendors/'

// Get all vendors
export const getVendors = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get(API_URL, config)
    return response.data
}

// Create vendor
export const createVendor = async (formData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.post(API_URL, formData, config)
    return response.data
}

// Update vendor
export const updateVendor = async (formData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.put(
        API_URL + `${formData._id}`,
        formData,
        config
    )
    return response.data
}

// Delete vendor
export const deleteVendor = async (vendorId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.delete(API_URL + vendorId, config)
    return response.data
}
