import { useState, useEffect } from 'react'
import VendorLocationForm from './VendorLocationForm'
import EditVendorLocationForm from './EditVendorLocationForm'
// PrimeReact Components
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ConfirmPopup } from 'primereact/confirmpopup' // To use <ConfirmPopup> tag
import { confirmPopup } from 'primereact/confirmpopup' // To use confirmPopup method
import { Button } from 'primereact/button'
import { TriStateCheckbox } from 'primereact/tristatecheckbox'
import { FilterMatchMode } from 'primereact/api'
import { InputText } from 'primereact/inputtext'
// Store data
import { fetchUser } from '../../../../api/users/usersApi'
import { getVendors } from '../../../../api/vendors/vendorsApi'
import {
    getVendorLocations,
    deleteVendorLocation,
} from '../../../../api/vendorLocations/vendorLocationsApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

function VendorLocationDataTable() {
    // #region VARS -------------------------

    const queryClient = useQueryClient()

    const [globalFilterValue, setGlobalFilterValue] = useState('')
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [vendorLocationRowSelected, setVendorLocationRowSelected] =
        useState(null)

    const user = useQuery(['user'], fetchUser)

    const vendors = useQuery({
        queryKey: ['vendors'],
        queryFn: () => getVendors(user.data.token),
    })

    const vendorLocations = useQuery({
        queryKey: ['vendorLocations'],
        queryFn: () => getVendorLocations(user.data.token),
    })

    const mutationDeleteVendorLocation = useMutation({
        mutationKey: ['vendorLocations'],
        mutationFn: ({ id, token }) => deleteVendorLocation(id, token),
        onSuccess: (delId) => {
            if (delId) {
                toast.success('Vendor location deleted', { autoClose: 1000, toastId: 'W9920josddoi' })
                queryClient.invalidateQueries(['vendorLocations'])
            }
        },
        onError: (err) => {
            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                toast.error(err.response.data.message, { autoClose: false, toastId: 'kD94029fis' })
            } else {
                toast.error('Error deleting vendor location', {
                    autoClose: false,
                    toastId: 'Ar29f909dfifow'
                })
            }
        },
    })

    // #endregion

    // #region TEMPLATES -------------------------
    const vendorLocationsDataTableHeaderTemplate = () => {
        return (
            <div className="flex gap-4">
                <div>
                    <VendorLocationForm />
                </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Name"
                    />
                </span>
            </div>
        )
    }

    const vendorLocationTemplate = (option) => {
        return (
            <>
                <strong>{option.name}</strong>
            </>
        )
    }

    const isActiveRowFilterTemplate = (option) => {
        ;<TriStateCheckbox
            value={option.value}
            onChange={(e) => option.filterApplyCallback(e.value)}
        />
    }

    const isActiveTemplate = (rowData) => {
        return <>{rowData.isActive ? <i className="pi pi-check" /> : ''}</>
    }

    //   const chtFuelSurchargeTemplate = (rowData) => {
    //     return <>{parseFloat(rowData.chtFuelSurcharge).toFixed(2)}</>;
    //   };

    //   const vendorFuelSurchargeTemplate = (rowData) => {
    //     return <>{parseFloat(rowData.vendorFuelSurcharge).toFixed(2)}</>;
    //   };

    const vendorNameTemplate = (rowData) => {
        if (vendors && vendors.data) {
            const vendor = vendors.data.find((v) => v._id === rowData.vendorId)

            if (vendor) {
                return <>{vendor.name}</>
            } else {
                return <>[Not found]</>
            }
        } else {
            return <>[Not loaded]</>
        }
    }

    const actionsTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', gap: '0.5em' }}>
                <EditVendorLocationForm vendorLocation={rowData} />
                <Button
                    icon="pi pi-trash"
                    className="p-button-danger"
                    onClick={(e) => onDelete(e, rowData)}
                />
            </div>
        )
    }
    // #endregion

    // #region FILTERS -------------------------
    // Handle filter change
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
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        })

        setGlobalFilterValue('')
    }
    // #endregion

    // Delete vendor location confirmation
    const onDelete = (e, rowData) => {
        confirmPopup({
            target: e.target,
            message: `Delete location ${rowData.name}?`,
            icon: 'pi pi-exclamation-triangle',
            accept: () =>
                mutationDeleteVendorLocation.mutate({
                    id: rowData._id,
                    token: user.data.token,
                }),
            reject: () => null,
        })
    }

    // RUN ONCE - INIT FILTERS
    useEffect(() => {
        initFilters()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="datatable-templating-demo">
            <ConfirmPopup />
            <div className="card" style={{ height: 'calc(100vh - 145px)' }}>
                <DataTable
                    value={vendorLocations.data}
                    loading={vendorLocations.isLoading}
                    header={vendorLocationsDataTableHeaderTemplate}
                    globalFilterFields={['name']}
                    size="small"
                    scrollable
                    scrollHeight="flex"
                    sortMode="multiple"
                    responsiveLayout="scroll"
                    filter="true"
                    filters={filters}
                    filterfield="name"
                    filterDisplay="row"
                    onFilter={(e) => setFilters(e.filters)}
                    selectionMode="single"
                    selection={vendorLocationRowSelected}
                    onSelectionChange={(e) =>
                        setVendorLocationRowSelected(e.value)
                    }
                    dataKey="_id"
                    stateStorage="session"
                    stateKey="dt-vendorLocations-session"
                    emptyMessage="No vendor locations found"
                    stripedRows
                >
                    {/* VENDOR */}
                    <Column
                        field="vendorId"
                        header="Vendor"
                        body={vendorNameTemplate}
                        sortable
                    ></Column>

                    {/* LOCATION */}
                    <Column
                        field="name"
                        header="Location"
                        body={vendorLocationTemplate}
                        sortable
                    ></Column>

                    {/* IS ACTIVE */}
                    <Column
                        field="isActive"
                        dataType="boolean"
                        header="Active"
                        filterElement={isActiveRowFilterTemplate}
                        body={isActiveTemplate}
                        sortable
                    ></Column>

                    {/* ACTIONS */}
                    <Column header="Actions" body={actionsTemplate}></Column>
                </DataTable>
            </div>
        </div>
    )
}

export default VendorLocationDataTable
