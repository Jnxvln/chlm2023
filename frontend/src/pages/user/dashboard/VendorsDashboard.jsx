import React, { useState } from 'react'
import VendorDataTable from '../../../components/user/dashboard/vendors/VendorDataTable'
import VendorLocationDataTable from '../../../components/user/dashboard/vendors/VendorLocationDataTable'
import VendorProductDataTable from '../../../components/user/dashboard/vendors/VendorProductDataTable'
import FreightRouteDataTable from '../../../components/user/dashboard/vendors/FreightRouteDataTable'
import VendorOverview from '../../../components/user/dashboard/vendors/VendorOverview'
// PrimeReact Components
import { TabView, TabPanel } from 'primereact/tabview'

function VendorsDashboard() {
    // #region VARS ------------------------
    const [activeTabIndex, setActiveTabIndex] = useState(0)
    // #endregion

    return (
        <section>
            <h1 style={{ textAlign: 'center', fontSize: '20pt' }}>
                C&H Vendors
            </h1>

            <TabView
                activeIndex={activeTabIndex}
                onTabChange={(e) => setActiveTabIndex(e.index)}
            >
                <TabPanel header="Overview">
                    <VendorOverview />
                </TabPanel>
                <TabPanel header="Vendors">
                    <VendorDataTable />
                </TabPanel>
                <TabPanel header="Locations">
                    <VendorLocationDataTable />
                </TabPanel>
                <TabPanel header="Products">
                    <VendorProductDataTable />
                </TabPanel>
                <TabPanel header="Routes">
                    <FreightRouteDataTable />
                </TabPanel>
            </TabView>
        </section>
    )
}

export default VendorsDashboard
