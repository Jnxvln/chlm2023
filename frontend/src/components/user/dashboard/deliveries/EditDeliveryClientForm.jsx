import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import DialogHeader from '../../../dialogComponents/DialogHeader'
import DialogFooter from '../../../dialogComponents/DialogFooter_SubmitClose'
// PrimeReact Components
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
// Store data
import { fetchUser } from '../../../../api/users/usersApi'
import { updateDeliveryClient } from '../../../../api/deliveryClients/deliveryClientsApi'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

function EditDeliveryClientForm({ deliveryClientToEdit, iconButton }) {
    // #region VARS ------------------------

    const queryClient = useQueryClient()

    const initialState = {
        _id: '',
        firstName: '',
        lastName: '',
        phone: '',
        companyName: '',
        address: '',
        coordinates: '',
        directions: '',
    }

    const [formDialog, setFormDialog] = useState(false)
    const [formData, setFormData] = useState(initialState)

    // Destructure form data
    const {
        firstName,
        lastName,
        phone,
        companyName,
        address,
        coordinates,
        directions,
    } = formData

    const user = useQuery(['user'], fetchUser)

    const mutationUpdateDeliveryClient = useMutation({
        mutationKey: ['deliveryClients'],
        mutationFn: ({ formData, token }) =>
            updateDeliveryClient(formData, token),
        onSuccess: (updDeliveryClient) => {
            toast.success(
                `${updDeliveryClient.firstName} ${updDeliveryClient.lastName} updated`,
                { autoClose: 1000 }
            )
            queryClient.invalidateQueries(['deliveryClients'])
            queryClient.invalidateQueries(['deliveries'])
        },
        onError: (err) => {
            const errMsg = 'Error updating delivery client'
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
    const deliveryClientDialogHeader = () => {
        return (
            <DialogHeader
                resourceType="Delivery Client"
                resourceName={`${deliveryClientToEdit.firstName} ${deliveryClientToEdit.lastName}`}
                isEdit
            />
        )
    }

    const deliveryClientDialogFooter = () => {
        return <DialogFooter onClose={onClose} onSubmit={onSubmit} />
    }
    // #endregion

    // #region FORM HANDLERS
    // Handle form text input
    const onChange = (e) => {
        if (e.hasOwnProperty('target')) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
    }

    // Handle form submit
    const onSubmit = (e) => {
        e.preventDefault()

        // if (!firstName || !lastName || !phone) {
        //     return toast.error(
        //         'First name, last name, and phone number are required fields'
        //     )
        // }

        // dispatch(updateDeliveryClient(formData));
        mutationUpdateDeliveryClient.mutate({
            formData,
            token: user.data.token,
        })
        onClose()
    }

    // Handle form reset
    const resetForm = () => {
        if (deliveryClientToEdit) {
            setFormData((prevState) => ({
                ...prevState,
                _id: deliveryClientToEdit._id,
                firstName: deliveryClientToEdit.firstName,
                lastName: deliveryClientToEdit.lastName,
                phone: deliveryClientToEdit.phone,
                companyName: deliveryClientToEdit.companyName,
                address: deliveryClientToEdit.address,
                coordinates: deliveryClientToEdit.coordinates,
                directions: deliveryClientToEdit.directions,
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
    // #endregion

    useEffect(() => {
        if (deliveryClientToEdit) {
            setFormData((prevState) => ({
                ...prevState,
                _id: deliveryClientToEdit._id,
                firstName: deliveryClientToEdit.firstName,
                lastName: deliveryClientToEdit.lastName,
                phone: deliveryClientToEdit.phone,
                companyName: deliveryClientToEdit.companyName,
                address: deliveryClientToEdit.address,
                coordinates: deliveryClientToEdit.coordinates,
                directions: deliveryClientToEdit.directions,
            }))
        }
    }, [deliveryClientToEdit])

    return (
        <section>
            <Button
                label={iconButton ? null : 'Edit Client'}
                icon="pi pi-pencil"
                className="editDeliveryClientFormButton"
                onClick={(e) => {
                    e.stopPropagation()
                    setFormDialog(true)
                }}
            />

            <Dialog
                id="editDeliveryClientDialog"
                visible={formDialog}
                header={deliveryClientDialogHeader}
                footer={deliveryClientDialogFooter}
                onHide={onClose}
                style={{ width: '50vw' }}
                blockScroll
                onClick={(e) => {
                    e.stopPropagation()
                }}
            >
                <form onSubmit={onSubmit}>
                    {/* FIRST NAME, LAST NAME, COMPANY */}
                    <div className="formgrid grid">
                        {/* First Name */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputText
                                        id="firstName"
                                        name="firstName"
                                        value={firstName}
                                        placeholder="First name"
                                        onChange={onChange}
                                        style={{ width: '100%' }}
                                        autoFocus
                                        required
                                    />
                                    <label htmlFor="firstName">
                                        First Name
                                    </label>
                                </span>
                            </div>
                        </div>

                        {/* Last Name */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputText
                                        id="lastName"
                                        name="lastName"
                                        value={lastName}
                                        placeholder="Last name *"
                                        onChange={onChange}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                    <label htmlFor="lastName">Last Name</label>
                                </span>
                            </div>
                        </div>

                        {/* Company */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputText
                                        id="companyName"
                                        name="companyName"
                                        value={companyName}
                                        placeholder="Company Name"
                                        onChange={onChange}
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="companyName">
                                        Company Name
                                    </label>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* PHONE, ADDRESS */}
                    <div className="formgrid grid">
                        {/* Phone */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputTextarea
                                        id="phone"
                                        name="phone"
                                        value={phone}
                                        placeholder="Phone(s) *"
                                        onChange={onChange}
                                        rows={4}
                                        cols={30}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                    <label htmlFor="phone">Phone(s)</label>
                                </span>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputTextarea
                                        id="address"
                                        name="address"
                                        value={address}
                                        placeholder="Phone(s)"
                                        onChange={onChange}
                                        rows={4}
                                        cols={30}
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="address">Address</label>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* COORDINATES */}
                    <div className="formgrid grid">
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputText
                                        id="coordinates"
                                        name="coordinates"
                                        value={coordinates}
                                        placeholder="Coordinates"
                                        onChange={onChange}
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="coordinates">
                                        Coordinates
                                    </label>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* DIRECTIONS */}
                    <div className="formgrid grid">
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputTextarea
                                        id="directions"
                                        name="directions"
                                        value={directions}
                                        placeholder="Enter directions..."
                                        onChange={onChange}
                                        rows={10}
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="directions">
                                        Directions
                                    </label>
                                </span>
                            </div>
                        </div>
                    </div>
                </form>
            </Dialog>
        </section>
    )
}

export default EditDeliveryClientForm
