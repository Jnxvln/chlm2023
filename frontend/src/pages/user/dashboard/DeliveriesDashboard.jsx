import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import ClientSearchInput from '../../../components/user/dashboard/deliveries/ClientSearchInput'
import EditDeliveryClientForm from '../../../components/user/dashboard/deliveries/EditDeliveryClientForm'
import EditDeliveryForm from '../../../components/user/dashboard/deliveries/EditDeliveryForm'
import DeliveryForm from '../../../components/user/dashboard/deliveries/DeliveryForm'
import DeliveryTimeframeSelector from '../../../components/user/dashboard/deliveries/DeliveryTimeframeSelector'
import TestClientSearch from '../../../components/user/dashboard/deliveries/TestClientSearch'
// PrimeReact Components
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { OverlayPanel } from 'primereact/overlaypanel'
import { InputText } from 'primereact/inputtext'
import { Tooltip } from 'primereact/tooltip'
import { ContextMenu } from 'primereact/contextmenu'
import { FilterMatchMode } from 'primereact/api'
import { ConfirmPopup } from 'primereact/confirmpopup' // To use <ConfirmPopup> tag
import { confirmPopup } from 'primereact/confirmpopup' // To use confirmPopup method
import { ToggleButton } from 'primereact/togglebutton'
// Store data
import { fetchUser } from '../../../api/users/usersApi'
import {
    getDeliveries,
    updateDelivery,
    deleteDelivery,
} from '../../../api/deliveries/deliveriesApi'
import { getDeliveryClients } from '../../../api/deliveryClients/deliveryClientsApi'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { createSearchParams, useNavigate } from 'react-router-dom'
import DeliveryClientForm from '../../../components/user/dashboard/deliveries/DeliveryClientForm'

