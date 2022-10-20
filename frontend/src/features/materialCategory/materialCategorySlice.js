import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import materialCategoryService from "./materialCategoryService";

const initialState = {
  materialCategories: [],
  materialCategoriesLoading: false,
  materialCategoriesError: false,
  materialCategoriesSuccess: false,
  materialCategoriesMessage: "",
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
      materialCategoriesLoading: false,
      materialCategoriesError: false,
      materialCategoriesSuccess: false,
      materialCategoriesMessage: "",
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMaterialCategories.pending, (state) => {
        state.materialCategoriesLoading = true;
      })
      .addCase(getMaterialCategories.fulfilled, (state, actions) => {
        state.materialCategoriesLoading = false;
        state.materialCategoriesSuccess = true;
        state.materialCategories = actions.payload;
      })
      .addCase(getMaterialCategories, (state, actions) => {
        state.materialCategoriesLoading = false;
        state.materialCategoriesError = true;
        state.materialCategoriesMessage = actions.payload;
      });
  },
});

export const { resetMaterialCategoryState, resetMaterialCategoryMessages } =
  materialCategorySlice.actions;
export default materialCategorySlice.reducer;
