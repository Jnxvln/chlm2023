import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import vendorProductService from "./vendorProductService";

const initialState = {
  vendorProducts: [],
  vendorProductsLoading: false,
  vendorProductsError: false,
  vendorProductsSuccess: false,
  vendorProductsMessage: "",
};

// ASYNC ACTIONS

// Get all vendor products
export const getVendorProducts = createAsyncThunk("vendors/getVendorProducts", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await vendorProductService.getVendorProducts(token);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Create vendor product
export const createVendorProduct = createAsyncThunk("vendors/createVendorProduct", async (vendorProductData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await vendorProductService.createVendorProduct(vendorProductData, token);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Update vendor product
export const updateVendorProduct = createAsyncThunk("vendors/updateVendorProduct", async (vendorProductData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await vendorProductService.updateVendorProduct(vendorProductData, token);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Delete vendor product
export const deleteVendorProduct = createAsyncThunk("vendors/deleteVendorProduct", async (vendorProductId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await vendorProductService.deleteVendorProduct(vendorProductId, token);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const vendorProductSlice = createSlice({
  name: "vendorProducts",
  initialState,
  reducers: {
    resetVendorProductState: (state) => initialState,
    resetVendorProductMessages: (state) => ({
      ...state,
      vendorProductsLoading: false,
      vendorProductsError: false,
      vendorProductsSuccess: false,
      vendorProductsMessage: "",
    }),
  },
  extraReducers: (builder) => {
    builder
      // GET VENDOR PRODUCTS
      .addCase(getVendorProducts.pending, (state) => {
        state.vendorProductsLoading = true;
      })
      .addCase(getVendorProducts.fulfilled, (state, action) => {
        state.vendorProductsLoading = false;
        state.vendorProductsSuccess = true;
        state.vendorProductsMessage = null;
        state.vendorProducts = action.payload;
      })
      .addCase(getVendorProducts.rejected, (state, action) => {
        state.vendorProductsLoading = false;
        state.vendorProductsError = true;
        state.vendorProductsMessage = action.payload;
      })
      // CREATE VENDOR PRODUCT
      .addCase(createVendorProduct.pending, (state) => {
        state.vendorProductsLoading = true;
      })
      .addCase(createVendorProduct.fulfilled, (state, action) => {
        state.vendorProductsLoading = false;
        state.vendorProductsSuccess = true;
        state.vendorProductsMessage = "Vendor product created";
        state.vendorProducts.push(action.payload);
      })
      .addCase(createVendorProduct.rejected, (state, action) => {
        state.vendorProductsLoading = false;
        state.vendorProductsError = true;
        state.vendorProductsMessage = action.payload;
      })
      // UPDATE VENDOR PRODUCT
      .addCase(updateVendorProduct.pending, (state) => {
        state.vendorProductsLoading = true;
      })
      .addCase(updateVendorProduct.fulfilled, (state, action) => {
        state.vendorProductsLoading = false;
        state.vendorProductsSuccess = true;
        state.vendorProductsMessage = "Vendor updated";
        const index = state.vendorProducts.map((vendorProduct) => vendorProduct._id).indexOf(action.payload._id);
        state.vendorProducts.splice(index, 1, action.payload);
      })
      .addCase(updateVendorProduct.rejected, (state, action) => {
        state.vendorProductsLoading = false;
        state.vendorProductsError = true;
        state.vendorProductsMessage = action.payload;
      })
      // DELETE VENDOR PRODUCT
      .addCase(deleteVendorProduct.pending, (state) => {
        state.vendorProductsLoading = true;
      })
      .addCase(deleteVendorProduct.fulfilled, (state, action) => {
        state.vendorProductsLoading = false;
        state.vendorProductsSuccess = true;
        state.vendorProductsMessage = "Vendor product deleted";
        const index = state.vendorProducts.map((vendorProduct) => vendorProduct._id).indexOf(action.payload._id);
        state.vendorProducts.splice(index, 1);
      })
      .addCase(deleteVendorProduct.rejected, (state, action) => {
        state.vendorProductsLoading = false;
        state.vendorProductsError = true;
        state.vendorProductsMessage = action.payload;
      });
  },
});

export const { resetVendorProductState, resetVendorProductMessages } = vendorProductSlice.actions;
export default vendorProductSlice.reducer;
