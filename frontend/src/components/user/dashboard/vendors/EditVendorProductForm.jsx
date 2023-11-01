import { useState, useEffect } from 'react'
import DialogHeader from '../../../dialogComponents/DialogHeader'
import DialogFooter_SubmitClose from '../../../dialogComponents/DialogFooter_SubmitClose'
import { toast } from 'react-toastify'
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
import { updateVendorProduct } from '../../../../api/vendorProducts/vendorProductsApi'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

function VendorProductForm({ vendorProduct }) {
   // #region VARS ------------------------

   const queryClient = useQueryClient()

   const initialState = {
      _id: undefined,
      vendorId: undefined,
      vendorLocationId: undefined,
      name: '',
      productCost: undefined,
      notes: '',
      isActive: true,
   }

   const [sortedVendors, setSortedVendors] = useState([])
   const [filteredVendorLocations, setFilteredVendorLocations] = useState([])
   const [formDialog, setFormDialog] = useState(false)
   const [formData, setFormData] = useState(initialState)

   // Destructure form data
   const { vendorId, vendorLocationId, name, productCost, notes, isActive } =
      formData

   const user = useQuery(['user'], fetchUser)

   const vendors = useQuery({
      queryKey: ['vendors'],
      queryFn: () => getVendors(user.data.token),
      onError: (err) => {
         const errMsg = 'Error fetching vendors'
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

   const vendorLocations = useQuery({
      queryKey: ['vendorLocations'],
      queryFn: () => getVendorLocations(user.data.token),
      onError: (err) => {
         const errMsg = 'Error fetching vendor locations'
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

   const mutationUpdateVendorProduct = useMutation({
      mutationKey: ['vendorProducts'],
      mutationFn: ({ formData, token }) => updateVendorProduct(formData, token),
      onSuccess: (updVendorProduct) => {
         if (updVendorProduct) {
            toast.success(`${updVendorProduct.name} updated`, {
               autoClose: 1000,
            })
            queryClient.invalidateQueries(['vendorProducts'])
         }
      },
      onError: (err) => {
         const errMsg = 'Error updating vendor product'
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

   // #region COMPONENT RENDERERS
   const vendorProductDialogHeader = () => {
      return (
         <DialogHeader
            resourceType="Vendor Product"
            resourceName={vendorProduct.name}
            isEdit
         />
      )
   }

   const vendorProductDialogFooter = () => {
      return <DialogFooter_SubmitClose onClose={onClose} onSubmit={onSubmit} />
   }
   // #endregion

   // #region FORM HANDLERS
   // Handle form reset
   const resetForm = () => {
      if (vendorProduct) {
         setFormData((prevState) => ({
            ...prevState,
            _id: vendorProduct._id,
            vendorId: vendorProduct.vendorId,
            vendorLocationId: vendorProduct.vendorLocationId,
            name: vendorProduct.name,
            productCost: vendorProduct.productCost,
            notes: vendorProduct.notes,
            isActive: vendorProduct.isActive,
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

      if (!name) {
         return toast.error('A product name is required')
      }

      // if (!productCost) {
      //     return toast.error('A product cost is required (or 0)')
      // }

      mutationUpdateVendorProduct.mutate({ formData, token: user.data.token })
      onClose()
   }
   // #endregion

   // #region TEMPLATES
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

   // Fill FormData with contents of Material prop
   useEffect(() => {
      if (vendorProduct) {
         setFormData((prevState) => ({
            ...prevState,
            _id: vendorProduct._id,
            vendorId: vendorProduct.vendorId,
            vendorLocationId: vendorProduct.vendorLocationId,
            name: vendorProduct.name,
            productCost: vendorProduct.productCost,
            notes: vendorProduct.notes,
            isActive: vendorProduct.isActive,
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
            id="editVendorProductDialog"
            visible={formDialog}
            header={vendorProductDialogHeader}
            footer={vendorProductDialogFooter}
            onHide={onClose}
            blockScroll
         >
            <form onSubmit={onSubmit}>
               {/* VENDOR */}
               <div className="formgrid grid">
                  {/* Vendor ID */}
                  <div className="field col">
                     <div className="p-float-label">
                        <Dropdown
                           id="vendorProductVendorId"
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
                        />
                        <label htmlFor="vendorProductVendorId">Vendor *</label>
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
                           autoFocus
                        />
                        <label htmlFor="vendorLocationId">Location *</label>
                     </div>
                  </div>
               </div>

               {/* NAME, PRODUCT COST */}
               <div className="formgrid grid">
                  {/* Name */}
                  <div className="field col">
                     <div style={{ margin: '0.8em 0' }}>
                        <span className="p-float-label">
                           <InputText
                              id="name"
                              name="name"
                              value={name}
                              placeholder="Name"
                              onChange={onChange}
                              style={{ width: '100%' }}
                              autoFocus
                              required
                           />
                           <label htmlFor="name">Name *</label>
                        </span>
                     </div>
                  </div>

                  {/* Product Cost */}
                  <div className="field col">
                     <div style={{ margin: '0.8em 0' }}>
                        <span className="p-float-label">
                           <InputNumber
                              id="productCost"
                              name="productCost"
                              value={productCost}
                              placeholder="Product Cost"
                              mode="decimal"
                              minFractionDigits={2}
                              step={0.01}
                              onChange={onChangeNumber}
                              style={{ width: '100%' }}
                              required
                           />
                           <label htmlFor="productCost">Product Cost *</label>
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

export default VendorProductForm
