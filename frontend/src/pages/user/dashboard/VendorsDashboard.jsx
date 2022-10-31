import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import VendorDataTable from "../../../components/user/dashboard/vendors/VendorDataTable";
import VendorProductDataTable from "../../../components/user/dashboard/vendors/VendorProductDataTable";
import FreightRouteDataTable from "../../../components/user/dashboard/vendors/FreightRouteDataTable";
// PrimeReact Components
import { TabView, TabPanel } from "primereact/tabview";
// Store data
import { useSelector, useDispatch } from "react-redux";
import { getVendors, resetVendorMessages } from "../../../features/vendors/vendorSlice";
import {
  getVendorProducts,
  resetVendorProductMessages,
} from "../../../features/vendorProducts/vendorProductSlice";
import {
  getFreightRoutes,
  resetFreightRouteMessages,
} from "../../../features/freightRoutes/freightRouteSlice";

function VendorsDashboard() {
  // #region VARS ------------------------
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const dispatch = useDispatch();

  // Select Vendors from store slice
  const { vendors, vendorsLoading, vendorsError, vendorsSuccess, vendorsMessage } = useSelector(
    (state) => state.vendors
  );

  // Select Vendor Products from store slice
  const {
    vendorProducts,
    vendorProductsLoading,
    vendorProductsError,
    vendorProductsSuccess,
    vendorProductsMessage,
  } = useSelector((state) => state.vendorProducts);

  // Select Freight Routes store slice
  const {
    freightRoutes,
    freightRoutesLoading,
    freightRoutesError,
    freightRoutesSuccess,
    freightRoutesMessage,
  } = useSelector((state) => state.freightRoutes);
  // #endregion

  useEffect(() => {
    // VENDORS
    if (vendors.length === 0) {
      dispatch(getVendors());
    }

    if (vendorsError && vendorsMessage && vendorsMessage.length > 0) {
      toast.error(vendorsMessage);
    }

    if (vendorsSuccess && vendorsMessage && vendorsMessage.length > 0) {
      toast.success(vendorsMessage);
    }

    // VENDOR PRODUCTS
    if (vendorProducts.length === 0) {
      dispatch(getVendorProducts());
    }

    if (vendorProductsError && vendorProductsMessage && vendorProductsMessage.length > 0) {
      toast.error(vendorProductsMessage);
    }

    if (vendorProductsSuccess && vendorProductsMessage && vendorProductsMessage.length > 0) {
      toast.success(vendorProductsMessage);
    }

    // FREIGHT ROUTES
    if (freightRoutes.length === 0) {
      dispatch(getFreightRoutes());
    }

    if (freightRoutesError && freightRoutesMessage && freightRoutesMessage.length > 0) {
      toast.error(freightRoutesMessage);
    }

    if (freightRoutesSuccess && freightRoutesMessage && freightRoutesMessage.length > 0) {
      toast.success(freightRoutesMessage);
    }

    dispatch(resetVendorMessages());
    dispatch(resetVendorProductMessages());
    dispatch(resetFreightRouteMessages());
  }, [
    vendors,
    vendorsError,
    vendorsSuccess,
    vendorsMessage,
    vendorProducts,
    vendorProductsError,
    vendorProductsSuccess,
    vendorProductsMessage,
    freightRoutes,
    freightRoutesError,
    freightRoutesSuccess,
    freightRoutesMessage,
    dispatch,
  ]);

  return (
    <section>
      <h1 style={{ textAlign: "center", fontSize: "20pt" }}>C&H Vendors</h1>

      <TabView activeIndex={activeTabIndex} onTabChange={(e) => setActiveTabIndex(e.index)}>
        <TabPanel header="Vendors">
          <VendorDataTable vendors={vendors} vendorsLoading={vendorsLoading} />
        </TabPanel>
        <TabPanel header="Products">
          <VendorProductDataTable
            vendors={vendors}
            vendorProducts={vendorProducts}
            vendorProductsLoading={vendorProductsLoading}
          />
        </TabPanel>
        <TabPanel header="Routes">
          <FreightRouteDataTable
            vendors={vendors}
            freightRoutes={freightRoutes}
            freightRoutesLoading={freightRoutesLoading}
          />
        </TabPanel>
      </TabView>
    </section>
  );
}

export default VendorsDashboard;
