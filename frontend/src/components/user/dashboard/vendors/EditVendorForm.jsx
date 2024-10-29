import { useState, useEffect } from 'react'
import DialogHeader from '../../../dialogComponents/DialogHeader'
import DialogFooter from '../../../dialogComponents/DialogFooter_SubmitClose'
// PrimeReact Components
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputSwitch } from 'primereact/inputswitch'
import { InputNumber } from 'primereact/inputnumber'
// Store data
import { updateVendor } from '../../../../api/vendors/vendorsApi'
import { fetchUser } from '../../../../api/users/usersApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

function EditVendorForm({ vendor }) {
    // #region VARS ------------------------
    const queryClient = useQueryClient()

    const initialState = {
        _id: '',
        name: '',
        shortName: '',
        chtFuelSurcharge: '',
        vendorFuelSurcharge: '',
        isActive: true,
    }
    const [formDialog, setFormDialog] = useState(false)
    const [formData, setFormData] = useState(initialState)

    const user = useQuery(['user'], fetchUser)

    const mutation = useMutation({
        mutationKey: ['vendors'],
        mutationFn: ({ formData, token }) => updateVendor(formData, token),
        onSuccess: (updVendor) => {
            if (updVendor) {
                toast.success('Vendor updated', { autoClose: 1000, toastId: 'edit-vendor-form-vendor-update-success' })
                queryClient.invalidateQueries(['vendors'])
            }
        },
        onError: (err) => {
            console.log('Error updating vendor: ')
            console.log(err)
            toast.error('Error updating vendor', { autoClose: false, toastId: 'edit-vendor-form-vendor-update-error' })
        },
    })

    // Destructure form data
    const {
        _id,
        name,
        shortName,
        chtFuelSurcharge,
        vendorFuelSurcharge,
        isActive,
    } = formData
    // #endregion

    // #region COMPONENT RENDERERS
    const vendorDialogHeader = () => {
        return (
            <DialogHeader
                resourceType="Vendor"
                resourceName={vendor.name}
                isEdit
            />
        )
    }

    const vendorDialogFooter = () => {
        return <DialogFooter onClose={onClose} onSubmit={onSubmit} />
    }
    // #endregion

    // #region FORM HANDLERS
    // Handle form reset
    const resetForm = () => {
        if (vendor) {
            setFormData((prevState) => ({
                ...prevState,
                _id: vendor._id,
                name: vendor.name,
                shortName: vendor.shortName,
                chtFuelSurcharge: vendor.chtFuelSurcharge,
                vendorFuelSurcharge: vendor.vendorFuelSurcharge,
                isActive: vendor.isActive,
            }))
        } else {
            setFormData(initialState)
        }
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
        mutation.mutate({ formData, token: user.data.token })
        onClose()
    }
    // #endregion

    // Set form data to `vendor` prop
    useEffect(() => {
        if (vendor) {
            setFormData((prevState) => ({
                ...prevState,
                _id: vendor._id,
                name: vendor.name,
                shortName: vendor.shortName,
                chtFuelSurcharge: vendor.chtFuelSurcharge,
                vendorFuelSurcharge: vendor.vendorFuelSurcharge,
                isActive: vendor.isActive,
            }))
        }
    }, [vendor])

    return (
        <section className="edit-vendor-form-section">
            <Button
                icon="pi pi-pencil"
                iconPos="left"
                style={{ marginRight: '0.5em' }}
                onClick={() => setFormDialog(true)}
            />

            <Dialog
                id="editVendorDialog"
                visible={formDialog}
                header={vendorDialogHeader}
                footer={vendorDialogFooter}
                onHide={onClose}
                blockScroll
            >
                <form onSubmit={onSubmit}>
                    {/* ID, NAME, SHORT NAME */}
                    <div className="formgrid grid">
                        {/* ID */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputText
                                        id="_id"
                                        name="_id"
                                        value={_id}
                                        placeholder="ID"
                                        onChange={onChange}
                                        style={{ width: '100%' }}
                                        readOnly
                                        required
                                    />
                                    <label htmlFor="_id">ID</label>
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
                                        autoFocus
                                        required
                                    />
                                    <label htmlFor="name">Name</label>
                                </span>
                            </div>
                        </div>

                        {/* Short Name */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputText
                                        id="shortName"
                                        name="shortName"
                                        value={shortName}
                                        placeholder="Short Name"
                                        onChange={onChange}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                    <label htmlFor="shortName">
                                        Short Name
                                    </label>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CHT FUEL SCHG, VENDOR FUEL SCHG */}
                    <div className="formgrid grid">
                        {/* CHT Fuel Schg */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <label htmlFor="chtFuelSurcharge">
                                    CHT Fuel Schg
                                </label>
                                <InputNumber
                                    id="chtFuelSurcharge"
                                    name="chtFuelSurcharge"
                                    value={chtFuelSurcharge}
                                    placeholder="CHT Fuel Schg"
                                    mode="decimal"
                                    minFractionDigits={2}
                                    step={0.01}
                                    onChange={onChangeNumber}
                                    style={{ width: '100%' }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Vendor Fuel Schg */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <label htmlFor="vendorFuelSurcharge">
                                    Vendor Fuel Schg
                                </label>
                                <InputNumber
                                    id="vendorFuelSurcharge"
                                    name="vendorFuelSurcharge"
                                    value={vendorFuelSurcharge}
                                    placeholder="Vendor Fuel Schg"
                                    mode="decimal"
                                    minFractionDigits={2}
                                    step={0.01}
                                    onChange={onChangeNumber}
                                    style={{ width: '100%' }}
                                    required
                                />
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

export default EditVendorForm
