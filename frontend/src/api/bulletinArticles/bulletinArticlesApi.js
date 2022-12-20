import axios from 'axios'

const API_URL = '/api/bulletin/articles'

// Get all bulletin articles
export const getBulletinArticles = async () => {
    const response = await axios.get(API_URL)
    console.log(response.data)
    return response.data
}

// Get bulletin article by ID
export const getBulletinArticleById = async (articleId) => {
    const response = await axios.get(API_URL + articleId)
    return response.data
}

// Create bulletin article
export const createBulletinArticle = async (article, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.post(API_URL, article, config)
    return response.data
}

// Update bulletin article
export const updateBulletinArticle = async (article, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.put(
        API_URL + `${article._id}`,
        article,
        config
    )
    return response.data
}

// Delete bulletin article
export const deleteBulletinArticle = async (articleId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.delete(API_URL + articleId, config)
    return response.data
}
