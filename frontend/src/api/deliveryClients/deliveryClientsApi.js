import axios from 'axios'

const API_URL = '/api/delivery-clients/'

// Get all delivery clients
export const getDeliveryClients = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get(API_URL, config)
    return response.data
}

// Get delivery client by id
export const getDeliveryClientById = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get(API_URL + `/${id}`, config)
    return response.data
}

// Create delivery client
export const createDeliveryClient = async (deliveryClientData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.post(API_URL, deliveryClientData, config)
    return response.data
}

// Update delivery client
export const updateDeliveryClient = async (deliveryClientData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.put(
        API_URL + deliveryClientData._id,
        deliveryClientData,
        config
    )
    return response.data
}

// Delete delivery client
export const deleteDeliveryClient = async (deliveryClientId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.delete(API_URL + deliveryClientId, config)
    return response.data
}
