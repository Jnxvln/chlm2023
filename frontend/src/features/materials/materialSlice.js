import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {
  materials: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: ""
}

export const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {
    reset: (state) => initialState
  },
  extraReducers: () => {}
})

export const { reset } = materialSlice.actions
export default materialSlice.reducer