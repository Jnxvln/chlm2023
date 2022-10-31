import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import freightRouteService from "./freightRouteService";

const initialState = {
  freightRoutes: [],
  freightRoutesLoading: false,
  freightRoutesError: false,
  freightRoutesSuccess: false,
  freightRoutesMessage: "",
};

// ASYNC ACTIONS

// Get all freight routes
export const getFreightRoutes = createAsyncThunk(
  "vendors/getFreightRoutes",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await freightRouteService.getFreightRoutes(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create freight route
export const createFreightRoute = createAsyncThunk(
  "vendors/createFreightRoute",
  async (freightRouteData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await freightRouteService.createFreightRoute(freightRouteData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update freight route
export const updateFreightRoute = createAsyncThunk(
  "vendors/updateFreightRoute",
  async (freightRouteData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await freightRouteService.updateFreightRoute(freightRouteData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete freight route
export const deleteFreightRoute = createAsyncThunk(
  "vendors/deleteFreightRoute",
  async (freightRouteId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await freightRouteService.deleteFreightRoute(freightRouteId, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const freightRouteSlice = createSlice({
  name: "freightRoutes",
  initialState,
  reducers: {
    resetFreightRouteState: (state) => initialState,
    resetFreightRouteMessages: (state) => ({
      ...state,
      freightRoutesLoading: false,
      freightRoutesError: false,
      freightRoutesSuccess: false,
      freightRoutesMessage: "",
    }),
  },
  extraReducers: (builder) => {
    builder
      // GET FREIGHT ROUTES
      .addCase(getFreightRoutes.pending, (state) => {
        state.freightRoutesLoading = true;
      })
      .addCase(getFreightRoutes.fulfilled, (state, action) => {
        state.freightRoutesLoading = false;
        state.freightRoutesSuccess = true;
        state.freightRoutesMessage = null;
        state.freightRoutes = action.payload;
      })
      .addCase(getFreightRoutes.rejected, (state, action) => {
        state.freightRoutesLoading = false;
        state.freightRoutesError = true;
        state.freightRoutesMessage = action.payload;
      })
      // CREATE FREIGHT ROUTE
      .addCase(createFreightRoute.pending, (state) => {
        state.freightRoutesLoading = true;
      })
      .addCase(createFreightRoute.fulfilled, (state, action) => {
        state.freightRoutesLoading = false;
        state.freightRoutesSuccess = true;
        state.freightRoutesMessage = "Freight route created";
        state.freightRoutes.push(action.payload);
      })
      .addCase(createFreightRoute.rejected, (state, action) => {
        state.freightRoutesLoading = false;
        state.freightRoutesError = true;
        state.freightRoutesMessage = action.payload;
      })
      // UPDATE FREIGHT ROUTE
      .addCase(updateFreightRoute.pending, (state) => {
        state.freightRoutesLoading = true;
      })
      .addCase(updateFreightRoute.fulfilled, (state, action) => {
        state.freightRoutesLoading = false;
        state.freightRoutesSuccess = true;
        state.freightRoutesMessage = "Freight route updated";
        const index = state.freightRoutes
          .map((freightRoute) => freightRoute._id)
          .indexOf(action.payload._id);
        state.freightRoutes.splice(index, 1, action.payload);
      })
      .addCase(updateFreightRoute.rejected, (state, action) => {
        state.freightRoutesLoading = false;
        state.freightRoutesError = true;
        state.freightRoutesMessage = action.payload;
      })
      // DELETE FREIGHT ROUTE
      .addCase(deleteFreightRoute.pending, (state) => {
        state.freightRoutesLoading = true;
      })
      .addCase(deleteFreightRoute.fulfilled, (state, action) => {
        state.freightRoutesLoading = false;
        state.freightRoutesSuccess = true;
        state.freightRoutesMessage = "Freight route deleted";
        const index = state.freightRoutes
          .map((freightRoute) => freightRoute._id)
          .indexOf(action.payload._id);
        state.freightRoutes.splice(index, 1);
      })
      .addCase(deleteFreightRoute.rejected, (state, action) => {
        state.freightRoutesLoading = false;
        state.freightRoutesError = true;
        state.freightRoutesMessage = action.payload;
      });
  },
});

export const { resetFreightRouteState, resetFreightRouteMessages } = freightRouteSlice.actions;
export default freightRouteSlice.reducer;
