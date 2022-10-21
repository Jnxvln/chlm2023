import axios from "axios";

const API_URL = "/api/drivers/";

// Get all drivers
const getDrivers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Create driver
const createDriver = async (driverData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, driverData, config);
  return response.data;
};

// Update driver
const updateDriver = async (driverData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + `${driverData._id}`, driverData, config);
  return response.data;
};

// Delete driver
const deleteDriver = async (driverId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + driverId, config);
  return response.data;
};

const driverService = {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
};

export default driverService;
