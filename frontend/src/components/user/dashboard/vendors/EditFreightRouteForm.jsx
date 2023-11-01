import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import DialogHeader from '../../../dialogComponents/DialogHeader'
import DialogFooter_SubmitClose from '../../../dialogComponents/DialogFooter_SubmitClose'
// PrimeReact Components
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputSwitch } from 'primereact/inputswitch'
import { InputNumber } from 'primereact/inputnumber'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
// Store data
import { fetchUser } from '../../../../api/users/usersApi'
import { getVendors } from '../../../../api/vendors/vendorsApi'
import { getVendorLocations } from '../../../../api/vendorLocations/vendorLocationsApi'
import { updateFreightRoute } from '../../../../api/freightRoutes/freightRoutesApi'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

function EditFreightRouteForm({ freightRoute }) {
   // #region VARS ------------------------

   const queryClient = useQueryClient()

   const initialState = {
      _id: undefined,
      vendorId: undefined,
      vendorLocationId: undefined,
      destination: '',
      freightCost: undefined,
      notes: '',
      isActive: true,
   }

   const [sortedVendors, setSortedVendors] = useState([])
   const [filteredVendorLocations, setFilteredVendorLocations] = useState([])
   const [formDialog, setFormDialog] = useState(false)
   const [formData, setFormData] = useState(initialState)

   // Destructure form data
   const {
      vendorId,
      vendorLocationId,
      destination,
      freightCost,
      notes,
      isActive,
   } = formData

   const user = useQuery(['user'], fetchUser)

   const vendors = useQuery({
      queryKey: ['vendors'],
      queryFn: () => getVendors(user.data.token),
   })

   const vendorLocations = useQuery({
      queryKey: ['vendorLocations'],
      queryFn: () => getVendorLocations(user.data.token),
   })

   const mutationUpdateRoute = useMutation({
      mutationKey: ['freightRoutes'],
      mutationFn: ({ formData, token }) => updateFreightRoute(formData, token),
      onSuccess: (freightRoute) => {
         const vendor = vendors.data.find(
            (v) => v._id === freightRoute.vendorId
         )

         const vendorLocation = vendorLocations.data.find(
            (loc) => loc._id === freightRoute.vendorLocationId
         )
         if (freightRoute) {
            toast.success(
               `${vendor.name} (${vendorLocation.name}) to ${freightRoute.destination} updated`,
               {
                  autoClose: 3000,
               }
            )
            queryClient.invalidateQueries(['freightRoutes'])
         }
      },
      onError: (err) => {
         const errMsg = 'Error creating freight route'
         console.log(errMsg)
         console.log(err)

         if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data.message
         ) {
            toast.error(err.response.data.message, { autoClose: false })
         } else {
            toast.error(errMsg, { autoClose: false })
         }
      },
   })

   // #endregion

   // #region COMPONENT RENDERERS ------------------------
   const freightRouteDialogHeader = () => {
      return (
         <DialogHeader
            resourceType="Route"
            resourceName={freightRoute.destination}
            isEdit
         />
      )
   }

   const freightRouteDialogFooter = () => {
      return <DialogFooter_SubmitClose onClose={onClose} onSubmit={onSubmit} />
   }
   // #endregion

   // #region FORM HANDLERS ------------------------
   // Handle form reset
   const resetForm = () => {
      if (freightRoute) {
         setFormData((prevState) => ({
            ...prevState,
            _id: freightRoute._id,
            vendorId: freightRoute.vendorId,
            vendorLocationId: freightRoute.vendorLocationId,
            destination: freightRoute.destination,
            freightCost: freightRoute.freightCost,
            notes: freightRoute.notes,
            isActive: freightRoute.isActive,
         }))
      }
      setFormData(initialState)
   }

   // Handle form closing
   const onClose = () => {
      resetForm()
      setFormDialog(false)
   }

   // Handle form text input
   const onChange = (e) => {
      if (e.hasOwnProperty('target')) {
         setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
         }))
      }
   }

   // Handle form number input
   const onChangeNumber = (e) => {
      setFormData((prevState) => ({
         ...prevState,
         [e.originalEvent.target.name]: e.value,
      }))
   }

   // Handle form submit
   const onSubmit = (e) => {
      e.preventDefault()

      if (!vendorId) {
         return toast.error('A vendor is required')
      }

      if (!vendorLocationId) {
         return toast.error('A vendor location is required')
      }

      if (!destination) {
         return toast.error('Destination is required')
      }

      // if (!freightCost) {
      //    return toast.error('Freight cost is required (or 0)')
      // }

      mutationUpdateRoute.mutate({ formData, token: user.data.token })
      onClose()
   }
   // #endregion

   // #region TEMPLATES ------------------------
   const vendorOptionTemplate = (option) => {
      return <>{option.name}</>
   }

   const vendorLocationOptionTemplate = (option) => {
      return <>{option.name}</>
   }
   // #endregion

   useEffect(() => {
      // Sort vendors alphabetically
      if (vendors.data && vendors.data.length > 1) {
         setSortedVendors(
            [...vendors.data].sort((a, b) => a.name.localeCompare(b.name))
         )
      }

      // Get vendor locations according to vendorId selected
      if (
         vendorId &&
         vendorId.length > 0 &&
         vendorLocations.data &&
         vendorLocations.data.length > 0
      ) {
         const _filteredLocations = vendorLocations.data.filter(
            (loc) => loc.vendorId === vendorId
         )
         setFilteredVendorLocations(_filteredLocations)
      }
   }, [vendors.data, vendorId, vendorLocations.data])

   // Fill FormData with contents of Freight Route prop
   useEffect(() => {
      if (freightRoute) {
         setFormData((prevState) => ({
            ...prevState,
            _id: freightRoute._id,
            vendorId: freightRoute.vendorId,
            vendorLocationId: freightRoute.vendorLocationId,
            destination: freightRoute.destination,
            freightCost: freightRoute.freightCost,
            notes: freightRoute.notes,
            isActive: freightRoute.isActive,
         }))
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
   return (
      <section>
         <Button
            icon="pi pi-pencil"
            style={{ marginRight: '0.5em' }}
            onClick={() => setFormDialog(true)}
         />

         <Dialog
            id="editFreightRouteDialog"
            visible={formDialog}
            header={freightRouteDialogHeader}
            footer={freightRouteDialogFooter}
            onHide={onClose}
            blockScroll
         >
            <form onSubmit={onSubmit}>
               {/* VENDOR, VENDOR LOCATION */}
               <div className="formgrid grid">
                  {/* Vendor */}
                  <div className="field col">
                     <div className="p-float-label">
                        <Dropdown
                           id="freightRouteVendorId"
                           value={vendorId}
                           options={sortedVendors}
                           onChange={(e) => {
                              setFormData((prevState) => ({
                                 ...prevState,
                                 vendorId: e.value,
                              }))
                           }}
                           optionLabel="name"
                           optionValue="_id"
                           placeholder="Choose vendor"
                           itemTemplate={vendorOptionTemplate}
                           style={{ width: '100%' }}
                           required
                           autoFocus
                        />
                        <label htmlFor="freightRouteVendorId">Vendor *</label>
                     </div>
                  </div>

                  {/* Vendor Location ID */}
                  <div className="field col">
                     <div className="p-float-label">
                        <Dropdown
                           id="vendorLocationId"
                           value={vendorLocationId}
                           options={filteredVendorLocations}
                           onChange={(e) => {
                              setFormData((prevState) => ({
                                 ...prevState,
                                 vendorLocationId: e.value,
                              }))
                           }}
                           optionLabel="name"
                           optionValue="_id"
                           placeholder="Location..."
                           itemTemplate={vendorLocationOptionTemplate}
                           style={{ width: '100%' }}
                           required
                        />
                        <label htmlFor="vendorLocationId">Location *</label>
                     </div>
                  </div>
               </div>

               {/* DESTINATION, FREIGHT COST */}
               <div className="formgrid grid">
                  {/* Destination */}
                  <div className="field col">
                     <div style={{ margin: '0.8em 0' }}>
                        <span className="p-float-label">
                           <InputText
                              id="destination"
                              name="destination"
                              value={destination}
                              placeholder="Destination"
                              onChange={onChange}
                              style={{ width: '100%' }}
                              required
                           />
                           <label htmlFor="destination">Destination</label>
                        </span>
                     </div>
                  </div>

                  {/* Freight Cost */}
                  <div className="field col">
                     <div style={{ margin: '0.8em 0' }}>
                        <span className="p-float-label">
                           <InputNumber
                              id="freightCost"
                              name="freightCost"
                              value={freightCost}
                              placeholder="Freight Cost"
                              mode="decimal"
                              minFractionDigits={2}
                              step={0.01}
                              onChange={onChangeNumber}
                              style={{ width: '100%' }}
                           />
                           <label htmlFor="freightCost">Freight Cost</label>
                        </span>
                     </div>
                  </div>
               </div>

               {/* NOTES */}
               <div className="formgrid grid">
                  <div className="field col">
                     <div style={{ margin: '0.8em 0' }}>
                        <span className="p-float-label">
                           <InputTextarea
                              id="notes"
                              name="notes"
                              value={notes}
                              placeholder="Notes"
                              onChange={onChange}
                              rows={5}
                              cols={30}
                              style={{ width: '100%' }}
                           />
                           <label htmlFor="notes">Notes</label>
                        </span>
                     </div>
                  </div>
               </div>

               {/* IS ACTIVE */}
               <div className="formgrid grid">
                  <div className="field col">
                     <div style={{ margin: '0.8em 0' }}>
                        <InputSwitch
                           id="isActive"
                           name="isActive"
                           checked={isActive}
                           onChange={onChange}
                        />
                        <strong style={{ marginLeft: '0.5em' }}>Active</strong>
                     </div>
                  </div>
               </div>
            </form>
         </Dialog>
      </section>
   )
}

export default EditFreightRouteForm
