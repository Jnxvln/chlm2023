import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import DialogHeader from '../../../dialogComponents/DialogHeader'
import DialogFooter from '../../../dialogComponents/DialogFooter_SubmitClose'
// PrimeReact Components
import { Dialog } from 'primereact/dialog'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { InputSwitch } from 'primereact/inputswitch'
// Store data
import { fetchUser } from '../../../../api/users/usersApi'
import {
    getDeliveryClients,
    updateDeliveryClient,
} from '../../../../api/deliveryClients/deliveryClientsApi'
import { createDelivery } from '../../../../api/deliveries/deliveriesApi'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

function DeliveryForm({ selectedClient, iconButton, hideButton, display }) {
    // #region VARS ------------------------

    const queryClient = useQueryClient()

    const initialState = {
        deliveryClient: undefined,
        deliveryDate: undefined,
        contactName: '',
        contactPhone: '',
        companyName: '',
        address: '',
        coordinates: '',
        productName: '',
        productQuantity: '',
        notes: '',
        directions: '',
        hasPaid: false,
        directionsReminder: false,
        completed: false,
    }
    const [
        confirmClientUpdatesDialogVisible,
        setConfirmClientUpdatesDialogVisible,
    ] = useState(false)
    const [formDialog, setFormDialog] = useState(false)
    const [formData, setFormData] = useState(initialState)
    const [clientUpdates, setClientUpdates] = useState(null)
    const [selectedDeliveryClient, setSelectedDeliveryClient] = useState(null)

    // User state
    const user = useQuery(['user'], fetchUser)

    // Select deliveryClients from store
    const deliveryClients = useQuery({
        queryKey: ['deliveryClients'],
        queryFn: () => getDeliveryClients(user.data.token),
        onError: (err) => {
            console.log('Error fetching delivery clients: ')
            console.log(err)
        },
    })

    const mutationCreateDelivery = useMutation({
        mutationKey: ['deliveries'],
        mutationFn: ({ formData, token }) => createDelivery(formData, token),
        onSuccess: (delivery) => {
            if (delivery) {
                toast.success('Delivery created', { autoClose: 1000 })
                queryClient.invalidateQueries(['deliveries'])
            }
        },
        onError: (err) => {
            const errMsg = 'Error creating delivery'
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

    const mutationUpdateDeliveryClient = useMutation({
        mutationKey: ['deliveryClients'],
        mutationFn: ({ clientUpdates, token }) =>
            updateDeliveryClient(clientUpdates, token),
        onSuccess: (data) => {
            toast.success('Client updated!', { autoClose: 3000 })
            setClientUpdates(null)
            queryClient.invalidateQueries(['deliveryClients'])
            // setClientData()
        },
        onError: (err) => {
            const errMsg = 'Error updating delivery client. Check logs'
            console.log(errMsg)
            console.log(err)
            setClientUpdates(null)

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

    // Destructure form data
    const {
        deliveryClient,
        deliveryDate,
        contactPhone,
        address,
        coordinates,
        productName,
        productQuantity,
        notes,
        directions,
        hasPaid,
        // directionsReminder,
        completed,
    } = formData
    // #endregion

    // #region COMPONENT RENDERERS ------------------------
    const deliveryDialogHeader = () => {
        return <DialogHeader resourceType="Delivery" isEdit={false} />
    }

    const deliveryDialogFooter = () => {
        return <DialogFooter onClose={onClose} onSubmit={onSubmit} />
    }
    // #endregion

    // #region TEMPLATES ------------------------
    const clientOptionTemplate = (option, props) => {
        if (option) {
            return (
                <>
                    {option.companyName ? (
                        <>{option.companyName}</>
                    ) : (
                        <>
                            {option.firstName} {option.lastName}
                        </>
                    )}
                </>
            )
        }

        return <span>{props.placeholder}</span>
    }

    const selectedClientTemplate = (option, props) => {
        if (option) {
            return (
                <>
                    {option.companyName ? (
                        <>{option.companyName}</>
                    ) : (
                        <>
                            {option.firstName} {option.lastName}
                        </>
                    )}
                </>
            )
        }

        return <span>{props.placeholder}</span>
    }
    // #endregion

    // #region FORM HANDLERS ------------------------
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

        formData.deliveryClient = formData.deliveryClient._id

        if (!deliveryClient) {
            return toast.error('A client is required')
        }

        if (!deliveryDate) {
            return toast.error('The delivery date is required')
        }

        if (!contactPhone) {
            return toast.error('A contact phone number is required')
        }

        if (!productName) {
            return toast.error('The products field is required')
        }

        if (!productQuantity) {
            return toast.error('The product quantity is required')
        }

        // Check for **BLANK** DeliveryClient fields, ask if want to save --------------------------------------------
        let updates = {}

        // #region Delivery Client update checks
        if (
            contactPhone &&
            selectedClient &&
            (!selectedClient.phone || selectedClient.phone === '')
        ) {
            updates.phone = contactPhone
        }

        if (
            address &&
            selectedClient &&
            (!selectedClient.address || selectedClient.address === '')
        ) {
            updates.address = address
        }

        if (
            coordinates &&
            selectedClient &&
            (!selectedClient.coordinates || selectedClient.coordinates === '')
        ) {
            updates.coordinates = coordinates
        }

        if (
            directions &&
            selectedClient &&
            (!selectedClient.directions || selectedClient.directions === '')
        ) {
            updates.directions = directions
        }
        // #endregion

        // Set clientUpdates values (doesn't approve yet, still need to confirm with user, this just sets data in place)
        if (Object.keys(updates).length > 0) {
            setClientUpdates(updates)
            setConfirmClientUpdatesDialogVisible(true)
        }

        //  ------------------------------------------------------------------------------------------------------

        mutationCreateDelivery.mutate({ formData, token: user.data.token })
        onClose()
    }

    // Handle form reset
    const resetForm = () => {
        setFormData(initialState)
    }

    // Handle dialog close
    const onClose = () => {
        resetForm()
        setFormDialog(false)
    }

    const setClientData = () => {
        if (selectedClient) {
            // console.log(
            //     '[DeliveryForm setClientData]: Setting selectedClient: '
            // )
            // console.log(selectedClient)
            setFormData((prevState) => ({
                ...prevState,
                deliveryClient: selectedClient,
                contactName:
                    selectedClient.firstName + ' ' + selectedClient.lastName,
                contactPhone: selectedClient.phone,
                address: selectedClient.address,
                coordinates: selectedClient.coordinates,
                directions: selectedClient.directions,
            }))
        } else {
            // console.log('Else no client selected?')
        }
    }

    const acceptClientUpdates = () => {
        // Add clientId
        clientUpdates._id = selectedClient._id

        mutationUpdateDeliveryClient.mutate({
            clientUpdates,
            token: user.data.token,
        })

        setClientUpdates(null)
    }

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1)
    }

    const clientUpdatesJSX = () => {
        if (!clientUpdates || Object.keys(clientUpdates).length === 0) {
            return <>No updates found</>
        }

        return (
            <>
                <div>
                    <p>
                        The following fields do not exist on the delivery
                        customer. Do you want to add them?
                    </p>
                </div>
                <div>
                    {/* {clientUpdates &&
                        Object.entries(clientUpdates).map((entry) => {
                            console.log('clientUpdates entries: ')
                            console.log(entry)
                        })} */}

                    {clientUpdates &&
                        Object.entries(clientUpdates).map((entry, idx) => (
                            <>
                                {entry[1] !== null && (
                                    <div
                                        style={{
                                            whiteSpace: 'pre',
                                            marginBottom: '0.5em',
                                        }}
                                    >
                                        <strong>
                                            {capitalizeFirstLetter(entry[0])}:
                                        </strong>{' '}
                                        {entry[1]}
                                    </div>
                                )}
                            </>
                        ))}
                </div>
            </>
        )
    }

    // #endregion

    useEffect(() => {
        if (selectedDeliveryClient) {
            setFormData((prevState) => ({
                ...prevState,
                contactName:
                    selectedDeliveryClient.firstName +
                    ' ' +
                    selectedDeliveryClient.lastName,
                contactPhone: selectedDeliveryClient.phone,
                address: selectedDeliveryClient.address,
                coordinates: selectedDeliveryClient.coordinates,
                directions: selectedDeliveryClient.directions,
            }))
        }
    }, [deliveryClients.data, selectedDeliveryClient])

    useEffect(() => {
        setClientData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedClient])

    useEffect(() => {
        if (display) {
            setFormDialog(true)
        }
    }, [display])

    return (
        <>
            <ConfirmDialog
                visible={confirmClientUpdatesDialogVisible}
                onHide={() => setConfirmClientUpdatesDialogVisible(false)}
                message={clientUpdatesJSX}
                header="Customer Updates Detected. Save Changes?"
                icon="pi pi-exclamation-triangle"
                accept={acceptClientUpdates}
                reject={() => {
                    setClientUpdates(null)
                }}
            />

            {!hideButton && (
                <Button
                    label={iconButton ? null : 'New Delivery'}
                    icon={iconButton ? 'pi pi-truck' : 'pi pi-plus'}
                    style={{ height: '100%', padding: '0.8em' }}
                    onClick={(e) => {
                        e.stopPropagation()
                        setClientData()
                        setFormDialog(true)
                    }}
                />
            )}

            <Dialog
                id="newDeliveryDialog"
                visible={formDialog}
                header={deliveryDialogHeader}
                footer={deliveryDialogFooter}
                onHide={onClose}
                modal={true}
                closeOnEscape={false}
                onClick={(e) => e.stopPropagation()}
                blockScroll
            >
                <form onSubmit={onSubmit}>
                    {/* DELIVERY CLIENT, DELIVERY DATE */}
                    <div className="formgrid grid">
                        {/* Delivery client */}
                        <div className="field col">
                            <div
                                style={{
                                    margin: '0.8em 0',
                                    width: '100%',
                                }}
                            >
                                <span className="p-float-label">
                                    <Dropdown
                                        id="deliveryClient"
                                        name="deliveryClient"
                                        value={deliveryClient}
                                        options={deliveryClients.data}
                                        optionLabel="firstName"
                                        itemTemplate={clientOptionTemplate}
                                        valueTemplate={selectedClientTemplate}
                                        filter="true"
                                        filterBy="firstName"
                                        onChange={(e) => {
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                deliveryClient: e.value,
                                            }))
                                            setSelectedDeliveryClient(e.value)
                                        }}
                                        placeholder="Client name"
                                        style={{ minWidth: '100% !important' }}
                                        required
                                        autoFocus
                                    />
                                    <label htmlFor="deliveryClient">
                                        Client Name *
                                    </label>
                                </span>
                            </div>
                        </div>

                        {/* Delivery Date */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <Calendar
                                        id="deliveryDate"
                                        name="deliveryDate"
                                        value={deliveryDate}
                                        onChange={onChange}
                                        style={{ width: '100%' }}
                                        selectOtherMonths
                                        required
                                    ></Calendar>
                                    <label htmlFor="deliveryDate">
                                        Delivery Date *
                                    </label>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CONTACT PHONE, ADDRESS */}
                    <div className="formgrid grid">
                        {/* Contact Phone */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputTextarea
                                        id="contactPhone"
                                        name="contactPhone"
                                        value={contactPhone}
                                        placeholder="Phone(s) *"
                                        onChange={onChange}
                                        rows={4}
                                        cols={30}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                    <label htmlFor="contactPhone">
                                        Phone(s) *
                                    </label>
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

                    {/* PRODUCT NAMES (MATERIALS), PRODUCT QUANTITIES */}
                    <div className="formgrid grid">
                        {/* Product Name (material) */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputTextarea
                                        id="productName"
                                        name="productName"
                                        value={productName}
                                        placeholder="* Products (1 per line)"
                                        onChange={onChange}
                                        rows={4}
                                        cols={30}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                    <label htmlFor="productName">
                                        Products *
                                    </label>
                                </span>
                            </div>
                        </div>

                        {/* Product Quantity */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputTextarea
                                        id="productQuantity"
                                        name="productQuantity"
                                        value={productQuantity}
                                        placeholder="* Quantities (1 per line)"
                                        onChange={onChange}
                                        rows={4}
                                        cols={30}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                    <label htmlFor="productQuantity">
                                        Quantities *
                                    </label>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* DIRECTIONS & NOTES */}
                    <div className="formgrid grid">
                        {/* Directions */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputTextarea
                                        id="directions"
                                        name="directions"
                                        value={directions}
                                        placeholder="Enter directions"
                                        onChange={onChange}
                                        rows={10}
                                        cols={30}
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="directions">
                                        Directions
                                    </label>
                                </span>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputTextarea
                                        id="notes"
                                        name="notes"
                                        value={notes}
                                        placeholder="Notes (not printed)"
                                        onChange={onChange}
                                        rows={4}
                                        cols={30}
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="notes">Notes</label>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* HAS PAID, DIRECTIONS REMINDER, COMPLETED */}
                    <div className="formgrid grid">
                        {/* Has Paid */}
                        <div className="field col">
                            <div>
                                <InputSwitch
                                    id="hasPaid"
                                    name="hasPaid"
                                    checked={hasPaid}
                                    onChange={onChange}
                                />
                                <strong style={{ marginLeft: '0.5em' }}>
                                    Has Paid
                                </strong>
                            </div>
                        </div>

                        {/* Directions Reminder */}
                        {/* <div className="field col">
                            <div>
                                <InputSwitch
                                    id="directionsReminder"
                                    name="directionsReminder"
                                    checked={directionsReminder}
                                    onChange={onChange}
                                />
                                <strong style={{ marginLeft: '0.5em' }}>
                                    Directions Reminder
                                </strong>
                            </div>
                        </div> */}

                        {/* Completed */}
                        <div className="field col">
                            <div>
                                <InputSwitch
                                    id="completed"
                                    name="completed"
                                    checked={completed}
                                    onChange={onChange}
                                />
                                <strong style={{ marginLeft: '0.5em' }}>
                                    Completed
                                </strong>
                            </div>
                        </div>
                    </div>
                </form>
            </Dialog>
        </>
    )
}

export default DeliveryForm
