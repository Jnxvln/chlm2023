import { useState, useEffect } from 'react'
import VendorForm from './VendorForm'
import EditVendorForm from './EditVendorForm'
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
import { getVendors, deleteVendor } from '../../../../api/vendors/vendorsApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

function VendorDataTable() {
    // #region VARS -------------------------
    const queryClient = useQueryClient()
    const [globalFilterValue, setGlobalFilterValue] = useState('')
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        shortName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [vendorRowSelected, setVendorRowSelected] = useState(null)

    const user = useQuery(['user'], fetchUser)

    const vendors = useQuery({
        queryKey: ['vendors'],
        queryFn: () => getVendors(user.data.token),
        onError: (err) => {
            console.log('Error fetching vendors: ')
            console.log(err)
        },
    })

    const mutationDeleteVendor = useMutation({
        mutationKey: ['vendors'],
        mutationFn: ({ vendorId, token }) => deleteVendor(vendorId, token),
        onSuccess: (delId) => {
            if (delId) {
                toast.success('Vendor deleted', { autoClose: 1000 })
                queryClient.invalidateQueries(['vendors'])
            }
        },
        onError: (err) => {
            console.log('Error deleting vendor: ')
            console.log(err)
            toast.error('Error deleting vendor', { autoClose: false })
        },
    })
    // #endregion

    // #region TEMPLATES -------------------------
    const vendorsDataTableHeaderTemplate = () => {
        return (
            <div className="flex justify-content-between">
                <div>
                    <VendorForm />
                </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Name or short name"
                    />
                </span>
            </div>
        )
    }

    const vendorNameTemplate = (option) => {
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

    const chtFuelSurchargeTemplate = (rowData) => {
        return <>{parseFloat(rowData.chtFuelSurcharge).toFixed(2)}</>
    }

    const vendorFuelSurchargeTemplate = (rowData) => {
        return <>{parseFloat(rowData.vendorFuelSurcharge).toFixed(2)}</>
    }

    const actionsTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex' }}>
                <EditVendorForm vendor={rowData} />
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
            shortName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        })

        setGlobalFilterValue('')
    }
    // #endregion

    // Delete vendor confirmation
    const onDelete = (e, rowData) => {
        confirmPopup({
            target: e.target,
            message: `Delete vendor ${rowData.name}?`,
            icon: 'pi pi-exclamation-triangle',
            accept: () =>
                mutationDeleteVendor.mutate({
                    vendorId: rowData._id,
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
                    value={vendors.data}
                    loading={vendors.isLoading}
                    header={vendorsDataTableHeaderTemplate}
                    globalFilterFields={['name', 'shortName']}
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
                    selection={vendorRowSelected}
                    onSelectionChange={(e) => setVendorRowSelected(e.value)}
                    dataKey="_id"
                    stateStorage="session"
                    stateKey="dt-vendors-session"
                    emptyMessage="No vendors found"
                    stripedRows
                >
                    {/* NAME */}
                    <Column
                        field="name"
                        header="Name"
                        body={vendorNameTemplate}
                        sortable
                    ></Column>

                    {/* SHORT NAME */}
                    <Column
                        field="shortName"
                        header="Short Name"
                        style={{ minWidth: '12em' }}
                        sortable
                    ></Column>

                    {/* CHT FSC */}
                    <Column
                        field="chtFuelSurcharge"
                        dataType="number"
                        header="CHT FSC"
                        style={{ minWidth: '12em' }}
                        sortable
                        body={chtFuelSurchargeTemplate}
                    ></Column>

                    {/* VENDOR FSC */}
                    <Column
                        field="vendorFuelSurcharge"
                        dataType="number"
                        header="Vendor FSC"
                        style={{ minWidth: '12em' }}
                        sortable
                        body={vendorFuelSurchargeTemplate}
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

export default VendorDataTable
