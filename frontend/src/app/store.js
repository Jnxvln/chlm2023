import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import materialReducer from "../features/materials/materialSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    materials: materialReducer,
  },
});
