import axios from "axios";

const API_URL = "/api/users/";

// Register user
export const register = async (userData) => {
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
export const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);

  // Add user to localStorage
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Log user out
export const logout = async () => {
  localStorage.removeItem("user");
};

// const authService = {
//   register,
//   logout,
//   login,
// };

// export default authService;