function DeliveriesDashboard() {
    // #region VARS ==============================================================
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const deliveryClientOverlayPanel = useRef(null)
    const [toggleShowCompleted, setToggleShowCompleted] = useState(
        localStorage.getItem('toggleShowDeliveriesCompleted') === 'true'
            ? true
            : false
    )
    const [rangeDates, setRangeDates] = useState([])
    const [filteredDeliveries, setFilteredDeliveries] = useState([])
    const [selectedClient, setSelectedClient] = useState(null)
    const [selectedClientId, setSelectedClientId] = useState('')
    const [selectedClientAvatar, setSelectedClientAvatar] = useState(null)
    const [deliveryRowSelected, setDeliveryRowSelected] = useState(null)
    const [globalFilterValue, setGlobalFilterValue] = useState('')
    const [copyCoordinates, setCopyCoordinates] = useState('')
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        productName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        address: { value: null, matchMode: FilterMatchMode.CONTAINS },
        contactName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        contactPhone: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const deliveryMapMarkerReference = useRef(null)
    const clientAvatarContextMenuReference = useRef(null)
    const deliveryMarkerContextMenuItems = [
        {
            label: 'Copy coordinates',
            icon: 'pi pi-copy',
            command: () => {
                const coords = `${copyCoordinates[0]},${copyCoordinates[1]}`
                navigator.clipboard.writeText(coords)
                toast.success('Coordinates copied!')
            },
        },
    ]

    const clientAvatarContextMenuItems = [
        {
            label: 'Copy Name',
            icon: 'pi pi-user',
            command: () => {
                const clientName = `${selectedClientAvatar.firstName} ${selectedClientAvatar.lastName}`
                navigator.clipboard.writeText(clientName)
                toast.success(`${clientName} copied!`)
            },
        },
        {
            label: 'Copy Phone(s)',
            icon: 'pi pi-phone',
            command: () => {
                navigator.clipboard.writeText(selectedClientAvatar.phone)
                toast.success(`${selectedClientAvatar.phone} copied!`)
            },
        },
        {
            label: 'Copy Address',
            icon: 'pi pi-map',
            command: () => {
                navigator.clipboard.writeText(selectedClientAvatar.address)
                toast.success(`${selectedClientAvatar.address} copied!`)
            },
        },
        {
            label: 'Copy Coordinates',
            icon: 'pi pi-globe',
            command: () => {
                const copyCoords = selectedClientAvatar.coordinates.split(', ')
                const coords = `${copyCoords[0]},${copyCoords[1]}`
                navigator.clipboard.writeText(coords)
                toast.success(`Coordinates copied!`)
            },
        },
    ]

    const user = useQuery(['user'], fetchUser)

    // Pull in delivery state
    const deliveries = useQuery({
        queryKey: ['deliveries'],
        queryFn: () => getDeliveries(user.data.token),
        onError: (err) => {
            console.log('Error fetching deliveries: ')
            console.log(err)
        },
    })

    // Pull in delivery client state
    const deliveryClients = useQuery({
        queryKey: ['deliveryClients'],
        queryFn: () => getDeliveryClients(user.data.token),
        onError: (err) => {
            console.log('Error fetching delivery clients: ')
            console.log(err)
        },
    })

    const mutationDeleteDelivery = useMutation({
        mutationKey: ['deliveries'],
        mutationFn: ({ id, token }) => deleteDelivery(id, token),
        onSuccess: (delId) => {
            if (delId) {
                toast.success('Delivery deleted', { autoClose: 1000 })
                queryClient.invalidateQueries(['deliveries'])
            }
        },
        onError: (err) => {
            console.log('Error deleting delivery: ')
            console.log(err)
        },
    })

    const mutationToggleCompleted = useMutation({
        mutationKey: ['deliveries'],
        mutationFn: ({ data, token }) => updateDelivery(data, token),
        onSuccess: (updDelivery) => {
            if (updDelivery) {
                toast.success('Delivery updated', { autoClose: 1000 })
                queryClient.invalidateQueries(['deliveries'])
            }
        },
        onError: (err) => {
            console.log('Error updating delivery')
            console.log(err)
            toast.error('Error updating delivery', { autoClose: 8000 })
        },
    })

    const mutationToggleHasPaid = useMutation({
        mutationKey: ['deliveries'],
        mutationFn: ({ data, token }) => updateDelivery(data, token),
        onSuccess: (updDelivery) => {
            if (updDelivery) {
                toast.success('Delivery updated', { autoClose: 1000 })
                queryClient.invalidateQueries(['deliveries'])
            }
        },
        onError: (err) => {
            console.log('Error updating delivery')
            console.log(err)
            toast.error('Error updating delivery', { autoClose: 8000 })
        },
    })
    // #endregion

    // Class style based on delivery completed or not
    const pastDueClass = (rowData) => {
        // Determine difference between today and deliveryDate
        const today = dayjs()
        const deliveryDate =
            rowData && rowData.deliveryDate ? dayjs(rowData.deliveryDate) : null

        const diff = deliveryDate.diff(today, 'second')

        // If past due or completed, apply class style accordingly

        if (
            today.format('MM/DD/YYYY') ===
            dayjs(rowData.deliveryDate).format('MM/DD/YYYY')
        ) {
            // Delivery is today, return no styling
            return ''
        }

        if (diff <= 0) {
            if (!rowData.completed) {
                return 'dlv-past-due'
            } else {
                // Already completed
                return 'dlv-completed'
            }
        } else {
            return ''
        }
    }

    // #region COMPONENT TEMPLATES ==============================================================
    const dataTableHeaderTemplate = () => {
        // console.log(
        //     '[DeliveriesDashboard dataTableHeaderTemplate]: selectedClient: '
        // )
        // console.log(selectedClient)

        return (
            <div className="flex justify-content-between">
                <div>
                    <div className="flex gap-4">
                        {/* <ClientSearchInput
                            onClientSelected={onClientSelected}
                        /> */}

                        <TestClientSearch
                            onClientSelected={onClientSelected}
                            selectedClient={selectedClient}
                        />

                        {selectedClient && (
                            <DeliveryForm
                                selectedClient={selectedClient}
                                onResetFilteredDeliveries={
                                    onResetFilteredDeliveries
                                }
                            />
                        )}

                        {selectedClient && (
                            <EditDeliveryClientForm
                                deliveryClientToEdit={selectedClient}
                                onSetDeliveryClient={onSetDeliveryClient}
                                onResetFilteredDeliveries={
                                    onResetFilteredDeliveries
                                }
                            />
                        )}

                        <DeliveryTimeframeSelector
                            onDateRangeSelected={onDateRangeSelected}
                        />
                        <ToggleButton
                            checked={toggleShowCompleted}
                            onChange={(e) => setToggleShowCompleted(e.value)}
                            onIcon="pi pi-eye"
                            offIcon="pi pi-eye-slash"
                            onLabel="Showing Completed"
                            offLabel="Hiding Completed"
                        />
                    </div>
                </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Phone, address, or product name"
                    />
                </span>
            </div>
        )
    }

    const onSetDeliveryClient = (client) => {
        onClientSelected(client)
    }

    const deliveryDateTemplate = (rowData) => {
        return (
            <div className={pastDueClass(rowData)}>
                {dayjs(rowData.deliveryDate).format('ddd MM/DD/YY')}
            </div>
        )
    }

    const deliveryClientTemplate = (rowData) => {
        const _client =
            deliveryClients &&
            deliveryClients.data &&
            deliveryClients.data.find(
                (client) => client._id === rowData.deliveryClient
            )

        return (
            <>
                <Avatar
                    icon="pi pi-user"
                    onClick={(e) => {
                        setSelectedClientId(rowData.deliveryClient)
                        deliveryClientOverlayPanel.current.toggle(e)
                    }}
                />
                {_client && (
                    <span
                        className={pastDueClass(rowData)}
                        style={{ marginLeft: '0.5em' }}
                    >
                        {_client.companyName ? (
                            <>{_client.companyName}</>
                        ) : (
                            <>
                                {_client.firstName} {_client.lastName}
                            </>
                        )}
                    </span>
                )}
            </>
        )
    }

    const addressTemplate = (rowData) => {
        return (
            <div style={{ whiteSpace: 'pre', color: '#075689 !important' }}>
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(
                        rowData.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                >
                    <span>{rowData.address}</span>
                </a>
            </div>
        )
    }

    // const contactNameTemplate = (rowData) => {
    //     return (
    //         <div className={pastDueClass(rowData)}>{rowData.contactName}</div>
    //     )
    // }

    const contactPhoneTemplate = (rowData) => {
        return (
            <div
                style={{ whiteSpace: 'pre' }}
                className={pastDueClass(rowData)}
            >
                {rowData.contactPhone}
            </div>
        )
    }

    const coordinatesTemplate = (rowData) => {
        if (rowData.coordinates) {
            const parts = rowData.coordinates.replace(/ /g, '').split(',')
            const coords = [
                parseFloat(parts[0]).toFixed(6),
                parseFloat(parts[1]).toFixed(6),
            ]

            return (
                <>
                    <ContextMenu
                        model={deliveryMarkerContextMenuItems}
                        ref={deliveryMapMarkerReference}
                    ></ContextMenu>
                    <a
                        href={`https://maps.google.com/?q=${coords[0]},${coords[1]}`}
                        target="_blank"
                        rel="noreferrer"
                        onContextMenu={(e) => {
                            setCopyCoordinates(coords)
                            deliveryMapMarkerReference.current.show(e)
                        }}
                    >
                        <Tooltip target=".deliveryMapMarker">
                            <span>
                                {coords[0]}, {coords[1]}
                            </span>
                        </Tooltip>
                        <i
                            className="pi pi-map-marker deliveryMapMarker"
                            tooltip="Coordinates"
                        />
                    </a>
                </>
            )
        } else {
            return <></>
        }
    }

    const productNameTemplate = (rowData) => {
        return (
            <div
                className={pastDueClass(rowData)}
                style={{ whiteSpace: 'pre' }}
            >
                {rowData.productName}
            </div>
        )
    }

    const productQuantityTemplate = (rowData) => {
        return (
            <div
                className={pastDueClass(rowData)}
                style={{ whiteSpace: 'pre' }}
            >
                {rowData.productQuantity}
            </div>
        )
    }

    const hasPaidTemplate = (rowData) => {
        return (
            <>
                {selectedClient ? (
                    <>
                        {/* <Tooltip target=".clickToToggle" /> */}
                        <div className="clickToToggle">
                            {Boolean(rowData.hasPaid) ? (
                                <i
                                    className="pi pi-check"
                                    style={{
                                        color: 'green',
                                        fontWeight: 'bold',
                                    }}
                                ></i>
                            ) : (
                                <i
                                    className="pi pi-dollar"
                                    style={{ color: 'red', fontWeight: 'bold' }}
                                ></i>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <Tooltip target=".clickToToggle" />
                        <div
                            onClick={() => handleToggleHasPaid(rowData)}
                            className="clickToToggle"
                            data-pr-tooltip="Click to toggle"
                        >
                            {Boolean(rowData.hasPaid) ? (
                                <i
                                    className="pi pi-check"
                                    style={{
                                        color: 'green',
                                        fontWeight: 'bold',
                                    }}
                                ></i>
                            ) : (
                                <i
                                    className="pi pi-dollar"
                                    style={{ color: 'red', fontWeight: 'bold' }}
                                ></i>
                            )}
                        </div>
                    </>
                )}
            </>
        )
    }

    const completedTemplate = (rowData) => {
        return (
            <>
                {selectedClient ? (
                    <>
                        {/* <Tooltip target=".clickToToggle" /> */}
                        <div className="clickToToggle">
                            {Boolean(rowData.completed) ? (
                                <i
                                    className="pi pi-check"
                                    style={{
                                        color: 'green',
                                        fontWeight: 'bold',
                                    }}
                                ></i>
                            ) : (
                                <i
                                    className="pi pi-times"
                                    style={{ color: 'red', fontWeight: 'bold' }}
                                ></i>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <Tooltip target=".clickToToggle" />
                        <div
                            onClick={() => handleToggleCompleted(rowData)}
                            className="clickToToggle"
                            data-pr-tooltip="Click to toggle"
                        >
                            {Boolean(rowData.completed) ? (
                                <i
                                    className="pi pi-check"
                                    style={{
                                        color: 'green',
                                        fontWeight: 'bold',
                                    }}
                                ></i>
                            ) : (
                                <i
                                    className="pi pi-times"
                                    style={{ color: 'red', fontWeight: 'bold' }}
                                ></i>
                            )}
                        </div>
                    </>
                )}
            </>
        )
    }

    const actionsTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', gap: 10 }}>
                {!selectedClient && (
                    <EditDeliveryForm
                        delivery={rowData}
                        onResetFilteredDeliveries={onResetFilteredDeliveries}
                    />
                )}

                <Button
                    icon="pi pi-print"
                    className="p-button-darkGray"
                    onClick={(e) => printDelivery(rowData)}
                />

                {!selectedClient && (
                    <Button
                        icon="pi pi-trash"
                        className="p-button-danger"
                        onClick={(e) => onDelete(e, rowData)}
                    />
                )}
            </div>
        )
    }

    const onResetFilteredDeliveries = () => {
        console.log('[DeliveriesDashboard.jsx onResetFilteredDeliveries]: ')
        setSelectedClient(null)
    }
    // #endregion

    // #region FILTERS ==============================================================
    const onGlobalFilterChange = (e) => {
        const value = e.target.value
        let _filters = { ...filters }
        _filters['global'].value = value

        setFilters(_filters)
        setGlobalFilterValue(value)
    }

    // Initialize datatable filters
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            productName: { value: null, matchMode: FilterMatchMode.CONTAINS },
            address: { value: null, matchMode: FilterMatchMode.CONTAINS },
            contactName: { value: null, matchMode: FilterMatchMode.CONTAINS },
            contactPhone: { value: null, matchMode: FilterMatchMode.CONTAINS },
        })

        setGlobalFilterValue('')
    }
    // #endregion

    // #region ACTION HANDLERS ==============================================================
    // Delete delivery confirmation
    const onDelete = (e, rowData) => {
        confirmPopup({
            target: e.target,
            message: `Delete this delivery?`,
            icon: 'pi pi-exclamation-triangle',
            accept: () =>
                mutationDeleteDelivery.mutate({
                    id: rowData._id,
                    token: user.data.token,
                }),
            reject: () => null,
        })
    }

    // Toggle delivery completed
    const handleToggleCompleted = (delivery) => {
        const updDelivery = { ...delivery, completed: !delivery.completed }

        mutationToggleCompleted.mutate({
            data: updDelivery,
            token: user.data.token,
        })
    }

    // Toggle delivery paid
    const handleToggleHasPaid = (delivery) => {
        const updDelivery = { ...delivery, hasPaid: !delivery.hasPaid }

        mutationToggleHasPaid.mutate({
            data: updDelivery,
            token: user.data.token,
        })
    }

    // Handle DateRangeSelector component operations
    const onDateRangeSelected = (e) => {
        let dateStart // e.value[0]
        let dateEnd // e.value[1]

        if (!e || !e.value) {
            // Clear ranges and filteredDeliveries (DataTable will default to `deliveries`). Used when clear button pressed
            // console.log(
            //     '[onDateRangeSelected] setting range dates to [] and firing setFilteredDeliveries([])'
            // )
            setRangeDates([])
            setFilteredDeliveries([])
            return
        }

        if (e.value[0] && e.value[1]) {
            // Convert event values to dayjs dates
            dateStart = dayjs(e.value[0])
            dateEnd = dayjs(e.value[1])

            // Get difference between start and end dates
            const difference = dateEnd.diff(dateStart, 'day')

            // Create an array of dates including start and end dates
            let dates = []
            for (let i = 0; i < difference + 1; i++) {
                dates.push(new Date(dateStart.add(i, 'day')).toDateString()) // toDateString format is used here for ease of comparing dates in another function
            }

            // Set rangeDates in state to this array
            setRangeDates(dates)
        }
    }

    // Handle client selected, show client's deliveries
    const onClientSelected = (clientSelected) => {
        if (
            !clientSelected ||
            clientSelected === undefined ||
            clientSelected === '' ||
            clientSelected === null
        ) {
            setSelectedClient(null)
            setFilteredDeliveries([])
            setFilteredDeliveriesToLocalStorageRange()
        } else {
            setSelectedClient(clientSelected)

            // localStorage.setItem(
            //     'selectedDeliveryClient',
            //     JSON.stringify(clientSelected)
            // )

            // If the user clicks on a delivery client in the list, show all of this customer's deliveries
            if (clientSelected && clientSelected.hasOwnProperty('_id')) {
                setSelectedClientId(clientSelected._id)
                const clientDeliveries =
                    deliveries && deliveries.data
                        ? deliveries.data.filter(
                              (dlv) => dlv.deliveryClient === clientSelected._id
                          )
                        : []

                if (clientDeliveries && clientDeliveries.length > 0) {
                    // console.log(
                    //     '[onClientSelected()]: Setting filteredDeliveries to client deliveries'
                    // )
                    setFilteredDeliveries(clientDeliveries)
                } else {
                    toast.warning('No deliveries for this client')
                    setFilteredDeliveries([])
                    return []
                }
            } else {
                // Otherwise set deliveries back to date range selected
                // console.log(
                //     '[onClientSelected()]: clientSelected is falsey or is missing _id property. Firing setFilteredDeliveriesToDateRange'
                // )
                setFilteredDeliveriesToDateRange()
            }
        }
    }

    // Print delivery
    const printDelivery = (rowData) => {
        navigate({
            pathname: '/deliveries/print',
            search: `?${createSearchParams(rowData)}`,
        })
    }
    // #endregion

    const setFilteredDeliveriesToDateRange = () => {
        if (!selectedClient && rangeDates && rangeDates.length > 0) {
            // console.log('Firing setFilteredDeliveriesToDateRange')
            // Filter deliveries by date range (rangeDates)
            // let _selectedDriverId = localStorage.getItem("selectedDriverId") || null;

            // Filter deliveries within selected date range
            let _filteredDeliveries =
                deliveries && deliveries.data
                    ? deliveries.data.filter((delivery) =>
                          rangeDates.includes(
                              new Date(delivery.deliveryDate).toDateString()
                          )
                      )
                    : []

            // console.log(
            //     'Firing setFilteredDeliverie based on toggleShowCompleted'
            // )
            setFilteredDeliveries(
                !toggleShowCompleted
                    ? _filteredDeliveries.filter((dlv) => !dlv.completed)
                    : _filteredDeliveries
            )
        }
    }

    const setFilteredDeliveriesToLocalStorageRange = () => {
        setSelectedClient(null)
        if (localStorage.getItem('selectedDeliveriesDateRange')) {
            // console.log(
            //     '[setFilteredDeliveriesToLocalStorageRange()]: Setting filteredDeliveries to all deliveries in selected date range'
            // )
            const _deliveriesDateRange = JSON.parse(
                localStorage.getItem('selectedDeliveriesDateRange')
            )

            if (_deliveriesDateRange.length > 0) {
                // Manually call onDateRangeSelected, passing in a pseudo-event object based on localStorage values
                let e = {
                    value: [
                        new Date(_deliveriesDateRange[0]),
                        new Date(_deliveriesDateRange[1]),
                    ],
                }
                // console.log(
                //     '[setFilteredDeliveriesToLocalStorageRange]: Firing onRangeSelected'
                // )
                onDateRangeSelected(e)
            }
        }
    }

    // #region USE EFFECTS ==============================================================
    // RUN ONCE - INIT FILTERS
    useEffect(() => {
        initFilters()
        setFilteredDeliveriesToLocalStorageRange()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Watch for selectedClientId in order to show said client's deliveries
    useEffect(() => {
        // Check for selected client avatar (in Deliveries DataTable)
        if (selectedClientId) {
            const client =
                deliveryClients &&
                deliveryClients.data &&
                deliveryClients.data.find(
                    (client) => client._id === selectedClientId
                )
            setSelectedClientAvatar(client)
        }

        setFilteredDeliveriesToDateRange()
    }, [
        deliveries.data,
        deliveryClients.data,
        selectedClientId,
        rangeDates,
        rangeDates.length,
    ])

    useEffect(() => {
        // Set localStorage value
        localStorage.setItem(
            'toggleShowDeliveriesCompleted',
            toggleShowCompleted
        )

        if (toggleShowCompleted) {
            // Set selected client avatar
            if (selectedClientId) {
                const client =
                    deliveryClients &&
                    deliveryClients.data &&
                    deliveryClients.data.find(
                        (client) => client._id === selectedClientId
                    )
                setSelectedClientAvatar(client)
            }

            // Then set deliveries to current date range

            if (!selectedClient) {
                setFilteredDeliveriesToDateRange()
            } else {
                let _filteredDeliveries

                // console.log('selectedClient: ')
                // console.log(selectedClient)

                if (deliveries && deliveries.data) {
                    _filteredDeliveries = deliveries.data.filter(
                        (dlv) => dlv.deliveryClient === selectedClient._id
                    )
                    // console.log('COMPLETED _filteredDeliveries: ')
                    // console.log(_filteredDeliveries)

                    setFilteredDeliveries(_filteredDeliveries)
                }
            }
        } else {
            // console.log(
            //     '[useEffect toggleShowCompleted]: toggleShowCompleted is FALSE, only showing deliveries that are NOT completed'
            // )

            if (!selectedClient) {
                setFilteredDeliveriesToDateRange()
            } else {
                let _filteredDeliveries

                // console.log('selectedClient: ')
                // console.log(selectedClient)

                if (deliveries && deliveries.data) {
                    _filteredDeliveries = deliveries.data.filter(
                        (dlv) =>
                            dlv.deliveryClient === selectedClient._id &&
                            dlv.completed === false
                    )
                    // console.log('NOT COMPLETED _filteredDeliveries: ')
                    // console.log(_filteredDeliveries)
                }

                setFilteredDeliveries(_filteredDeliveries)
            }
        }
    }, [toggleShowCompleted])
    // #endregion

    return (
        <section>
            <h1 style={{ textAlign: 'center', fontSize: '20pt' }}>
                C&H Deliveries
            </h1>
            {selectedClient && (
                <div>
                    <p>
                        <strong style={{ color: 'red', fontSize: '1.3rem' }}>
                            Showing deliveries for:
                            <br />
                            {selectedClient.firstName} {selectedClient.lastName}{' '}
                            {selectedClient.companyName ? (
                                <span>({selectedClient.companyName})</span>
                            ) : null}
                        </strong>
                    </p>
                </div>
            )}

            <ConfirmPopup />

            {/* Client right-click overlay panel */}
            <OverlayPanel ref={deliveryClientOverlayPanel} showCloseIcon>
                <ContextMenu
                    model={clientAvatarContextMenuItems}
                    ref={clientAvatarContextMenuReference}
                ></ContextMenu>
                {selectedClientAvatar && (
                    <section
                        onContextMenu={(e) => {
                            clientAvatarContextMenuReference.current.show(e)
                        }}
                    >
                        {/* Render First & Last Name */}
                        {selectedClientAvatar &&
                            selectedClientAvatar.firstName &&
                            selectedClientAvatar.lastName && (
                                <div style={{ marginBottom: '0.6em' }}>
                                    <strong>Name:</strong>{' '}
                                    {selectedClientAvatar.firstName}{' '}
                                    {selectedClientAvatar.lastName}
                                </div>
                            )}

                        {/* Render phone */}
                        {selectedClientAvatar && selectedClientAvatar.phone && (
                            <div style={{ marginBottom: '0.6em' }}>
                                <strong>Phone(s):</strong>{' '}
                                <div style={{ whiteSpace: 'pre' }}>
                                    {selectedClientAvatar.phone}
                                </div>
                            </div>
                        )}

                        {/* Render address */}
                        {selectedClientAvatar &&
                            selectedClientAvatar.address && (
                                <div style={{ marginBottom: '0.6em' }}>
                                    <strong>Address:</strong>{' '}
                                    <div style={{ whiteSpace: 'pre' }}>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(
                                                selectedClientAvatar.address
                                            )}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <span
                                                style={{
                                                    color: '#075689',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {selectedClientAvatar.address}
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            )}

                        {/* Render company */}
                        {selectedClientAvatar &&
                            selectedClientAvatar.company && (
                                <div style={{ marginBottom: '0.6em' }}>
                                    <strong>Company:</strong>{' '}
                                    <div style={{ whiteSpace: 'pre' }}>
                                        {selectedClientAvatar.company}
                                    </div>
                                </div>
                            )}

                        {/* Render coordinates */}
                        {selectedClientAvatar &&
                            selectedClientAvatar.coordinates && (
                                <div style={{ marginBottom: '0.6em' }}>
                                    <strong>Coords:</strong>{' '}
                                    <div style={{ whiteSpace: 'pre' }}>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${selectedClientAvatar.coordinates}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {selectedClientAvatar.coordinates}
                                        </a>
                                    </div>
                                </div>
                            )}

                        {/* Render Edit Button */}
                        {selectedClientAvatar && (
                            <EditDeliveryClientForm
                                deliveryClientToEdit={selectedClientAvatar}
                                onSetDeliveryClient={onSetDeliveryClient}
                                onResetFilteredDeliveries={
                                    onResetFilteredDeliveries
                                }
                            />
                        )}
                    </section>
                )}
            </OverlayPanel>

            <div className="datatable-templating-demo">
                <div className="card" style={{ height: 'calc(100vh - 145px)' }}>
                    <DataTable
                        value={filteredDeliveries}
                        loading={deliveries.isLoading}
                        header={dataTableHeaderTemplate}
                        globalFilterFields={[
                            'productName',
                            'address',
                            'contactName',
                            'contactPhone',
                        ]}
                        scrollable
                        autoLayout
                        responsiveLayout="scroll"
                        size="small"
                        scrollHeight="flex"
                        removableSort
                        filter="true"
                        filters={filters}
                        filterDisplay="row"
                        onFilter={(e) => setFilters(e.filters)}
                        selectionMode="single"
                        selection={deliveryRowSelected}
                        sortField="deliveryDate"
                        sortOrder={1}
                        onSelectionChange={(e) =>
                            setDeliveryRowSelected(e.value)
                        }
                        dataKey="_id"
                        stateStorage="session"
                        stateKey="dt-deliveries-session"
                        emptyMessage="No deliveries found (if this wasn't expected, check if you're hiding completed deliveries)"
                        stripedRows
                    >
                        {/* Has Paid */}
                        <Column
                            field="hasPaid"
                            header="Paid?"
                            body={hasPaidTemplate}
                            style={{ maxWidth: '4em' }}
                        ></Column>

                        {/* Delivery Date */}
                        <Column
                            field="deliveryDate"
                            header="Deliver"
                            body={deliveryDateTemplate}
                            style={{ maxWidth: '9em' }}
                            sortable
                        ></Column>

                        {/* Delivery Client */}
                        <Column
                            field="deliveryClient"
                            header="Client"
                            body={deliveryClientTemplate}
                        ></Column>

                        {/* Product Name */}
                        <Column
                            field="productName"
                            header="Material"
                            body={productNameTemplate}
                        ></Column>

                        {/* Product Quantity */}
                        <Column
                            field="productQuantity"
                            header="Qty"
                            body={productQuantityTemplate}
                            style={{ maxWidth: '6em' }}
                        ></Column>

                        {/* Address */}
                        <Column
                            field="address"
                            header="Address"
                            body={addressTemplate}
                        ></Column>

                        {/* Contact Name */}
                        {/* <Column
                            field="contactName"
                            header="Contact Name"
                            body={contactNameTemplate}
                        ></Column> */}

                        {/* Contact  Phone */}
                        <Column
                            field="contactPhone"
                            header="Contact Phone"
                            body={contactPhoneTemplate}
                        ></Column>

                        {/* Coordinates */}
                        <Column
                            field="coordinates"
                            header="Coords"
                            body={coordinatesTemplate}
                            style={{ maxWidth: '6em' }}
                        ></Column>

                        {/* Completed */}
                        <Column
                            field="completed"
                            header="Completed?"
                            body={completedTemplate}
                        ></Column>

                        {/* Actions */}
                        <Column
                            header="Actions"
                            body={actionsTemplate}
                        ></Column>
                    </DataTable>
                </div>
            </div>
        </section>
    )
}

export default DeliveriesDashboard
