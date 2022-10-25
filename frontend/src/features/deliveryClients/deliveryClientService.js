import axios from "axios";

const API_URL = "/api/delivery-clients/";

// Get all delivery clients
const getDeliveryClients = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Create delivery client
const createDeliveryClient = async (deliveryClientData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, deliveryClientData, config);
  return response.data;
};

// Update delivery client
const updateDeliveryClient = async (deliveryClientData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    API_URL + deliveryClientData._id,
    deliveryClientData,
    config
  );
  return response.data;
};

// Delete delivery client
const deleteDeliveryClient = async (deliveryClientId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + deliveryClientId, config);
  return response.data;
};

const deliveryClientService = {
  getDeliveryClients,
  createDeliveryClient,
  updateDeliveryClient,
  deleteDeliveryClient,
};

export default deliveryClientService;
