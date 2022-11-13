import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import EditDeliveryClientForm from '../../../components/user/dashboard/deliveries/EditDeliveryClientForm'
import EditDeliveryForm from '../../../components/user/dashboard/deliveries/EditDeliveryForm'
import ClientSearchInput from '../../../components/user/dashboard/deliveries/ClientSearchInput'
import DeliveryTimeframeSelector from '../../../components/user/dashboard/deliveries/DeliveryTimeframeSelector'
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
// Store data
import { fetchUser } from '../../../api/users/usersApi'
import {
    getDeliveries,
    deleteDelivery,
} from '../../../api/deliveries/deliveriesApi'
import { getDeliveryClients } from '../../../api/deliveryClients/deliveryClientsApi'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

function DeliveriesDashboard() {
    // #region VARS ------------------------

    const queryClient = useQueryClient()

    const deliveryClientOverlayPanel = useRef(null)
    const [rangeDates, setRangeDates] = useState([])
    const [filteredDeliveries, setFilteredDeliveries] = useState([])
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

    // #endregion

    // #region COMPONENT TEMPLATES
    const dataTableHeaderTemplate = () => {
        return (
            <div className="flex justify-content-between">
                <div>
                    <div className="flex" style={{ gap: '1em' }}>
                        <ClientSearchInput />
                        <DeliveryTimeframeSelector
                            onDateRangeSelected={onDateRangeSelected}
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

    const deliveryDateTemplate = (rowData) => {
        return <>{dayjs(rowData.deliveryDate).format('MM/DD/YY')}</>
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
                    <span style={{ marginLeft: '0.5em' }}>
                        {_client.firstName} {_client.lastName}
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
                    style={{ textDecoration: 'none' }}
                >
                    <span>{rowData.address}</span>
                </a>
            </div>
        )
    }

    const contactNameTemplate = (rowData) => {
        return <>{rowData.contactName}</>
    }

    const contactPhoneTemplate = (rowData) => {
        return <div style={{ whiteSpace: 'pre' }}>{rowData.contactPhone}</div>
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
        return <>{rowData.productName}</>
    }

    const productQuantityTemplate = (rowData) => {
        return <>{rowData.productQuantity}</>
    }

    const hasPaidTemplate = (rowData) => {
        return (
            <div>
                {Boolean(rowData.hasPaid) ? (
                    <i
                        className="pi pi-check"
                        style={{ color: 'green', fontWeight: 'bold' }}
                    ></i>
                ) : (
                    <i
                        className="pi pi-dollar"
                        style={{ color: 'red', fontWeight: 'bold' }}
                    ></i>
                )}
            </div>
        )
    }

    const completedTemplate = (rowData) => {
        return (
            <div>
                {Boolean(rowData.completed) ? (
                    <i
                        className="pi pi-check"
                        style={{ color: 'green', fontWeight: 'bold' }}
                    ></i>
                ) : (
                    <i
                        className="pi pi-times"
                        style={{ color: 'red', fontWeight: 'bold' }}
                    ></i>
                )}
            </div>
        )
    }

    const actionsTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex' }}>
                <EditDeliveryForm delivery={rowData} />
                <Button
                    icon="pi pi-trash"
                    className="p-button-danger"
                    onClick={(e) => onDelete(e, rowData)}
                />
            </div>
        )
    }
    // #endregion

    // #region FILTERS
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

    // #region ACTION HANDLERS
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

    // Handle DateRangeSelector component operations
    const onDateRangeSelected = (e) => {
        let dateStart // e.value[0]
        let dateEnd // e.value[1]

        if (!e || !e.value) {
            // Clear ranges and filteredDeliveries (DataTable will default to `deliveries`). Used when clear button pressed
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
    // #endregion

    // RUN ONCE - INIT FILTERS
    useEffect(() => {
        initFilters()

        if (localStorage.getItem('selectedDeliveriesDateRange')) {
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
                onDateRangeSelected(e)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Check for messages
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

        if (rangeDates && rangeDates.length > 0) {
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
            setFilteredDeliveries(_filteredDeliveries)
        }
    }, [
        deliveries.data,
        deliveryClients.data,
        selectedClientId,
        rangeDates,
        rangeDates.length,
    ])

    return (
        <section>
            <h1 style={{ textAlign: 'center', fontSize: '20pt' }}>
                C&H Deliveries
            </h1>

            <ConfirmPopup />

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
                        {selectedClientAvatar && selectedClientAvatar.address && (
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
                        {selectedClientAvatar && selectedClientAvatar.company && (
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
                        sortMode="multiple"
                        removableSort
                        filter="true"
                        filters={filters}
                        filterDisplay="row"
                        onFilter={(e) => setFilters(e.filters)}
                        selectionMode="single"
                        selection={deliveryRowSelected}
                        onSelectionChange={(e) =>
                            setDeliveryRowSelected(e.value)
                        }
                        dataKey="_id"
                        stateStorage="session"
                        stateKey="dt-deliveries-session"
                        emptyMessage="No deliveries found"
                        stripedRows
                    >
                        {/* Has Paid */}
                        <Column
                            field="hasPaid"
                            header="Paid?"
                            body={hasPaidTemplate}
                        ></Column>

                        {/* Delivery Date */}
                        <Column
                            field="deliveryDate"
                            header="Deliver"
                            body={deliveryDateTemplate}
                            sortable
                        ></Column>

                        {/* Delivery Client */}
                        <Column
                            field="deliveryClient"
                            header="Client"
                            body={deliveryClientTemplate}
                            sortable
                        ></Column>

                        {/* Product Name */}
                        <Column
                            field="productName"
                            header="Material"
                            body={productNameTemplate}
                            sortable
                        ></Column>

                        {/* Product Quantity */}
                        <Column
                            field="productQuantity"
                            header="Qty"
                            body={productQuantityTemplate}
                        ></Column>

                        {/* Address */}
                        <Column
                            field="address"
                            header="Address"
                            body={addressTemplate}
                            sortable
                        ></Column>

                        {/* Contact Name */}
                        <Column
                            field="contactName"
                            header="Contact Name"
                            body={contactNameTemplate}
                            sortable
                        ></Column>

                        {/* Contact  Phone */}
                        <Column
                            field="contactPhone"
                            header="Contact Phone"
                            body={contactPhoneTemplate}
                            sortable
                        ></Column>

                        {/* Coordinates */}
                        <Column
                            field="coordinates"
                            header="Coords"
                            body={coordinatesTemplate}
                            sortable
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
