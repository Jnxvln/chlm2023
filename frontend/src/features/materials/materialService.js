import axios from "axios";

const API_URL = "/api/materials/";

// Get Active Materials
const getActiveMaterials = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create material
const createMaterial = async (materialData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, materialData, config);
  return response.data;
};

// Update material
const updateMaterial = async (materialData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    API_URL + `${materialData._id}`,
    {
      name: materialData.name,
      category: materialData.category,
      image: materialData.image,
      binNumber: materialData.binNumber,
      size: materialData.size,
      stock: materialData.stock,
      notes: materialData.notes,
      description: materialData.description,
      isFeatured: materialData.isFeatured,
      isActive: materialData.isActive,
      isTruckable: materialData.isTruckable,
    },
    config
  );
  return response.data;
};

// Delete material
const deleteMaterial = async (materialID, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + materialID, config);
  return response.data;
};

const materialService = {
  getActiveMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};

export default materialService;
