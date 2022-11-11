import axios from "axios";

const API_URL = "/api/vendor-products/";

// Get all vendor products
export const getVendorProducts = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Create vendor product
export const createVendorProduct = async (vendorProductData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, vendorProductData, config);
  return response.data;
};

// Update vendor product
export const updateVendorProduct = async (vendorProductData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + `${vendorProductData._id}`, vendorProductData, config);
  return response.data;
};

// Delete vendor product
export const deleteVendorProduct = async (vendorProductId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + vendorProductId, config);
  return response.data;
};
