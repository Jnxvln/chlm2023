// PrimeReact Components
import { useState, useEffect } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'
import { Badge } from 'primereact/badge'
import { toast } from 'react-toastify'
// Data
import { useQuery } from '@tanstack/react-query'
import { getUserMessagesByUserId } from '../../../api/userMessages/userMessagesApi'
// import { fetchUser } from '../../../api/users/usersApi'
// Custom Components
import HaulsDashboard from './HaulsDashboard'
import DeliveriesDashboard from './DeliveriesDashboard'
import VendorsDashboard from './VendorsDashboard'
import MaterialsDashboard from './MaterialsDashboard'
import DriversDashboard from './DriversDashboard'
import CostCalculator from './CostCalculator'
import WaitList from './WaitList'
import AdminDashboard from './AdminDashboard/AdminDashboard'
import UserMessages from './UserMessages/UserMessages'
// import CarportsDashboard from './CarportsDashboard'

function Dashboard({ user }) {
   // #region VARS ===========================================================================
   const [tabsActiveIndex, setTabsActiveIndex] = useState(
      localStorage.getItem('activeTab') || undefined
   )

   const userMessages = useQuery({
      queryKey: ['usermessages'],
      queryFn: () => getUserMessagesByUserId(user._id, user.token),
      onError: (err) => {
         const errMsg = 'Error loading user messages for the main dashboard'
         console.error(err)

         if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data.message
         ) {
            toast.error(err.response.data.message, { autoClose: 5000, toastId: 'error-getting-user-message-by-user-id' })
         } else {
            toast.error(errMsg, { autoClose: 5000, toastId: 'error-getting-user-message-by-user-id-other' })
         }
      },
   })
   // #endregion

   // #region TEMPLATES ======================================================================
   const userMessagesTemplate = (options) => {
      return (
         <div
            className={options.className}
            onClick={options.onClick}
            style={{
               marginTop: 0,
               marginBottom: 0,
               paddingTop: 0,
               paddingBottom: 0,
            }}
         >
            {options.titleElement}
            &nbsp;
            {userMessages &&
               userMessages.data &&
               userMessages.data.length > 0 &&
               userMessages.data.filter((msg) => {
                  return (
                     !msg.messageViewed &&
                     !msg.recipientDeleted &&
                     msg.senderId !== user._id
                  )
               }).length > 0 && (
                  <Badge
                     value={
                        userMessages.data.filter((msg) => {
                           return (
                              !msg.messageViewed &&
                              !msg.recipientDeleted &&
                              msg.senderId !== user._id
                           )
                        }).length
                     }
                  />
               )}
         </div>
      )
   }
   // #endregion

   // #region USE EFFECTS ====================================================================
   useEffect(() => {
      let tabIndex = localStorage.getItem('activeTab')
      if (tabIndex !== null) {
         tabIndex = parseInt(tabIndex)
         setTabsActiveIndex(tabIndex)
      }
   }, [])

   useEffect(() => {
      if (userMessages && userMessages.data) {
         const filt = userMessages.data.filter((msg) => {
            return (
               !msg.messageViewed &&
               !msg.recipientDeleted &&
               msg.senderId !== user._id
            )
         })

         console.log('[Dashboard.jsx useEffect] filt: ')
         console.log(filt)
      }
   }, [userMessages])
   // #endregion

   return (
      <section style={{ padding: '2em' }}>
         <h1>Dashboard</h1>
         <div>
            <strong>Welcome, {user.firstName}</strong>
            {/* <div style={{ fontSize: '0.8rem' }}>User ID: {user?._id}</div> */}
         </div>

         <br />

         <TabView
            activeIndex={tabsActiveIndex}
            onTabChange={(e) => {
               localStorage.setItem('activeTab', e.index)
               setTabsActiveIndex(e.index)
            }}
         >
            <TabPanel
               header="Messages"
               headerTemplate={userMessagesTemplate}
               headerClassName="flex align-items-center"
            >
               <UserMessages />
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
            <TabPanel header="Wait List">
               <WaitList />
            </TabPanel>
            <TabPanel header="Admin">
               <AdminDashboard />
            </TabPanel>
         </TabView>
      </section>
   )
}

export default Dashboard
