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
import {
    getVendorProducts,
    getVendorProductsByVendorId,
} from '../../../../api/vendorProducts/vendorProductsApi'
import { toast } from 'react-toastify'

function VendorOverview() {
    const queryClient = useQueryClient()
    const user = useQuery(['user'], fetchUser)
    const userId = user?.data?._id

    const [selectedVendor, setSelectedVendor] = useState(null)
    const [filteredVendors, setFilteredVendors] = useState([])

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

    // VENDOR PRODUCTS
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

    const productCostTemplate = (rowData) => {
        return <>${parseFloat(rowData.productCost).toFixed(2)} /t</>
    }

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
                            ? vendorProducts.data
                            : []
                    }
                    responsiveLayout="scroll"
                >
                    <Column field="name" header="Name" />
                    <Column
                        field="productCost"
                        header="Product Cost"
                        body={productCostTemplate}
                    />
                </DataTable>
            </Panel>
        </section>
    )
}

export default VendorOverview
