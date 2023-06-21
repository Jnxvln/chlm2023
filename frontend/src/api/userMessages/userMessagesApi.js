import axios from 'axios'

const API_URL = '/api/usermessages/'

// Get all user messages
export const getUserMessages = async (token) => {
   const config = {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   }
   const response = await axios.get(API_URL, config)
   return response.data
}

// Get user messages by User ID
export const getUserMessagesByUserId = async (userId, token) => {
   const config = {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   }

   const response = await axios.get(API_URL + 'user/' + userId, config)
   return response.data
}

// Create user message
export const createUserMessage = async (userMessageData, token) => {
   const config = {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   }

   const response = await axios.post(API_URL, userMessageData, config)
   return response.data
}

// Update user message
export const updateUserMessage = async (userMessageData, token) => {
   const config = {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   }

   const response = await axios.put(
      API_URL + `${userMessageData._id}`,
      userMessageData,
      config
   )
   return response.data
}

// Delete user message
export const deleteUserMessage = async (messageId, userId, token) => {
   const config = {
      headers: {
         Authorization: `Bearer ${token}`,
      },
      data: {
         messageId,
         userId,
      },
   }

   const response = await axios.delete(API_URL + messageId, config)
   return response.data
}
