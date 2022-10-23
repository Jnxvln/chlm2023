import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import deliveryClientService from "./deliveryClientService";

const initialState = {
  deliveryClients: [],
  deliveryClientsLoading: false,
  deliveryClientsError: false,
  deliveryClientsSuccess: false,
  deliveryClientsMessage: false,
};

// ASYNC ACTIONS

// Get delivery clients
export const getDeliveryClients = createAsyncThunk(
  "deliveryClients/getDeliveryClients",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await deliveryClientService.getDeliveryClients(token);
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

// Create delivery client
export const createDeliveryClient = createAsyncThunk(
  "deliveryClients/createDeliveryClient",
  async (deliveryClientData, token) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await deliveryClientService.createDeliveryClient(
        deliveryClientData,
        token
      );
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

// Update delivery client
export const updateDeliveryClient = createAsyncThunk(
  "deliveryClients/updateDeliveryClient",
  async (deliveryClientData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await deliveryClientService.updateDeliveryClient(
        deliveryClientData,
        token
      );
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

// Delete delivery client
export const deleteDeliveryClient = createAsyncThunk(
  "deliveryClients/deleteDeliveryClient",
  async (deliveryClientId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await deliveryClientService.deleteDeliveryClient(
        deliveryClientId,
        token
      );
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
export const deliveryClientSlice = createSlice({
  name: "deliveryClients",
  initialState,
  reducers: {
    resetDeliveryClientState: (state) => initialState,
    resetDeliveryClientMessages: (state) => ({
      ...state,
      deliveryClientsLoading: false,
      deliveryClientsError: false,
      deliveryClientsSuccess: false,
      deliveryClientsMessage: false,
    }),
  },
  extraReducers: (builder) => {
    builder
      // GET DELIVERY CLIENTS
      .addCase(getDeliveryClients.pending, (state) => {
        state.deliveryClientsLoading = true;
      })
      .addCase(getDeliveryClients.fulfilled, (state, actions) => {
        state.deliveryClientsLoading = false;
        state.deliveryClientsSuccess = true;
        state.deliveryClientsMessage = "";
        state.deliveryClients = actions.payload;
      })
      .addCase(getDeliveryClients.rejected, (state, actions) => {
        state.deliveryClientsLoading = false;
        state.deliveryClientsError = true;
        state.deliveryClientsMessage = actions.payload;
      })
      // CREATE DELIVERY CLIENT
      .addCase(createDeliveryClient.pending, (state) => {
        state.deliveryClientsLoading = true;
      })
      .addCase(createDeliveryClient.fulfilled, (state, actions) => {
        state.deliveryClientsLoading = false;
        state.deliveryClientsSuccess = true;
        state.deliveryClientsMessage = "Delivery client created";
        // Add delivery client to state
        state.deliveryClients.push(actions.payload);
      })
      .addCase(createDeliveryClient.rejected, (state, actions) => {
        state.deliveryClientsLoading = false;
        state.deliveryClientsError = true;
        state.deliveryClientsMessage = actions.payload;
      })
      // UPDATE DELIVERY CLIENT
      .addCase(updateDeliveryClient.pending, (state) => {
        state.deliveryClientsLoading = true;
      })
      .addCase(updateDeliveryClient.fulfilled, (state, actions) => {
        state.deliveryClientsLoading = false;
        state.deliveryClientsSuccess = true;
        state.deliveryClientsMessage = "Delivery client updated";

        // Update delivery client in state
        const index = state.deliveryClients
          .map((client) => client._id)
          .indexOf(actions.payload._id);
        state.deliveryClients.splice(index, 1, actions.payload);
      })
      .addCase(updateDeliveryClient.rejected, (state, actions) => {
        state.deliveryClientsLoading = false;
        state.deliveryClientsError = true;
        state.deliveryClientsMessage = actions.payload;
      })
      // DELETE DELIVERY CLIENT
      .addCase(deleteDeliveryClient.pending, (state) => {
        state.deliveryClientsLoading = true;
      })
      .addCase(deleteDeliveryClient.fulfilled, (state, actions) => {
        state.deliveryClientsLoading = false;
        state.deliveryClientsSuccess = true;
        state.deliveryClientsMessage = "Delivery client deleted";

        // Remove delivery client from state
        const index = state.deliveryClients
          .map((client) => client._id)
          .indexOf(actions.payload._id);
        state.deliveryClients.splice(index, 1);
      })
      .addCase(deleteDeliveryClient.rejected, (state, actions) => {
        state.deliveryClientsLoading = false;
        state.deliveryClientsError = true;
        state.deliveryClientsMessage = actions.payload;
      });
  },
});

export const { resetDeliveryClientState, resetDeliveryClientMessages } =
  deliveryClientSlice.actions;
export default deliveryClientSlice.reducer;
