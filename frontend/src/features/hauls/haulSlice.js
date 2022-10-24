import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import haulService from './haulService'

const initialState = {
    hauls: [],
    haulsLoading: false,
    haulsError: false,
    haulsSuccess: false,
    haulsMessage: ""
}

// ASYNC ACTIONS 

// Get hauls
export const getHauls = createAsyncThunk('hauls/getHauls', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await haulService.getHauls(token)
    } catch (error) {
        const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
})

// Create haul
export const createHaul = createAsyncThunk('hauls/createHaul', async (haulData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await haulService.createHaul(haulData, token)
    } catch (error) {
        const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
})

// Update haul
export const updateHaul = createAsyncThunk('hauls/updateHaul', async (haulData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await haulService.updateHaul(haulData, token)
    } catch (error) {
        const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
})

// Delete haul
export const deleteHaul = createAsyncThunk('hauls/deleteHaul', async (haulId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await haulService.deleteHaul(haulId, token)
    } catch (error) {
        const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
})

// CREAT SLICE
export const haulSlice = createSlice({
    name: 'hauls',
    initialState,
    reducers: {
        resetHaulState: (state) => initialState,
        resetHaulMessages: (state) => ({
            ...state,
            haulsLoading: false,
            haulsError: false,
            haulsSuccess: false,
            haulsMessage: ""
        })
    },
    extraReducers: (builder) => {
        builder
            // GET HAULS
            .addCase(getHauls.pending, (state) => {
                state.haulsLoading = true
            })
            .addCase(getHauls.fulfilled, (state, actions) => {
                state.haulsLoading = false
                state.haulsSuccess = true
                state.haulsMessage = null
                state.hauls = actions.payload
            })
            .addCase(getHauls.rejected, (state, actions) => {
                state.haulsLoading = false
                state.haulsError = true
                state.haulsMessage = actions.payload
            })
            // CREATE HAUL
            .addCase(createHaul.pending, (state) => {
                state.haulsLoading = true
            })
            .addCase(createHaul.fulfilled, (state, actions) => {
                state.haulsLoading = false
                state.haulsSuccess = true
                state.haulsMessage = "Haul created"
                state.hauls.push(actions.payload)
            })
            .addCase(createHaul.rejected, (state, actions) => {
                state.haulsLoading = false
                state.haulsError = true
                state.haulsMessage = actions.payload
            })
            // UPDATE HAUL
            .addCase(updateHaul.pending, (state) => {
                state.haulsLoading = true
            })
            .addCase(updateHaul.fulfilled, (state, actions) => {
                state.haulsLoading = false
                state.haulsSuccess = true
                state.haulsMessage = "Haul updated"
                // Update haul in state
                const index = state.hauls.map(haul => haul._id).indexOf(actions.payload._id)
                state.hauls.splice(index, 1, actions.payload)
            })
            .addCase(updateHaul.rejected, (state, actions) => {
                state.haulsLoading = false
                state.haulsError = true
                state.haulsMessage = actions.payload
            })
            // DELETE HAUL
            .addCase(deleteHaul.pending, (state) => {
                state.haulsLoading = true
            })
            .addCase(deleteHaul.fulfilled, (state, actions) => {
                state.haulsLoading = false
                state.haulsSuccess = true
                state.haulsMessage = "Haul deleted"
                // Update haul in state
                const index = state.hauls.map(haul => haul._id).indexOf(actions.payload._id)
                state.hauls.splice(index, 1)
            })
            .addCase(deleteHaul.rejected, (state, actions) => {
                state.haulsLoading = false
                state.haulsError = true
                state.haulsMessage = actions.payload
            })
    }
})

export const { resetHaulState, resetHaulMessages } = haulSlice.actions
export default haulSlice.reducer