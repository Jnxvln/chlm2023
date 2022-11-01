import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import driverReducer from "../features/drivers/driverSlice";
import vendorReducer from "../features/vendors/vendorSlice";
import vendorProductReducer from "../features/vendorProducts/vendorProductSlice";
import vendorLocationReducer from "../features/vendorLocations/vendorLocationSlice";
import freightRouteReducer from "../features/freightRoutes/freightRouteSlice";
import materialReducer from "../features/materials/materialSlice";
import materialCategoryReducer from "../features/materialCategory/materialCategorySlice";
import deliveryReducer from "../features/deliveries/deliverySlice";
import deliveryClientReducer from "../features/deliveryClients/deliveryClientSlice";
import haulReducer from "../features/hauls/haulSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    drivers: driverReducer,
    vendors: vendorReducer,
    vendorProducts: vendorProductReducer,
    vendorLocations: vendorLocationReducer,
    freightRoutes: freightRouteReducer,
    materials: materialReducer,
    materialCategories: materialCategoryReducer,
    deliveries: deliveryReducer,
    deliveryClients: deliveryClientReducer,
    hauls: haulReducer,
  },
});
