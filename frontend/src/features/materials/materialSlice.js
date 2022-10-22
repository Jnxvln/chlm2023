import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import materialService from "./materialService";

const initialState = {
  materials: [],
  materialsLoading: false,
  materialsError: false,
  materialsSuccess: false,
  materialsMessage: "",
};

// ASYNC ACTIONS
export const getActiveMaterials = createAsyncThunk(
  "materials/activeMaterials",
  async (_, thunkAPI) => {
    try {
      return await materialService.getActiveMaterials();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create material
export const createMaterial = createAsyncThunk(
  "materials/createMaterial",
  async (materialData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await materialService.createMaterial(materialData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update material
export const updateMaterial = createAsyncThunk(
  "materials/updateMaterial",
  async (materialData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await materialService.updateMaterial(materialData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete material
export const deleteMaterial = createAsyncThunk(
  "materials/deleteMaterial",
  async (materialID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await materialService.deleteMaterial(materialID, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const materialSlice = createSlice({
  name: "materials",
  initialState,
  reducers: {
    resetMaterialState: (state) => initialState,
    resetMaterialMessages: (state) => ({
      ...state,
      materialsLoading: false,
      materialsError: false,
      materialsSuccess: false,
      materialsMessage: "",
    }),
  },
  extraReducers: (builder) => {
    builder
      // GET ACTIVE MATERIALS
      .addCase(getActiveMaterials.pending, (state) => {
        state.materialsLoading = true;
      })
      .addCase(getActiveMaterials.fulfilled, (state, action) => {
        state.materialsLoading = false;
        state.materialsSuccess = true;
        state.materialsMessage = null;
        state.materials = action.payload;
      })
      .addCase(getActiveMaterials.rejected, (state, action) => {
        state.materialsLoading = false;
        state.materialsError = true;
        state.materialsMessage = action.payload;
        // state.materials = []
      })
      // CREATE MATERIAL
      .addCase(createMaterial.pending, (state) => {
        state.materialsLoading = true;
      })
      .addCase(createMaterial.fulfilled, (state, action) => {
        state.materialsLoading = false;
        state.materialsSuccess = true;
        state.materialsMessage = "Material created";
        state.materials.push(action.payload);
      })
      .addCase(createMaterial.rejected, (state, action) => {
        state.materialsLoading = false;
        state.materialsError = true;
        state.materialsMessage = action.payload;
      })
      // UPDATE MATERIAL
      .addCase(updateMaterial.pending, (state) => {
        state.materialsLoading = true;
      })
      .addCase(updateMaterial.fulfilled, (state, action) => {
        state.materialsLoading = false;
        state.materialsSuccess = true;
        state.materialsMessage = "Material updated!";
        const index = state.materials
          .map((material) => material._id)
          .indexOf(action.payload._id);
        state.materials.splice(index, 1, action.payload);
      })
      .addCase(updateMaterial.rejected, (state, action) => {
        state.materialsLoading = false;
        state.materialsError = true;
        state.materialsMessage = action.payload;
      })
      // DELETE MATERIAL
      .addCase(deleteMaterial.pending, (state) => {
        state.materialsLoading = true;
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.materialsLoading = false;
        state.materialsSuccess = true;
        state.materialsMessage = "Material deleted successfully";
        const index = state.materials.indexOf(action.payload);
        state.materials.splice(index, 1);
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.materialsLoading = false;
        state.materialsError = true;
        state.materialsMessage = action.payload;
      });
  },
});

export const { resetMaterialState, resetMaterialMessages } =
  materialSlice.actions;
export default materialSlice.reducer;
