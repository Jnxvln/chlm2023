import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import driverReducer from "../features/drivers/driverSlice";
import materialReducer from "../features/materials/materialSlice";
import materialCategoryReducer from "../features/materialCategory/materialCategorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    drivers: driverReducer,
    materials: materialReducer,
    materialCategories: materialCategoryReducer,
  },
});
