import { useState } from 'react'
import { Panel } from 'primereact/panel'
import { Dropdown } from 'primereact/dropdown'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Message } from 'primereact/message'
import { FilterMatchMode } from 'primereact/api'
import { InputText } from 'primereact/inputtext'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchUser } from '../../../../api/users/usersApi'
import { getVendors } from '../../../../api/vendors/vendorsApi'
import { getVendorProductsByVendorId } from '../../../../api/vendorProducts/vendorProductsApi'
import { getVendorLocations } from '../../../../api/vendorLocations/vendorLocationsApi'
import { getFreightRoutesByVendorId } from '../../../../api/freightRoutes/freightRoutesApi'
import { toast } from 'react-toastify'

function VendorOverview() {
    const queryClient = useQueryClient()
    const user = useQuery(['user'], fetchUser)
    const userId = user?.data?._id

    const [selectedVendor, setSelectedVendor] = useState(null)
    const [selectedVendorProductRow, setSelectedVendorProductRow] =
        useState(null)
    const [selectedFreightRow, setSelectedFreightRow] = useState(null)
    const [vendorFilters, setVendorFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [freightFilters, setFreightFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [globalFilterValue, setGlobalFilterValue] = useState('')
    const [freightGlobalFilterValue, setFreightGlobalFilterValue] = useState('')

    // #region DATABASE DATA
    // VENDORS
    const vendors = useQuery({
        queryKey: ['vendors'],
        queryFn: () => getVendors(user.data.token),
        enabled: !!userId,
        onError: (err) => {
            console.log(err)
            toast.error(err.message)
        },
    })

    // VENDOR PRODUCTS BY VENDOR ID
    const vendorProducts = useQuery({
        queryKey: ['vendorProducts', selectedVendor],
        queryFn: () => {
            return getVendorProductsByVendorId(
                selectedVendor._id,
                user.data.token
            )
        },
        enabled: !!(selectedVendor && selectedVendor._id),
        refetchOnWindowFocus: false,
        onError: (err) => {
            console.log(err)
            toast.error(err.message)
        },
    })

    // VENDOR LOCATIONS
    const vendorLocations = useQuery({
        queryKey: ['vendorLocations', selectedVendor],
        queryFn: () => {
            return getVendorLocations(user.data.token)
        },
        enabled: !!(selectedVendor && selectedVendor._id),
        refetchOnWindowFocus: false,
        onError: (err) => {
            console.log(err)
            toast.error(err.message)
        },
    })

    // FREIGHT ROUTES BY VENDOR ID
    const freightRoutes = useQuery({
        queryKey: ['freightRoutes', selectedVendor],
        queryFn: () => {
            return getFreightRoutesByVendorId(
                selectedVendor._id,
                user.data.token
            )
        },
        enabled: !!(selectedVendor && selectedVendor._id),
        refetchOnWindowFocus: false,
        onError: (err) => {
            console.log(err)
            toast.error(err.message)
        },
    })
    // #endregion

    // #region ACTION HANDLERS
    const onVendorChange = (e) => {
        setSelectedVendor(e.value)
        queryClient.invalidateQueries({ queryKey: ['vendorProducts'] })
    }

    const fuelSurchargeAmount = () => {
        return (
            <>
                <span>Fuel Surcharge: </span>
                <strong>
                    $
                    {selectedVendor &&
                        parseFloat(selectedVendor.chtFuelSurcharge).toFixed(
                            2
                        )}{' '}
                    /t
                </strong>
            </>
        )
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value
        let _vendorFilters = { ...vendorFilters }
        _vendorFilters['global'].value = value

        setVendorFilters(_vendorFilters)
        setGlobalFilterValue(value)
    }

    const onFreightGlobalFilterChange = (e) => {
        const value = e.target.value
        let _freightFilters = { ...freightFilters }
        _freightFilters['global'].value = value

        setFreightFilters(_freightFilters)
        setFreightGlobalFilterValue(value)
    }
    // #endregion

    // #region DATATABLE TEMPLATES
    const productCostTemplate = (rowData) => {
        return <>${parseFloat(rowData.productCost).toFixed(2)} /t</>
    }

    const freightCostTemplate = (rowData) => {
        return <>${parseFloat(rowData.freightCost).toFixed(2)} /t</>
    }

    const vendorLocationTemplate = (rowData) => {
        const vendor =
            vendorLocations && vendorLocations.data
                ? vendorLocations.data.find(
                      (loc) => loc._id === rowData.vendorLocationId
                  )
                : null
        return <>{vendor ? vendor.name : 'Loading...'}</>
    }

    const renderVendorHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Search name"
                    />
                </span>
            </div>
        )
    }

    const renderFreightHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={freightGlobalFilterValue}
                        onChange={onFreightGlobalFilterChange}
                        placeholder="Search destination"
                    />
                </span>
            </div>
        )
    }
    // #endregion

    return (
        <section>
            <Panel
                header="Vendors"
                className={`p-panel-titlebar vendorHeader`}
                id="vendorOverviewVendorPanelHeader"
            >
                <Dropdown
                    value={selectedVendor}
                    options={
                        vendors.data
                            ? vendors.data.sort((a, b) =>
                                  a.name.localeCompare(b.name)
                              )
                            : []
                    }
                    onChange={onVendorChange}
                    optionLabel="name"
                    placeholder="Choose Vendor"
                    style={{ width: '12em', marginTop: '1em' }}
                />

                <br />
                <br />

                <div>
                    <Message severity="info" text={fuelSurchargeAmount}>
                        Fuel Surcharge: $
                        {selectedVendor && (
                            <span>
                                {parseFloat(
                                    selectedVendor.chtFuelSurcharge
                                ).toFixed(2)}
                            </span>
                        )}
                    </Message>
                </div>

                <br />

                <DataTable
                    stripedRows
                    selectionMode="single"
                    selection={selectedVendorProductRow}
                    onSelectionChange={(e) => {
                        setSelectedVendorProductRow(e.value)

                        console.log(
                            '[VendorOverview] selectedVendorProductRow  e.value: '
                        )
                        console.log(e.value)

                        // Set Selected Freight Row to matching vendorId with "C&H Yard" as destination

                        const selectedFreightRow =
                            freightRoutes &&
                            freightRoutes.data &&
                            freightRoutes.data.length > 0
                                ? freightRoutes.data.find(
                                      (route) =>
                                          route.vendorId === e.value.vendorId &&
                                          route.vendorLocationId ===
                                              e.value.vendorLocationId &&
                                          route.destination === 'C&H Yard'
                                  )
                                : null

                        console.log('Selected Freight Row:: ')
                        console.log(selectedFreightRow)

                        setSelectedFreightRow(selectedFreightRow)
                    }}
                    value={
                        vendorProducts &&
                        vendorProducts.data &&
                        vendorProducts.data.length > 0
                            ? vendorProducts.data.sort((a, b) =>
                                  a.name.localeCompare(b.name)
                              )
                            : []
                    }
                    responsiveLayout="scroll"
                    filters={vendorFilters}
                    header={renderVendorHeader}
                >
                    <Column
                        field="vendorLocationId"
                        header="Location"
                        body={vendorLocationTemplate}
                    />
                    <Column field="name" header="Name" />
                    <Column
                        field="productCost"
                        header="Product Cost"
                        body={productCostTemplate}
                    />
                </DataTable>
            </Panel>

            <br />
            <br />

            <Panel
                header="Freight Routes"
                id="vendorOverviewFreightRoutesPanelHeader"
            >
                <DataTable
                    stripedRows
                    selectionMode="single"
                    selection={selectedFreightRow}
                    onSelectionChange={(e) => setSelectedFreightRow(e.value)}
                    value={
                        freightRoutes &&
                        freightRoutes.data &&
                        freightRoutes.data.length > 0
                            ? freightRoutes.data.sort((a, b) =>
                                  a.destination.localeCompare(b.destination)
                              )
                            : []
                    }
                    filters={freightFilters}
                    header={renderFreightHeader}
                >
                    <Column
                        field="vendorLocationId"
                        header="Location"
                        body={vendorLocationTemplate}
                    />
                    <Column field="destination" header="Destination" />
                    <Column
                        field="freightCost"
                        header="Freight Cost"
                        body={freightCostTemplate}
                    />
                </DataTable>
            </Panel>
        </section>
    )
}

export default VendorOverview
