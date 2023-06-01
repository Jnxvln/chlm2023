import axios from 'axios'

const API_URL = '/api/settings/store/'

// Get store settings
export const getStoreSettings = async (token) => {
    // const config = {
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //     },
    // }
    const response = await axios.get(API_URL)
    return response.data
}

// Create store settings
export const createStoreSettings = async (storeSettingsData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.post(API_URL, storeSettingsData, config)
    return response.data
}

// Update store settings
export const updateStoreSettings = async (storeSettingsData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.put(
        API_URL + `${storeSettingsData._id}`,
        storeSettingsData,
        config
    )

    return response.data
}

// Delete store settings
export const deleteStoreSettings = async (storeSettingsID, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.delete(API_URL + storeSettingsID, config)
    return response.data
}

// Delete a site message by id
export const deleteSiteMessage = async (siteMessageId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.delete(
        API_URL + '/sitemessage/' + siteMessageId,
        config
    )
    return response.data
}
