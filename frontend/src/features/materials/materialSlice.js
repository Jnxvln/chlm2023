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

export const materialSlice = createSlice({
  name: "materials",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActiveMaterials.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActiveMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.materials = action.payload;
      })
      .addCase(getActiveMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // state.materials = []
      });
  },
});

export const { reset } = materialSlice.actions;
export default materialSlice.reducer;
