import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import materialCategoryService from "./materialCategoryService";

const initialState = {
  materialCategories: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// ASYNC ACTIONS
export const getMaterialCategories = createAsyncThunk(
  "materialCategories/getMaterialCategories",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    try {
      return await materialCategoryService.getMaterialCategories(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// CREATE SLICE
export const materialCategorySlice = createSlice({
  name: "materialCategories",
  initialState,
  reducers: {
    resetMaterialCategoryState: (state) => initialState,
    resetMaterialCategoryMessages: (state) => ({
      ...state,
      isLoading: false,
      isError: false,
      isSuccess: false,
      message: "",
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMaterialCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMaterialCategories.fulfilled, (state, actions) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.materialCategories = actions.payload;
      })
      .addCase(getMaterialCategories, (state, actions) => {
        state.isLoading = false;
        state.isError = true;
        state.message = actions.payload;
      });
  },
});

export const { resetMaterialCategoryState, resetMaterialCategoryMessages } =
  materialCategorySlice.actions;
export default materialCategorySlice.reducer;
