import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import driverService from "./driverService";

const initialState = {
  drivers: [],
  driversLoading: false,
  driversError: false,
  driversSuccess: false,
  driversMessage: "",
};

// ASYNC ACTIONS

// Get all drivers
export const getDrivers = createAsyncThunk("drivers/getDrivers", async (_, thunkAPI) => {
  try {
    return await driverService.getDrivers();
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Create driver
export const createDriver = createAsyncThunk(
  "drivers/createDriver",
  async (driverData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await driverService.createDriver(driverData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update driver
export const updateDriver = createAsyncThunk(
  "drivers/updateDriver",
  async (driverData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await driverService.updateDriver(driverData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete driver
export const deleteDriver = createAsyncThunk("drivers/deleteDriver", async (driverID, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await driverService.deleteDriver(driverID, token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const driverSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    resetDriverState: (state) => initialState,
    resetDriverMessages: (state) => ({
      ...state,
      driversLoading: false,
      driversError: false,
      driversSuccess: false,
      driversMessage: "",
    }),
  },
  extraReducers: (builder) => {
    builder
      // GET DRIVERS
      .addCase(getDrivers.pending, (state) => {
        state.driversLoading = true;
      })
      .addCase(getDrivers.fulfilled, (state, action) => {
        state.driversLoading = false;
        state.driversSuccess = true;
        state.driversMessage = null;
        state.drivers = action.payload;
      })
      .addCase(getDrivers.rejected, (state, action) => {
        state.driversLoading = false;
        state.driversError = true;
        state.driversMessage = action.payload;
        // state.drivers = []
      })
      // CREATE DRIVER
      .addCase(createDriver.pending, (state) => {
        state.driversLoading = true;
      })
      .addCase(createDriver.fulfilled, (state, action) => {
        state.driversLoading = false;
        state.driversSuccess = true;
        state.driversMessage = "Driver created";
        state.drivers.push(action.payload);
      })
      .addCase(createDriver.rejected, (state, action) => {
        state.driversLoading = false;
        state.driversError = true;
        state.driversMessage = action.payload;
      })
      // UPDATE DRIVER
      .addCase(updateDriver.pending, (state) => {
        state.driversLoading = true;
      })
      .addCase(updateDriver.fulfilled, (state, action) => {
        state.driversLoading = false;
        state.driversSuccess = true;
        state.driversMessage = "Driver updated";
        const index = state.drivers.indexOf(action.payload._id);
        state.drivers.splice(index, 1, action.payload);
      })
      .addCase(updateDriver.rejected, (state, action) => {
        state.driversLoading = false;
        state.driversError = true;
        state.driversMessage = action.payload;
      })
      // DELETE DRIVER
      .addCase(deleteDriver.pending, (state) => {
        state.driversLoading = true;
      })
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.driversLoading = false;
        state.driversSuccess = true;
        state.driversMessage = "Driver deleted";
        const index = state.drivers.indexOf(action.payload);
        state.drivers.splice(index, 1);
      })
      .addCase(deleteDriver.rejected, (state, action) => {
        state.driversLoading = false;
        state.driversError = true;
        state.driversMessage = action.payload;
      });
  },
});

export const { resetDriverState, resetDriverMessages } = driverSlice.actions;
export default driverSlice.reducer;
