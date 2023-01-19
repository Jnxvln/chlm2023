import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import DialogHeader from '../../../dialogComponents/DialogHeader'
import DialogFooter from '../../../dialogComponents/DialogFooter_SubmitClose'
import HaulFromSelector from './HaulFromSelector'
import HaulToSelector from './HaulToSelector'
import HaulLocationSelector from './HaulLocationSelector'
import HaulVendorProductSelector from './HaulMaterialSelector'
// PrimeReact Components
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { confirmPopup } from 'primereact/confirmpopup' // To use confirmPopup method

// Store data
import { fetchUser } from '../../../../api/users/usersApi'
import {
    getHauls,
    updateHaul,
    createHaul,
} from '../../../../api/hauls/haulsApi'
import { getVendors } from '../../../../api/vendors/vendorsApi'
import { getVendorProducts } from '../../../../api/vendorProducts/vendorProductsApi'
import { getVendorLocations } from '../../../../api/vendorLocations/vendorLocationsApi'
import { getFreightRoutes } from '../../../../api/freightRoutes/freightRoutesApi'
import { getDrivers } from '../../../../api/drivers/driversApi'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

function EditHaulForm({ haul, selectedDriverId, isDuplicating }) {
    // #region VARS --------------------------------------------------------------------

    const queryClient = useQueryClient()

    const initialState = {
        _id: '',
        driver: undefined,
        dateHaul: undefined,
        truck: '',
        broker: '',
        chInvoice: '',
        loadType: '',
        invoice: '',
        from: '',
        vendorLocation: '',
        to: '',
        product: '',
        tons: null,
        rate: null,
        miles: null,
        payRate: null,
    }

    const loadTypeOptions = [
        { label: 'End Dump', value: 'enddump' },
        { label: 'Flatbed (%)', value: 'flatbedperc' },
        { label: 'Flatbed (mi)', value: 'flatbedmi' },
    ]

    const [formDialog, setFormDialog] = useState(false)
    const [formData, setFormData] = useState(initialState)
    const [vendorSelected, setVendorSelected] = useState(null)
    const [vendorProductSelected, setVendorProductSelected] = useState(null)
    const [vendorLocationSelected, setVendorLocationSelected] = useState(null)
    const [offDuty, setOffDuty] = useState(false)

    const user = useQuery(['user'], fetchUser)

    // Select hauls from store
    const hauls = useQuery({
        queryKey: ['hauls'],
        queryFn: () => getHauls(user.data.token),
        onError: (err) => {
            const errMsg = 'Error fetching hauls'
            console.log(errMsg)
            console.log(err)
            toast.error(errMsg, { autoClose: false })
        },
    })

    // Select drivers from store
    const drivers = useQuery({
        queryKey: ['drivers'],
        queryFn: () => getDrivers(user.data.token),
        onError: (err) => {
            const errMsg = 'Error fetching drivers'
            console.log(errMsg)
            console.log(err)
            toast.error(errMsg, { autoClose: false })
        },
    })

    // Select vendors from store
    const vendors = useQuery({
        queryKey: ['vendors'],
        queryFn: () => getVendors(user.data.token),
        onError: (err) => {
            const errMsg = 'Error fetching vendors'
            console.log(errMsg)
            console.log(err)
            toast.error(errMsg, { autoClose: false })
        },
    })

    // Select vendor products from store
    const vendorProducts = useQuery({
        queryKey: ['vendorProducts'],
        queryFn: () => getVendorProducts(user.data.token),
        onError: (err) => {
            const errMsg = 'Error fetching vendor products'
            console.log(errMsg)
            console.log(err)
            toast.error(errMsg, { autoClose: false })
        },
    })

    // Select vendor locations from store
    const vendorLocations = useQuery({
        queryKey: ['vendorLocations'],
        queryFn: () => getVendorLocations(user.data.token),
        onError: (err) => {
            const errMsg = 'Error fetching vendor locations'
            console.log(errMsg)
            console.log(err)
            toast.error(errMsg, { autoClose: false })
        },
    })

    // Select freight routes from store
    const freightRoutes = useQuery({
        queryKey: ['freightRoutes'],
        queryFn: () => getFreightRoutes(user.data.token),
        onError: (err) => {
            const errMsg = 'Error fetching freightRoutes'
            console.log(errMsg)
            console.log(err)
            toast.error(errMsg, { autoClose: false })
        },
    })

    const mutationUpdateHaul = useMutation({
        mutationKey: ['hauls'],
        mutationFn: ({ formData, token }) => updateHaul(formData, token),
        onMutate: ({ formData }) => {
            // formData.timeHaul = new Date(formData.timeHaul)
            // formData.dateHaul = new Date(formData.dateHaul).setHours(0, 0, 0, 0)
            formData.timeHaul = new Date(formData.dateHaul)
            formData.dateHaul = new Date(formData.dateHaul)
        },
        onSuccess: (updHaul) => {
            if (updHaul) {
                toast.success(`Haul invoice ${updHaul.invoice} updated`, {
                    autoClose: 3000,
                })
                queryClient.invalidateQueries(['hauls'])
            }
        },
        onError: (err) => {
            const errMsg = 'Error updating haul'
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

    const mutationCreateHaul = useMutation({
        mutationKey: ['hauls'],
        onMutate: ({ formData }) => {
            formData.timeHaul = new Date(formData.dateHaul)
            formData.dateHaul = new Date(formData.dateHaul)
        },
        mutationFn: ({ formData, token }) => createHaul(formData, token),
        onSuccess: (haul) => {
            if (haul) {
                toast.success(`Haul invoice ${haul.invoice} duplicated`, {
                    autoClose: 1000,
                })
                queryClient.invalidateQueries(['hauls'])
            }
        },
        onError: (err) => {
            const errMsg = 'Error duplicating haul'
            console.log(errMsg)
            console.log(err)

            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                toast.error(err.response.data.message, { autoClose: 8000 })
            } else {
                toast.error(errMsg, { autoClose: 8000 })
            }
        },
    })

    // Destructure form data
    const {
        _id,
        driver,
        timeHaul,
        dateHaul,
        truck,
        broker,
        chInvoice,
        loadType,
        invoice,
        from,
        vendorLocation,
        to,
        product,
        tons,
        rate,
        miles,
        payRate,
    } = formData
    // #endregion

    // #region COMPONENT RENDERERS ------------------------
    const haulDialogHeader = () => {
        return (
            <>
                {isDuplicating ? (
                    <DialogHeader
                        resourceType="Haul"
                        resourceName={`Inv ${haul.invoice}`}
                        isDuplicating
                    />
                ) : (
                    <DialogHeader
                        resourceType="Haul"
                        resourceName={`Inv ${haul.invoice}`}
                        isEdit
                    />
                )}
            </>
        )
    }

    const haulDialogFooter = () => {
        return (
            <DialogFooter
                onClose={onClose}
                onSubmit={onSubmit}
                isHaulDialog
                loadType={formData.loadType}
                onDrivingTime={onDrivingTime}
                onOffDuty={onOffDuty}
            />
        )
    }
    // #endregion

    // #region COMPONENT TEMPLATES ------------------------
    const driversItemTemplate = (rowData) => {
        return (
            <>
                {rowData.firstName} {rowData.lastName}
            </>
        )
    }

    const driverOptionLabelTemplate = (rowData) => {
        return (
            <>
                {rowData.firstName} {rowData.lastName}
            </>
        )
    }
    // #endregion

    // #region ACTION HANDLERS ------------------------
    // Handle form reset
    const resetForm = () => {
        if (haul) {
            if (isDuplicating) {
                setFormData((prevState) => ({
                    ...prevState,
                    _id: haul._id,
                    driver: haul.driver,
                    timeHaul: haul.timeHaul,
                    dateHaul: haul.dateHaul,
                    truck: haul.truck,
                    broker: haul.broker,
                    chInvoice: null,
                    loadType: haul.loadType,
                    vendorLocation: null,
                    invoice: null,
                    from: null,
                    to: null,
                    product: null,
                    tons: null,
                    rate: null,
                    miles: null,
                    payRate: null,
                }))
            } else {
                setFormData((prevState) => ({
                    ...prevState,
                    _id: haul._id,
                    driver: haul.driver,
                    timeHaul: haul.timeHaul,
                    dateHaul: haul.dateHaul,
                    truck: haul.truck,
                    broker: haul.broker,
                    chInvoice: haul.chInvoice,
                    loadType: haul.loadType,
                    invoice: haul.invoice,
                    from: haul.from,
                    to: haul.to,
                    product: haul.product,
                    tons: haul.tons,
                    rate: haul.rate,
                    miles: haul.miles,
                    payRate: haul.payRate,
                }))
            }
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

    const onVendorSelected = (selectedVendor) => {
        setFormData((prevState) => ({
            ...prevState,
            from: selectedVendor.name,
        }))
        setVendorSelected(selectedVendor)
    }

    const onVendorLocationSelected = (selectedVendorLocation) => {
        setFormData((prevState) => ({
            ...prevState,
            vendorLocation: selectedVendorLocation.name,
        }))
        setVendorLocationSelected(selectedVendorLocation)
    }

    const onVendorProductSelected = (selectedVendorProduct) => {
        setFormData((prevState) => ({
            ...prevState,
            product: selectedVendorProduct.name,
        }))
        setVendorProductSelected(selectedVendorProduct)
    }

    const onFreightRouteSelected = (selectedFreightRoute) => {
        setFormData((prevState) => ({
            ...prevState,
            to: selectedFreightRoute.destination,
            rate: selectedFreightRoute.freightCost,
        }))
        setVendorSelected(selectedFreightRoute)
    }

    const onDrivingTime = () => {
        // Confirm erase previous data
        confirmPopup({
            target: document.getElementById('showDrivingBtn'),
            message: 'Override existing data?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                setFormData((prevState) => ({
                    ...prevState,
                    broker: '-',
                    invoice: '-',
                    chInvoice: '-',
                    from: 'Driving',
                    to: 'Driving',
                    product: '-',
                    payRate: 0,
                    tons: 0,
                }))
            },
            reject: () => {},
        })
    }

    const onOffDuty = (val) => {
        setOffDuty(val)

        let _from
        let _to

        switch (val) {
            case 'maintenance':
                _from = 'Off Duty'
                _to = 'Maintenance'
                break

            case 'sick':
                _from = 'Off Duty'
                _to = 'Sick'
                break

            case 'holiday':
                _from = 'Off Duty'
                _to = prompt(
                    'Holiday name',
                    'Enter holiday name, keep it brief'
                )
                break

            case 'vacation':
                _from = 'Off Duty'
                _to = 'Vacation'
                break

            case 'weather':
                _from = 'Off Duty'
                _to = 'Weather'
                break

            case 'personal':
                _from = 'Off Duty'
                _to = 'Personal'
                break

            case 'bereavement':
                _from = 'Off Duty'
                _to = 'Bereavement'
                break

            case 'custom':
                _from = 'Off Duty'
                _to = prompt('Reason', 'Enter reason, keep it brief')
                break
        }

        if (loadType === 'flatbedperc' || loadType === 'flatbedmi') {
            setFormData((prevState) => ({
                ...prevState,
                broker: '-',
                invoice: '-',
                chInvoice: '-',
                from: _from,
                to: _to,
                product: '-',
                payRate: 0,
                tons: 0,
            }))
        } else if (loadType === 'enddump') {
            setFormData((prevState) => ({
                ...prevState,
                broker: '-',
                invoice: '-',
                chInvoice: '-',
                from: _from,
                to: _to,
                product: '-',
                rate: 0,
                tons: 0,
            }))
        } else {
            toast.error(
                "Unknown loadType selected, expecting 'enddump' or 'flatbed'",
                { autoClose: 8000 }
            )
        }
    }

    // Handle form submit
    const onSubmit = (e) => {
        e.preventDefault()

        if (!driver) {
            return toast.error('Driver is required')
        }

        if (!dateHaul) {
            return toast.error('Date is required')
        }

        if (!loadType) {
            return toast.error('Load type is required')
        }

        if (!invoice) {
            return toast.error('Load/Ref # is required')
        }

        if (!from) {
            return toast.error('From field is required')
        }

        if (!to) {
            return toast.error('To field is required')
        }

        if (!product) {
            return toast.error('Material is required')
        }

        if (isDuplicating) {
            mutationCreateHaul.mutate({ formData, token: user.data.token })
        } else {
            mutationUpdateHaul.mutate({ formData, token: user.data.token })
        }
        onClose()
    }
    // #endregion

    // Prefill form
    useEffect(() => {
        if (haul && isDuplicating) {
            setFormData((prevState) => ({
                ...prevState,
                _id: haul._id,
                driver: haul.driver,
                timeHaul: haul.timeHaul,
                dateHaul: haul.timeHaul,
                truck: haul.truck,
                broker: haul.broker,
                chInvoice: null,
                loadType: haul.loadType,
                invoice: null,
                from: haul.from,
                vendorLocation: null,
                to: null,
                product: null,
                tons: null,
                rate: null,
                miles: null,
                payRate: null,
            }))
            setVendorSelected(haul.from)
            setVendorLocationSelected(null)
            setVendorSelected(null)
            setVendorProductSelected(null)
        }

        if (haul && !isDuplicating) {
            setFormData((prevState) => ({
                ...prevState,
                _id: haul._id,
                driver: haul.driver,
                timeHaul: haul.timeHaul,
                dateHaul: haul.timeHaul,
                truck: haul.truck,
                broker: haul.broker,
                chInvoice: haul.chInvoice,
                loadType: haul.loadType,
                invoice: haul.invoice,
                from: haul.from,
                vendorLocation: haul.vendorLocation,
                to: haul.to,
                product: haul.product,
                tons: haul.tons,
                rate: haul.rate,
                miles: haul.miles,
                payRate: haul.payRate,
            }))
            setVendorSelected(haul.from)
            setVendorLocationSelected(haul.vendorLocation)
            setVendorSelected(haul.to)
            setVendorProductSelected(haul.product)
        }
    }, [])

    useEffect(() => {
        if (formDialog) {
            if (formDialog) {
                setTimeout(() => {
                    let dropdowns = document
                        .querySelectorAll('.p-autocomplete-dropdown')
                        .forEach((dropdown) => {
                            dropdown.tabIndex = -1
                        })
                }, 10)
            }

            if (haul) {
                const vendorObj = vendors.data.find(
                    (v) => v.name.toLowerCase() === haul.from.toLowerCase()
                )
                setVendorSelected(vendorObj)

                const vendorLocationObj = vendorLocations?.data?.find(
                    (loc) =>
                        loc?.name?.toLowerCase() ===
                        haul?.vendorLocation?.toLowerCase()
                )

                setVendorLocationSelected(vendorLocationObj)

                const productObj = vendorProducts.data.find(
                    (product) =>
                        product.name.toLowerCase() ===
                        haul.product.toLowerCase()
                )
                setVendorProductSelected(productObj)
            }
        }
    }, [formDialog])

    useEffect(() => {
        if (selectedDriverId) {
            setFormData((prevState) => ({
                ...prevState,
                driver: selectedDriverId,
            }))
        }
    }, [selectedDriverId])

    useEffect(() => {
        if (drivers.data && driver) {
            // Get the current driver as an object
            const driverObj = drivers.data.find((d) => d._id === driver)

            // Set the FormData's defaultTruck field to driverObj's defaultTruck & associated driver pay
            if (driverObj) {
                setFormData((prevState) => ({
                    ...prevState,
                    truck: driverObj.defaultTruck,
                }))

                // FEATURE NOT NEEDED - ONLY PULL DRIVER PAY FROM DRIVER PROFILE!
                // if (loadType === 'enddump' && isDuplicating) {
                //     setFormData((prevState) => ({
                //         ...prevState,
                //         driverPay: driverObj.endDumpPayRate,
                //     }))
                // }
                //
                // if (loadType === 'flatbedperc' && isDuplicating) {
                //     setFormData((prevState) => ({
                //         ...prevState,
                //         driverPay: driverObj.flatBedPayRate,
                //     }))
                // }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [haul, driver, drivers.data, loadType])

    return (
        <section>
            {isDuplicating ? (
                <Button
                    icon="pi pi-copy"
                    iconPos="left"
                    className="duplicateHaulBtn"
                    onClick={() => setFormDialog(true)}
                />
            ) : (
                <Button
                    icon="pi pi-pencil"
                    iconPos="left"
                    onClick={() => setFormDialog(true)}
                />
            )}

            <Dialog
                id="editHaulDialog"
                visible={formDialog}
                header={haulDialogHeader}
                footer={haulDialogFooter}
                onHide={onClose}
                blockScroll
            >
                <form onSubmit={onSubmit}>
                    {/* ID */}
                    <div className="formgrid grid">
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
                    </div>

                    {/* DRIVER, LOAD TYPE, TRUCK */}
                    <div className="formgrid grid">
                        {/* Driver */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <Dropdown
                                        name="driver"
                                        optionLabel={driverOptionLabelTemplate}
                                        optionValue="_id"
                                        value={driver}
                                        options={
                                            drivers &&
                                            drivers.data &&
                                            drivers.data.filter(
                                                (driver) =>
                                                    driver.isActive === true
                                            )
                                        }
                                        onChange={onChange}
                                        itemTemplate={driversItemTemplate}
                                        showClear
                                        placeholder="Choose..."
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="driver">Driver *</label>
                                </span>
                            </div>
                        </div>

                        {/* Load Type */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <Dropdown
                                        name="loadType"
                                        optionLabel="label"
                                        optionValue="value"
                                        value={loadType}
                                        options={loadTypeOptions}
                                        onChange={onChange}
                                        showClear
                                        placeholder="Choose..."
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="loadType">
                                        Load Type *
                                    </label>
                                </span>
                            </div>
                        </div>

                        {/* Truck */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputText
                                        id="truck"
                                        name="truck"
                                        value={truck}
                                        placeholder="Truck"
                                        onChange={onChange}
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="truck">Truck</label>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* DATE HAUL, CUSTOMER (BROKER), LOAD/REF # (invoice) */}
                    <div className="formgrid grid">
                        {/* Date Haul */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <Calendar
                                        id="dateHaul"
                                        name="dateHaul"
                                        value={new Date(dateHaul)}
                                        onChange={onChange}
                                        showTime
                                        hourFormat="12"
                                        selectOtherMonths
                                        style={{ width: '100%' }}
                                    ></Calendar>
                                    <label htmlFor="dateHaul">
                                        Haul Date *
                                    </label>
                                </span>
                            </div>
                        </div>

                        {/* Customer (broker) */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputText
                                        id="broker"
                                        name="broker"
                                        value={broker}
                                        placeholder="broker"
                                        onChange={onChange}
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="broker">Customer</label>
                                </span>
                            </div>
                        </div>

                        {/* Load/Ref # (invoice) */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputText
                                        id="invoice"
                                        name="invoice"
                                        value={invoice}
                                        placeholder="invoice"
                                        onChange={onChange}
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="invoice">Load/Ref# *</label>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CHINVOICE, FROM, TO */}
                    <div className="formgrid grid">
                        {/* chInvoice */}
                        {(loadType === 'flatbedperc' ||
                            loadType === 'flatbedmi') && (
                            <div className="field col">
                                <div style={{ margin: '0.8em 0' }}>
                                    <span className="p-float-label">
                                        <InputText
                                            id="chInvoice"
                                            name="chInvoice"
                                            value={chInvoice}
                                            placeholder="CH Invoice"
                                            onChange={onChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="chInvoice">
                                            CH Invoice
                                        </label>
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* From */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                {loadType !== 'flatbedperc' &&
                                loadType !== 'flatbedmi' ? (
                                    <HaulFromSelector
                                        value={from}
                                        vendors={vendors.data}
                                        onVendorSelected={onVendorSelected}
                                    />
                                ) : (
                                    <span className="p-float-label">
                                        <InputText
                                            id="from"
                                            name="from"
                                            value={from}
                                            placeholder="From"
                                            onChange={onChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="from">From *</label>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Vendor Location */}
                        {loadType !== 'flatbedperc' &&
                        loadType !== 'flatbedmi' ? (
                            <div className="field col">
                                <div style={{ margin: '0.8em 0' }}>
                                    <HaulLocationSelector
                                        value={vendorLocation}
                                        vendorLocations={vendorLocations.data}
                                        vendorSelected={vendorSelected}
                                        onVendorLocationSelected={
                                            onVendorLocationSelected
                                        }
                                    />
                                </div>
                            </div>
                        ) : null}

                        {/* To */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                {loadType !== 'flatbedperc' &&
                                loadType !== 'flatbedmi' ? (
                                    <HaulToSelector
                                        value={to}
                                        freightRoutes={freightRoutes.data}
                                        vendorLocationSelected={
                                            vendorLocationSelected
                                        }
                                        onFreightRouteSelected={
                                            onFreightRouteSelected
                                        }
                                    />
                                ) : (
                                    <span className="p-float-label">
                                        <InputText
                                            id="to"
                                            name="to"
                                            value={to}
                                            placeholder="to"
                                            onChange={onChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="to">To *</label>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* MATERIAL */}
                    <div className="formgrid grid">
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                {loadType !== 'flatbedperc' &&
                                loadType !== 'flatbedmi' ? (
                                    <HaulVendorProductSelector
                                        value={product}
                                        vendorProducts={vendorProducts.data}
                                        vendorLocationSelected={
                                            vendorLocationSelected
                                        }
                                        onVendorProductSelected={
                                            onVendorProductSelected
                                        }
                                    />
                                ) : (
                                    <span className="p-float-label">
                                        <InputText
                                            id="product"
                                            name="product"
                                            value={product}
                                            placeholder="Material"
                                            onChange={onChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="product">
                                            Material *
                                        </label>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RATE or PAY RATE, TONS, MILES, DRIVER PAY  */}
                    <div className="formgrid grid">
                        {/* Rate */}
                        {(loadType === 'enddump' ||
                            loadType === 'flatbedmi') && (
                            <div className="field col">
                                <div style={{ margin: '0.8em 0' }}>
                                    <label htmlFor="ncRate">Rate</label>
                                    <InputNumber
                                        id="rate"
                                        name="rate"
                                        value={rate}
                                        placeholder="Rate"
                                        mode="decimal"
                                        minFractionDigits={2}
                                        step={0.01}
                                        onChange={onChangeNumber}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Pay Rate */}
                        {loadType === 'flatbedperc' && (
                            <div className="field col">
                                <div style={{ margin: '0.8em 0' }}>
                                    <label htmlFor="payRate">Pay Rate</label>
                                    <InputNumber
                                        id="payRate"
                                        name="payRate"
                                        value={payRate}
                                        placeholder="Pay Rate"
                                        mode="decimal"
                                        minFractionDigits={2}
                                        step={0.01}
                                        onChange={onChangeNumber}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Tons */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <label htmlFor="tons">Tons</label>
                                <InputNumber
                                    id="tons"
                                    name="tons"
                                    value={tons}
                                    placeholder="Tons"
                                    mode="decimal"
                                    minFractionDigits={2}
                                    step={0.01}
                                    onChange={onChangeNumber}
                                    style={{ width: '100%' }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Miles */}
                        {loadType === 'flatbedmi' && (
                            <div className="field col">
                                <div style={{ margin: '0.8em 0' }}>
                                    <label htmlFor="miles">Miles</label>
                                    <InputNumber
                                        id="miles"
                                        name="miles"
                                        value={miles}
                                        placeholder="Miles"
                                        mode="decimal"
                                        minFractionDigits={2}
                                        step={0.01}
                                        onChange={onChangeNumber}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Driver Pay - FEATURE NOT NEEDED, ONLY PULL DRIVER PAY FROM DRIVER PROFILE! */}
                        {/* {loadType !== 'flatbedmi' && (
                            <div className="field col">
                                <div style={{ margin: '0.8em 0' }}>
                                    <label htmlFor="driverPay">
                                        Driver Pay
                                    </label>
                                    <InputNumber
                                        id="driverPay"
                                        name="driverPay"
                                        value={driverPay}
                                        placeholder="Driver Pay"
                                        mode="decimal"
                                        minFractionDigits={2}
                                        step={0.01}
                                        onChange={onChangeNumber}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                </div>
                            </div>
                        )} */}
                    </div>
                </form>
            </Dialog>
        </section>
    )
}

export default EditHaulForm
