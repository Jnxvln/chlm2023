import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import deliveryService from "./deliveryService";

const initialState = {
  deliveries: [],
  deliveriesLoading: false,
  deliveriesError: false,
  deliveriesSuccess: false,
  deliveriesMessage: "",
};

// ASYNC ACTIONS

// Get deliveries
export const getDeliveries = createAsyncThunk(
  "deliveries/getDeliveries",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await deliveryService.getDeliveries(token);
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

// Create delivery
export const createDelivery = createAsyncThunk(
  "deliveries/createDelivery",
  async (deliveryData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await deliveryService.createDelivery(deliveryData, token);
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

// Update delivery
export const updateDelivery = createAsyncThunk(
  "deliveries/updateDelivery",
  async (deliveryData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await deliveryService.updateDelivery(deliveryData, token);
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

// Delete delivery
export const deleteDelivery = createAsyncThunk(
  "deliveries/deleteDelivery",
  async (deliveryId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await deliveryService.deleteDelivery(deliveryId, token);
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

// CREATE SLICE
export const deliverySlice = createSlice({
  name: "deliveries",
  initialState,
  reducers: {
    resetDeliveryState: (state) => initialState,
    resetDeliveryMessages: (state) => ({
      ...state,
      deliveriesLoading: false,
      deliveriesError: false,
      deliveriesSuccess: false,
      deliveriesMessage: "",
    }),
  },
  extraReducers: (builder) => {
    builder
      // GET DELIVERIES
      .addCase(getDeliveries.pending, (state) => {
        state.deliveriesLoading = true;
      })
      .addCase(getDeliveries.fulfilled, (state, actions) => {
        state.deliveriesLoading = false;
        state.deliveriesSuccess = true;
        state.deliveriesMessage = "";
        state.deliveries = actions.payload;
      })
      .addCase(getDeliveries.rejected, (state, actions) => {
        state.deliveriesLoading = false;
        state.deliveriesError = true;
        state.deliveriesMessage = actions.payload;
      })
      // CREATE DELIVERY
      .addCase(createDelivery.pending, (state) => {
        state.deliveriesLoading = true;
      })
      .addCase(createDelivery.fulfilled, (state, actions) => {
        state.deliveriesLoading = false;
        state.deliveriesSuccess = true;
        state.deliveriesMessage = "Delivery created";

        // Add delivery to state
        state.deliveries.push(actions.payload);
      })
      .addCase(createDelivery.rejected, (state, actions) => {
        state.deliveriesLoading = false;
        state.deliveriesError = true;
        state.deliveriesMessage = actions.payload;
      })
      // UPDATE DELIVERY
      .addCase(updateDelivery.pending, (state) => {
        state.deliveriesLoading = true;
      })
      .addCase(updateDelivery.fulfilled, (state, actions) => {
        state.deliveriesLoading = false;
        state.deliveriesSuccess = true;
        state.deliveriesMessage = "Delivery updated";

        // Update delivery in state
        const index = state.deliveries
          .map((delivery) => delivery._id)
          .indexOf(actions.payload._id);
        state.deliveries.splice(index, 1, actions.payload);
      })
      .addCase(updateDelivery.rejected, (state, actions) => {
        state.deliveriesLoading = false;
        state.deliveriesError = true;
        state.deliveriesMessage = actions.payload;
      })
      // DELETE DELIVERY
      .addCase(deleteDelivery.pending, (state) => {
        state.deliveriesLoading = true;
      })
      .addCase(deleteDelivery.fulfilled, (state, actions) => {
        state.deliveriesLoading = false;
        state.deliveriesSuccess = true;
        state.deliveriesMessage = "Delivery deleted";

        // Remove delivery from state
        const index = state.deliveries
          .map((delivery) => delivery._id)
          .indexOf(actions.payload._id);
        state.deliveries.splice(index, 1);
      })
      .addCase(deleteDelivery.rejected, (state, actions) => {
        state.deliveriesLoading = false;
        state.deliveriesError = true;
        state.deliveriesMessage = actions.payload;
      });
  },
});

export const { resetDeliveryState, resetDeliveryMessages } =
  deliverySlice.actions;
export default deliverySlice.reducer;
