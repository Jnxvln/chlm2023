import { useState } from 'react'
import { Panel } from 'primereact/panel'
import { Dropdown } from 'primereact/dropdown'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Message } from 'primereact/message'
import { Messages } from 'primereact/messages'
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

    // #region DATABASE DATA
    // VENDORS
    const vendors = useQuery({
        queryKey: ['vendors'],
        queryFn: () => getVendors(user.data.token),
        enabled: !!userId,
        onSuccess: (vendors) => {
            // console.log('Vendors loaded: ')
            // console.log(vendors)
        },
        onError: (err) => {
            console.log(err)
            toast.error(err.message)
        },
    })

    // VENDOR PRODUCTS BY VENDOR ID
    const vendorProducts = useQuery({
        queryKey: ['vendorProducts', selectedVendor],
        queryFn: () => {
            // console.log('selectedVendor: ')
            // console.log(selectedVendor)

            return getVendorProductsByVendorId(
                selectedVendor._id,
                user.data.token
            )
        },
        enabled: !!(selectedVendor && selectedVendor._id),
        refetchOnWindowFocus: false,
        onSuccess: (vendorProducts) => {
            // console.log('Vendors Products loaded: ')
            // console.log(vendorProducts)
        },
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
        onSuccess: (vendorLocations) => {
            // console.log('Vendor locations: ')
            // console.log(vendorLocations)
        },
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
        onSuccess: (freightRoutes) => {
            // console.log('Freight routes for selected vendor: ')
            // console.log(freightRoutes)
        },
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
    // #endregion

    return (
        <section>
            <Panel header="Vendors">
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
                    style={{ width: '12em' }}
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

            <Panel header="Freight Routes">
                <DataTable
                    value={
                        freightRoutes &&
                        freightRoutes.data &&
                        freightRoutes.data.length > 0
                            ? freightRoutes.data.sort((a, b) =>
                                  a.destination.localeCompare(b.destination)
                              )
                            : []
                    }
                >
                    <Column
                        field="vendorLocationId"
                        header="Freight Cost"
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
