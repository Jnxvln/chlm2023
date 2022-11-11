import React, { useState } from "react";
import { toast } from "react-toastify";
import VendorDataTable from "../../../components/user/dashboard/vendors/VendorDataTable";
import VendorLocationDataTable from "../../../components/user/dashboard/vendors/VendorLocationDataTable";
import VendorProductDataTable from "../../../components/user/dashboard/vendors/VendorProductDataTable";
import FreightRouteDataTable from "../../../components/user/dashboard/vendors/FreightRouteDataTable";
// PrimeReact Components
import { TabView, TabPanel } from "primereact/tabview";
// Store data
import { useQuery } from "@tanstack/react-query";
import { getVendors } from "../../../api/vendors/vendorsApi";
import { getVendorProducts } from "../../../api/vendorProducts/vendorProductsApi";
import { getFreightRoutes } from "../../../api/freightRoutes/freightRoutesApi";
import { getVendorLocations } from "../../../api/vendorLocations/vendorLocationsApi";

function VendorsDashboard() {
  // #region VARS ------------------------
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const user = useQuery(["user"], JSON.parse(localStorage.getItem("user")));

  const vendors = useQuery({
    queryKey: ["vendors"],
    queryFn: () => getVendors(user.data.token),
    onError: (err) => {
      console.log("Error fetching vendors: ");
      console.log(err);
      toast.error("Error fetching vendors", { autoClose: false });
    },
  });

  const vendorProducts = useQuery({
    queryKey: ["vendorProducts"],
    queryFn: () => getVendorProducts(user.data.token),
    onError: (err) => {
      console.log("Error fetching vendor products: ");
      console.log(err);
      toast.error("Error fetching vendor products", { autoClose: false });
    },
  });

  const freightRoutes = useQuery({
    queryKey: ["freightRoutes"],
    queryFn: () => getFreightRoutes(user.data.token),
    onError: (err) => {
      console.log("Error fetching freight routes: ");
      console.log(err);
      toast.error("Error fetching freight routes", { autoClose: false });
    },
  });

  const vendorLocations = useQuery({
    queryKey: ["vendorLocations"],
    queryFn: () => getVendorLocations(user.data.token),
    onError: (err) => {
      console.log("Error fetching vendor locations: ");
      console.log(err);
      toast.error("Error fetching vendor locations", { autoClose: false });
    },
  });

  return (
    <section>
      <h1 style={{ textAlign: "center", fontSize: "20pt" }}>C&H Vendors</h1>

      <TabView activeIndex={activeTabIndex} onTabChange={(e) => setActiveTabIndex(e.index)}>
        <TabPanel header="Vendors">
          <VendorDataTable
            vendors={vendors.data}
            vendorLocations={vendorLocations.data}
            vendorsLoading={vendors.isLoading}
          />
        </TabPanel>
        <TabPanel header="Locations">
          <VendorLocationDataTable
            vendors={vendors.data}
            vendorLocations={vendorLocations.data}
            vendorLocationsLoading={vendorLocations.isLoading}
          />
        </TabPanel>
        <TabPanel header="Products">
          <VendorProductDataTable
            vendors={vendors.data}
            vendorLocations={vendorLocations.data}
            vendorProducts={vendorProducts.data}
            vendorProductsLoading={vendorProducts.isLoading}
          />
        </TabPanel>
        <TabPanel header="Routes">
          <FreightRouteDataTable
            vendors={vendors.data}
            vendorLocations={vendorLocations.data}
            freightRoutes={freightRoutes}
            freightRoutesLoading={freightRoutes.isLoading}
          />
        </TabPanel>
      </TabView>
    </section>
  );
}

export default VendorsDashboard;
