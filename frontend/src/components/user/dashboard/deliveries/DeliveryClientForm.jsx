import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import DialogHeader from '../../../dialogComponents/DialogHeader'
import DialogFooter from '../../../dialogComponents/DialogFooter_SubmitClose'
import DeliveryForm from './DeliveryForm'
// PrimeReact Components
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { ConfirmDialog } from 'primereact/confirmdialog' // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog' // For confirmDialog method
// Store data
import { fetchUser } from '../../../../api/users/usersApi'
import { createDeliveryClient } from '../../../../api/deliveryClients/deliveryClientsApi'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

function DeliveryClientForm({ clientName, iconButton }) {
    // #region VARS ------------------------

    const queryClient = useQueryClient()

    const initialState = {
        firstName: '',
        lastName: '',
        phone: '',
        companyName: '',
        address: '',
        coordinates: '',
        directions: '',
    }

    const [formDialog, setFormDialog] = useState(false)
    const [displayDeliveryForm, setDisplayDeliveryForm] = useState(false)
    const [selectedDeliveryClient, setSelectedDeliveryClient] = useState(null)
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

    const mutationCreateDeliveryClient = useMutation({
        mutationKey: ['deliveryClients'],
        mutationFn: ({ formData, token }) =>
            createDeliveryClient(formData, token),
        onSuccess: (deliveryClient) => {
            toast.success(
                `${deliveryClient.firstName} ${deliveryClient.lastName} created`,
                { autoClose: 1000, toastId: 'create-dlv-client-success' }
            )
            confirmBookDelivery(deliveryClient)
            queryClient.invalidateQueries(['deliveryClients'])
        },
        onError: (err) => {
            const errMsg = 'Error creating delivery client'
            console.log(errMsg)
            console.log(err)

            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                toast.error(err.response.data.message, { autoClose: false, toastId: 'err-create-dlv-client' })
            } else {
                toast.error(errMsg, { autoClose: false, toastId: 'err-create-dlv-client-other' })
            }
        },
    })

    // #endregion

    // #region COMPONENT RENDERERS
    const deliveryClientDialogHeader = () => {
        return <DialogHeader resourceType="Delivery Client" isEdit={false} />
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

        // dispatch(createDeliveryClient(formData));
        mutationCreateDeliveryClient.mutate({
            formData,
            token: user.data.token,
        })

        onClose()
    }

    // Handle form reset
    const resetForm = () => {
        setFormData(initialState)
    }

    // Handle form closing
    const onClose = () => {
        resetForm()
        setFormDialog(false)
    }

    const confirmBookDelivery = (deliveryClient) => {
        confirmDialog({
            message: `Do you want to book a delivery for ${deliveryClient.firstName} ${deliveryClient.lastName}?`,
            header: 'Book Delivery?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                setSelectedDeliveryClient(deliveryClient)
                setDisplayDeliveryForm(true)
            },
            reject: () => {
                // do nothing
            },
        })
    }
    // #endregion

    useEffect(() => {
        if (clientName) {
            const _firstName = clientName.split(' ')[0]
            const _lastName = clientName.split(' ')[1]
            setFormData((prevState) => ({
                ...prevState,
                firstName: _firstName,
                lastName: _lastName,
            }))
        }
    }, [clientName])

    return (
        <>
            {/* <Toast ref={toast} /> */}
            <ConfirmDialog />
            <DeliveryForm
                hideButton={true}
                display={displayDeliveryForm}
                selectedClient={selectedDeliveryClient}
            />

            <Button
                label={iconButton ? null : 'New Client'}
                icon="pi pi-plus"
                style={{ height: '100%', marginLeft: '0.75em' }}
                className="p-button-darkgray"
                onClick={() => setFormDialog(true)}
            />

            <Dialog
                id="newDeliveryClientDialog"
                visible={formDialog}
                header={deliveryClientDialogHeader}
                footer={deliveryClientDialogFooter}
                onHide={onClose}
                style={{ width: '50vw' }}
                blockScroll
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
                                        placeholder="Last name"
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
                                        placeholder="Phone(s)"
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
                                        placeholder="Address"
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
        </>
    )
}

export default DeliveryClientForm
