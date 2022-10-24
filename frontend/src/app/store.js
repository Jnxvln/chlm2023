import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import driverReducer from "../features/drivers/driverSlice";
import vendorReducer from "../features/vendors/vendorSlice";
import materialReducer from "../features/materials/materialSlice";
import materialCategoryReducer from "../features/materialCategory/materialCategorySlice";
import haulReducer from "../features/hauls/haulSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    drivers: driverReducer,
    vendors: vendorReducer,
    materials: materialReducer,
    materialCategories: materialCategoryReducer,
    hauls: haulReducer
  },
});
