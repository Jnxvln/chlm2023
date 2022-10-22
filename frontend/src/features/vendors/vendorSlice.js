import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import vendorService from "./vendorService";

const initialState = {
  vendors: [],
  vendorsLoading: false,
  vendorsError: false,
  vendorsSuccess: false,
  vendorsMessage: "",
};

// ASYNC ACTIONS

// Get all vendors
export const getVendors = createAsyncThunk("vendors/getVendors", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await vendorService.getVendors(token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Create vendor
export const createVendor = createAsyncThunk(
  "vendors/createVendor",
  async (vendorData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await vendorService.createVendor(vendorData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update vendor
export const updateVendor = createAsyncThunk(
  "vendors/updateVendor",
  async (vendorData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await vendorService.updateVendor(vendorData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete vendor
export const deleteVendor = createAsyncThunk("vendors/deleteVendor", async (vendorID, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await vendorService.deleteVendor(vendorID, token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const vendorSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {
    resetVendorState: (state) => initialState,
    resetVendorMessages: (state) => ({
      ...state,
      vendorsLoading: false,
      vendorsError: false,
      vendorsSuccess: false,
      vendorsMessage: "",
    }),
  },
  extraReducers: (builder) => {
    builder
      // GET VENDORS
      .addCase(getVendors.pending, (state) => {
        state.vendorsLoading = true;
      })
      .addCase(getVendors.fulfilled, (state, action) => {
        state.vendorsLoading = false;
        state.vendorsSuccess = true;
        state.vendorsMessage = null;
        state.vendors = action.payload;
      })
      .addCase(getVendors.rejected, (state, action) => {
        state.vendorsLoading = false;
        state.vendorsError = true;
        state.vendorsMessage = action.payload;
      })
      // CREATE VENDOR
      .addCase(createVendor.pending, (state) => {
        state.vendorsLoading = true;
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.vendorsLoading = false;
        state.vendorsSuccess = true;
        state.vendorsMessage = "Vendor created";
        state.vendors.push(action.payload);
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.vendorsLoading = false;
        state.vendorsError = true;
        state.vendorsMessage = action.payload;
      })
      // UPDATE VENDOR
      .addCase(updateVendor.pending, (state) => {
        state.vendorsLoading = true;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.vendorsLoading = false;
        state.vendorsSuccess = true;
        state.vendorsMessage = "Vendor updated";
        const index = state.vendors.map((vendor) => vendor._id).indexOf(action.payload._id);
        state.vendors.splice(index, 1, action.payload);
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.vendorsLoading = false;
        state.vendorsError = true;
        state.vendorsMessage = action.payload;
      })
      // DELETE VENDOR
      .addCase(deleteVendor.pending, (state) => {
        state.vendorsLoading = true;
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.vendorsLoading = false;
        state.vendorsSuccess = true;
        state.vendorsMessage = "Vendor deleted";
        const index = state.vendors.indexOf(action.payload);
        state.vendors.splice(index, 1);
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.vendorsLoading = false;
        state.vendorsError = true;
        state.vendorsMessage = action.payload;
      });
  },
});

export const { resetVendorState, resetVendorMessages } = vendorSlice.actions;
export default vendorSlice.reducer;
