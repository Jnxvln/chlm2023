import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import HaulsDashboard from "./HaulsDashboard";
import DeliveriesDashboard from "./DeliveriesDashboard";
import FreightRoutesDashboard from "./FreightRoutesDashboard";
import VendorsDashboard from "./VendorsDashboard";
import MaterialsDashboard from "./MaterialsDashboard";
import CarportsDashboard from "./CarportsDashboard";
import DriversDashboard from "./DriversDashboard";

function Dashboard() {
  const navigate = useNavigate();

  const [tabsActiveIndex, setTabsActiveIndex] = useState(0);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <section style={{ padding: "2em" }}>
      <h1>Dashboard</h1>
      <h4>Welcome, {user && user.firstName}</h4>

      <TabView activeIndex={tabsActiveIndex} onTabChange={(e) => setTabsActiveIndex(e.index)}>
        <TabPanel header="Hauls">
          <HaulsDashboard />
        </TabPanel>
        <TabPanel header="Deliveries">
          <DeliveriesDashboard />
        </TabPanel>
        <TabPanel header="Freight Routes">
          <FreightRoutesDashboard />
        </TabPanel>
        <TabPanel header="Vendors">
          <VendorsDashboard />
        </TabPanel>
        <TabPanel header="Materials">
          <MaterialsDashboard />
        </TabPanel>
        <TabPanel header="Carports">
          <CarportsDashboard />
        </TabPanel>
        <TabPanel header="Drivers">
          <DriversDashboard />
        </TabPanel>
      </TabView>
    </section>
  );
}

export default Dashboard;
