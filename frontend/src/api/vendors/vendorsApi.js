import axios from "axios";

const API_URL = "/api/vendors/";

// Get all vendors
export const getVendors = async (token) => {

  console.log('[vendorsApi getVendors()] token: ' + token)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Create vendor
export const createVendor = async (vendorData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, vendorData, config);
  return response.data;
};

// Update vendor
export const updateVendor = async (vendorData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + `${vendorData._id}`, vendorData, config);
  return response.data;
};

// Delete vendor
export const deleteVendor = async (vendorId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + vendorId, config);
  return response.data;
};
