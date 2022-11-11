import axios from "axios";

const API_URL = "/api/vendor-locations/";

// Get all vendor locations
export const getVendorLocations = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Create vendor location
export const createVendorLocation = async (vendorLocationData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, vendorLocationData, config);
  return response.data;
};

// Update vendor location
export const updateVendorLocation = async (vendorLocationData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    API_URL + `${vendorLocationData._id}`,
    vendorLocationData,
    config
  );
  return response.data;
};

// Delete vendor location
export const deleteVendorLocation = async (vendorLocationId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + vendorLocationId, config);
  return response.data;
};
