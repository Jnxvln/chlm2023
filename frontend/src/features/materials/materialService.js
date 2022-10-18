import axios from "axios";

const API_URL = "/api/materials/";

// Get Active Materials
const getActiveMaterials = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};

const materialService = {
  getActiveMaterials,
};

export default materialService;
