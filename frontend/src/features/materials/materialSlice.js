import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import materialService from "./materialService";

const initialState = {
  materials: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
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
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // GET ACTIVE MATERIALS
      .addCase(getActiveMaterials.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActiveMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = null;
        state.materials = action.payload;
      })
      .addCase(getActiveMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // state.materials = []
      })
      // CREATE MATERIAL
      .addCase(createMaterial.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMaterial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Material created";
        state.materials.push(action.payload);
      })
      .addCase(createMaterial.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // UPDATE MATERIAL
      .addCase(updateMaterial.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMaterial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Material updated!";
        const index = state.materials.indexOf(action.payload._id);
        state.materials.splice(index, 1, action.payload);
      })
      .addCase(updateMaterial.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // DELETE MATERIAL
      .addCase(deleteMaterial.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Material deleted successfully";
        const index = state.materials.indexOf(action.payload);
        state.materials.splice(index, 1);
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = materialSlice.actions;
export default materialSlice.reducer;
