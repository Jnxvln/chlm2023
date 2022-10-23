import axios from "axios";

const API_URL = "/api/deliveries/";

// Get all deliveries
const getDeliveries = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Create delivery
const createDelivery = async (deliveryData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, deliveryData, config);
  return response.data;
};

// Update delivery
const updateDelivery = async (deliveryData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    API_URL + deliveryData._id,
    deliveryData,
    config
  );
  return response.data;
};

// Delete delivery
const deleteDelivery = async (deliveryId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + deliveryId, config);
  return response.data;
};

const deliveryService = {
  getDeliveries,
  createDelivery,
  updateDelivery,
  deleteDelivery,
};

export default deliveryService;
