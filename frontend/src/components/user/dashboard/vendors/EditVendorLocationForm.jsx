import { useState, useEffect } from 'react'
import DialogHeader from '../../../dialogComponents/DialogHeader'
import DialogFooter_SubmitClose from '../../../dialogComponents/DialogFooter_SubmitClose'
// PrimeReact Components
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { InputSwitch } from 'primereact/inputswitch'
// Store data
import { fetchUser } from '../../../../api/users/usersApi'
import { getVendors } from '../../../../api/vendors/vendorsApi'
import { updateVendorLocation } from '../../../../api/vendorLocations/vendorLocationsApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

function EditVendorLocationForm({ vendorLocation }) {
    // #region VARS ------------------------

    const queryClient = useQueryClient()

    const initialState = {
        _id: '',
        vendorId: '',
        name: '',
        isActive: true,
    }

    const [formDialog, setFormDialog] = useState(false)
    const [formData, setFormData] = useState(initialState)

    const user = useQuery(['user'], fetchUser)

    const vendors = useQuery({
        queryKey: ['vendors'],
        queryFn: () => getVendors(user.data.token),
    })

    const mutation = useMutation({
        mutationKey: ['vendorLocations'],
        mutationFn: ({ formData, token }) =>
            updateVendorLocation(formData, token),
        onSuccess: (vendorLocation) => {
            toast.success(`${vendorLocation.name} updated`, { toastId: 'edit-vendor-loc-form-loc-updated' })
            queryClient.invalidateQueries(['vendorLocations'])
        },
        onError: (err) => {
            console.log('Error updating vendor location: ')
            console.log(err)
            toast.error('Error updating vendor location', { autoClose: false, toastId: 'edit-vendor-loc-form-loc-updated-error' })
        },
    })

    // Destructure form data
    const { _id, vendorId, name, isActive } = formData
    // #endregion

    // #region COMPONENT RENDERERS
    const vendorLocationDialogHeader = () => {
        return <DialogHeader resourceType="Vendor Location" isEdit={false} />
    }

    const vendorLocationDialogFooter = () => {
        return (
            <DialogFooter_SubmitClose onClose={onClose} onSubmit={onSubmit} />
        )
    }
    // #endregion

    // #region FORM HANDLERS
    // Handle form reset
    const resetForm = () => {
        if (vendorLocation) {
            setFormData((prevState) => ({
                ...prevState,
                _id: vendorLocation._id,
                vendorId: vendorLocation.vendorId,
                name: vendorLocation.name,
                isActive: vendorLocation.isActive,
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
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    // Handle form submit
    const onSubmit = (e) => {
        e.preventDefault()
        // dispatch(updateVendorLocation(formData));
        mutation.mutate({ formData, token: user.data.token })
        onClose()
    }
    // #endregion

    // Set form data to `vendorLocation` prop
    useEffect(() => {
        if (vendorLocation) {
            setFormData((prevState) => ({
                ...prevState,
                _id: vendorLocation._id,
                vendorId: vendorLocation.vendorId,
                name: vendorLocation.name,
                isActive: vendorLocation.isActive,
            }))
        }
    }, [vendorLocation])

    return (
        <section>
            <Button
                icon="pi pi-pencil"
                style={{ marginRight: '0.5em' }}
                onClick={() => setFormDialog(true)}
            />

            <Dialog
                id="editVendorLocationDialog"
                visible={formDialog}
                header={vendorLocationDialogHeader}
                footer={vendorLocationDialogFooter}
                onHide={onClose}
                style={{ minWidth: '40vw' }}
                blockScroll
            >
                <form onSubmit={onSubmit}>
                    {/* VENDOR, NAME */}
                    <div className="formgrid grid">
                        {/* Vendor */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <Dropdown
                                        name="vendorId"
                                        optionLabel="name"
                                        optionValue="_id"
                                        value={vendorId}
                                        options={vendors.data}
                                        onChange={onChange}
                                        placeholder="Choose..."
                                        style={{ width: '100%' }}
                                        required
                                        autoFocus
                                    />
                                    <label htmlFor="vendorId">Vendor</label>
                                </span>
                            </div>
                        </div>

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
                                        required
                                    />
                                    <label htmlFor="name">Name</label>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* IS ACTIVE */}
                    <div className="formgrid grid">
                        {/* IsActive */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <InputSwitch
                                    id="isActive"
                                    name="isActive"
                                    checked={isActive}
                                    onChange={onChange}
                                />
                                <strong style={{ marginLeft: '0.5em' }}>
                                    Active
                                </strong>
                            </div>
                        </div>
                    </div>
                </form>
            </Dialog>
        </section>
    )
}

export default EditVendorLocationForm
