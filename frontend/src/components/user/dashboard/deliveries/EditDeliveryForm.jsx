import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import DialogHeader from '../../../dialogComponents/DialogHeader'
import DialogFooter from '../../../dialogComponents/DialogFooter_SubmitClose'
// PrimeReact Components
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { InputSwitch } from 'primereact/inputswitch'
// Store data
import { fetchUser } from '../../../../api/users/usersApi'
import { getDeliveryClients } from '../../../../api/deliveryClients/deliveryClientsApi'
import { updateDelivery } from '../../../../api/deliveries/deliveriesApi'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

function DeliveryForm({ delivery }) {
    // #region VARS ------------------------

    const queryClient = useQueryClient()

    const initialState = {
        _id: '',
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
    const [formDialog, setFormDialog] = useState(false)
    const [formData, setFormData] = useState(initialState)
    const [selectedDeliveryClient, setSelectedDeliveryClient] = useState(null)

    // Destructure form data
    const {
        _id,
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
        directionsReminder,
        completed,
    } = formData

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

    const mutationUpdateDelivery = useMutation({
        mutationKey: ['deliveries'],
        mutationFn: ({ formData, token }) => updateDelivery(formData, token),
        onSuccess: (updDelivery) => {
            if (updDelivery) {
                toast.success('Delivery updated', { autoClose: 1000 })
                queryClient.invalidateQueries(['deliveries'])
                queryClient.invalidateQueries(['deliveryClients'])
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

    // #endregion

    // #region COMPONENT RENDERERS ------------------------
    const deliveryDialogHeader = () => {
        return (
            <DialogHeader
                resourceType="Delivery"
                resourceName={
                    deliveryClients.data.find(
                        (client) => client._id === delivery.deliveryClient
                    ).firstName +
                    ' ' +
                    deliveryClients.data.find(
                        (client) => client._id === delivery.deliveryClient
                    ).lastName
                }
                isEdit
            />
        )
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

    const driverOptionLabelTemplate = (rowData) => {
        return (
            <>
                {rowData.companyName ? (
                    <>{rowData.companyName}</>
                ) : (
                    <>
                        {rowData.firstName} {rowData.lastName}
                    </>
                )}
            </>
        )
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

        mutationUpdateDelivery.mutate({ formData, token: user.data.token })
        onClose()
    }

    // Handle form reset
    const resetForm = () => {
        if (delivery) {
            setFormData((prevState) => ({
                ...prevState,
                _id: delivery._id,
                deliveryClient: delivery.deliveryClient,
                deliveryDate: delivery.deliveryDate,
                contactPhone: delivery.contactPhone,
                address: delivery.address,
                coordinates: delivery.coordinates,
                productName: delivery.productName,
                productQuantity: delivery.productQuantity,
                notes: delivery.notes,
                directions: delivery.directions,
                hasPaid: delivery.hasPaid,
                directionsReminder: delivery.directionsReminder,
                completed: delivery.completed,
            }))
        } else {
            setFormData(initialState)
        }
    }

    // Handle dialog close
    const onClose = () => {
        resetForm()
        setFormDialog(false)
    }
    // #endregion

    useEffect(() => {
        // If a delivery is passed in as a prop, render its contents via FormData
        if (delivery) {
            setFormData((prevState) => ({
                ...prevState,
                _id: delivery._id,
                deliveryClient: delivery.deliveryClient,
                deliveryDate: delivery.deliveryDate,
                contactPhone: delivery.contactPhone,
                address: delivery.address,
                coordinates: delivery.coordinates,
                productName: delivery.productName,
                productQuantity: delivery.productQuantity,
                notes: delivery.notes,
                directions: delivery.directions,
                hasPaid: delivery.hasPaid,
                directionsReminder: delivery.directionsReminder,
                completed: delivery.completed,
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // If a deliveryClient is present, render its contents via FormData
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
                productName,
                productQuantity,
                notes,
                directions: selectedDeliveryClient.directions,
            }))
        }
    }, [
        delivery,
        deliveryClients.data,
        selectedDeliveryClient,
        notes,
        productName,
        productQuantity,
    ])

    return (
        <section>
            <Button
                icon="pi pi-pencil"
                iconPos="left"
                onClick={() => setFormDialog(true)}
            />

            <Dialog
                id="editDeliveryDialog"
                visible={formDialog}
                header={deliveryDialogHeader}
                footer={deliveryDialogFooter}
                onHide={onClose}
                style={{ width: '900px' }}
                blockScroll
            >
                <form onSubmit={onSubmit}>
                    {/* DELIVERY CLIENT, DELIVERY DATE */}
                    <div className="formgrid grid">
                        {/* _ID */}
                        <div className="formgrid grid">
                            <div
                                className="field col"
                                style={{ display: 'none' }}
                            >
                                <div style={{ margin: '0.8em 0' }}>
                                    <span className="p-float-label">
                                        <InputText
                                            id="_id"
                                            name="_id"
                                            value={_id}
                                            placeholder="ID"
                                            onChange={onChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="_id">ID</label>
                                    </span>
                                </div>
                            </div>
                        </div>

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
                                        optionLabel={driverOptionLabelTemplate}
                                        optionValue="_id"
                                        value={deliveryClient}
                                        options={deliveryClients.data}
                                        itemTemplate={clientOptionTemplate}
                                        // valueTemplate={selectedClientTemplate}
                                        filter
                                        filterBy="firstName"
                                        onChange={(e) => {
                                            setSelectedDeliveryClient(e.value)
                                            onChange(e)
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
                                        value={new Date(deliveryDate)}
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
                                        placeholder="Contact Phone(s) *"
                                        onChange={onChange}
                                        rows={4}
                                        cols={30}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                    <label htmlFor="contactPhone">
                                        Contact Phone(s) *
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
                                        placeholder="Products *"
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
                                        placeholder="Material(s) *"
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
                                        rows={4}
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
                                        placeholder="Enter notes"
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
                        <div className="field col">
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
                        </div>

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
        </section>
    )
}

export default DeliveryForm
