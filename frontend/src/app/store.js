import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import materialReducer from "../features/materials/materialSlice";
import materialCategoryReducer from "../features/materialCategory/materialCategorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    materials: materialReducer,
    materialCategories: materialCategoryReducer,
  },
});
