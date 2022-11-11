import axios from "axios";

const API_URL = "/api/freight-routes/";

// Get all freight routes
export const getFreightRoutes = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Create freight route
export const createFreightRoute = async (freightRouteData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, freightRouteData, config);
  return response.data;
};

// Update freight route
export const updateFreightRoute = async (freightRouteData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + `${freightRouteData._id}`, freightRouteData, config);
  return response.data;
};

// Delete freight route
export const deleteFreightRoute = async (freightRouteId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + freightRouteId, config);
  return response.data;
};
