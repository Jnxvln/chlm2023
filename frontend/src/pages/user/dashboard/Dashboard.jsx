import { useState, useEffect } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'
import HaulsDashboard from './HaulsDashboard'
import DeliveriesDashboard from './DeliveriesDashboard'
import VendorsDashboard from './VendorsDashboard'
import MaterialsDashboard from './MaterialsDashboard'
import CarportsDashboard from './CarportsDashboard'
import DriversDashboard from './DriversDashboard'
import CostCalculator from './CostCalculator'

function Dashboard({ user }) {
    const [tabsActiveIndex, setTabsActiveIndex] = useState(
        localStorage.getItem('activeTab') || undefined
    )

    useEffect(() => {
        let tabIndex = localStorage.getItem('activeTab')
        if (tabIndex !== null) {
            tabIndex = parseInt(tabIndex)
            setTabsActiveIndex(tabIndex)
        }
    }, [])

    return (
        <section style={{ padding: '2em' }}>
            <h1>Dashboard</h1>
            <h4>Welcome, {user && user.firstName}</h4>

            <TabView
                activeIndex={tabsActiveIndex}
                onTabChange={(e) => {
                    localStorage.setItem('activeTab', e.index)
                    setTabsActiveIndex(e.index)
                }}
            >
                <TabPanel header="Welcome">
                    <h3>Welcome</h3>
                    <p>Choose any tab to get started</p>
                </TabPanel>
                <TabPanel header="Hauls" id="tabHauls">
                    <HaulsDashboard />
                </TabPanel>
                <TabPanel header="Deliveries">
                    <DeliveriesDashboard />
                </TabPanel>
                <TabPanel header="Vendors">
                    <VendorsDashboard />
                </TabPanel>
                <TabPanel header="Materials">
                    <MaterialsDashboard />
                </TabPanel>
                {/* <TabPanel header="Carports">
                    <CarportsDashboard />
                </TabPanel> */}
                <TabPanel header="Drivers">
                    <DriversDashboard />
                </TabPanel>
                <TabPanel header="Cost Calculator">
                    <CostCalculator />
                </TabPanel>
            </TabView>
        </section>
    )
}

export default Dashboard
