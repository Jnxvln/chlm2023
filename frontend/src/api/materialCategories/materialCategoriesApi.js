import axios from "axios";

const API_URL = "/api/material-categories/";

// Get material categories
export const getMaterialCategories = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};
