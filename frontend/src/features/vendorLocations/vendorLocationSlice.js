import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import vendorLocationService from "./vendorLocationService";

const initialState = {
  vendorLocations: [],
  vendorLocationsLoading: false,
  vendorLocationsError: false,
  vendorLocationsSuccess: false,
  vendorLocationsMessage: "",
};

// ASYNC ACTIONS

// Get all vendor locations
export const getVendorLocations = createAsyncThunk(
  "vendors/getVendorLocations",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await vendorLocationService.getVendorLocations(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create vendor location
export const createVendorLocation = createAsyncThunk(
  "vendors/createVendorLocation",
  async (vendorLocationData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await vendorLocationService.createVendorLocation(vendorLocationData, token);
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
export const updateVendorLocation = createAsyncThunk(
  "vendors/updateVendorLocation",
  async (vendorLocationData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await vendorLocationService.updateVendorLocation(vendorLocationData, token);
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
export const deleteVendorLocation = createAsyncThunk(
  "vendors/deleteVendorLocation",
  async (vendorLocationId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await vendorLocationService.deleteVendorLocation(vendorLocationId, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const vendorLocationSlice = createSlice({
  name: "vendorLocations",
  initialState,
  reducers: {
    resetVendorLocationState: (state) => initialState,
    resetVendorLocationMessages: (state) => ({
      ...state,
      vendorLocationsLoading: false,
      vendorLocationsError: false,
      vendorLocationsSuccess: false,
      vendorLocationsMessage: "",
    }),
  },
  extraReducers: (builder) => {
    builder
      // GET VENDOR LOCATIONS
      .addCase(getVendorLocations.pending, (state) => {
        state.vendorLocationsLoading = true;
      })
      .addCase(getVendorLocations.fulfilled, (state, action) => {
        state.vendorLocationsLoading = false;
        state.vendorLocationsSuccess = true;
        state.vendorLocationsMessage = null;
        state.vendorLocations = action.payload;
      })
      .addCase(getVendorLocations.rejected, (state, action) => {
        state.vendorLocationsLoading = false;
        state.vendorLocationsError = true;
        state.vendorLocationsMessage = action.payload;
      })
      // CREATE VENDOR LOCATION
      .addCase(createVendorLocation.pending, (state) => {
        state.vendorLocationsLoading = true;
      })
      .addCase(createVendorLocation.fulfilled, (state, action) => {
        state.vendorLocationsLoading = false;
        state.vendorLocationsSuccess = true;
        state.vendorLocationsMessage = "Vendor location created";
        state.vendorLocations.push(action.payload);
      })
      .addCase(createVendorLocation.rejected, (state, action) => {
        state.vendorLocationsLoading = false;
        state.vendorLocationsError = true;
        state.vendorLocationsMessage = action.payload;
      })
      // UPDATE VENDOR LOCATION
      .addCase(updateVendorLocation.pending, (state) => {
        state.vendorLocationsLoading = true;
      })
      .addCase(updateVendorLocation.fulfilled, (state, action) => {
        state.vendorLocationsLoading = false;
        state.vendorLocationsSuccess = true;
        state.vendorLocationsMessage = "Vendor location updated";
        const index = state.vendorLocations
          .map((location) => location._id)
          .indexOf(action.payload._id);
        state.vendorLocations.splice(index, 1, action.payload);
      })
      .addCase(updateVendorLocation.rejected, (state, action) => {
        state.vendorLocationsLoading = false;
        state.vendorLocationsError = true;
        state.vendorLocationsMessage = action.payload;
      })
      // DELETE VENDOR LOCATION
      .addCase(deleteVendorLocation.pending, (state) => {
        state.vendorLocationsLoading = true;
      })
      .addCase(deleteVendorLocation.fulfilled, (state, action) => {
        state.vendorLocationsLoading = false;
        state.vendorLocationsSuccess = true;
        state.vendorLocationsMessage = "Vendor location deleted";
        const index = state.vendorLocations.indexOf(action.payload);
        state.vendorLocations.splice(index, 1);
      })
      .addCase(deleteVendorLocation.rejected, (state, action) => {
        state.vendorLocationsLoading = false;
        state.vendorLocationsError = true;
        state.vendorLocationsMessage = action.payload;
      });
  },
});

export const { resetVendorLocationState, resetVendorLocationMessages } =
  vendorLocationSlice.actions;
export default vendorLocationSlice.reducer;
