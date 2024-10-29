import { useState, useEffect } from 'react'
import FreightRouteForm from './FreightRouteForm'
import EditFreightRouteForm from './EditFreightRouteForm'
// PrimeReact Components
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ConfirmPopup } from 'primereact/confirmpopup' // To use <ConfirmPopup> tag
import { confirmPopup } from 'primereact/confirmpopup' // To use confirmPopup method
import { Button } from 'primereact/button'
import { TriStateCheckbox } from 'primereact/tristatecheckbox'
import { FilterMatchMode } from 'primereact/api'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
// Store data
import { fetchUser } from '../../../../api/users/usersApi'
import { getVendors } from '../../../../api/vendors/vendorsApi'
import { getVendorLocations } from '../../../../api/vendorLocations/vendorLocationsApi'
import {
    getFreightRoutes,
    deleteFreightRoute,
} from '../../../../api/freightRoutes/freightRoutesApi'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

function FreightRouteDataTable() {
    // #region VARS -------------------------------

    const queryClient = useQueryClient()

    const [globalFilterValue, setGlobalFilterValue] = useState('')
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        destination: { value: null, matchMode: FilterMatchMode.CONTAINS },
        type: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [freightRouteRowSelected, setFreightRouteRowSelected] = useState(null)
    // const [types] = useState(['yard', 'jobsite', 'residential'])
    const types = ['yard', 'jobsite', 'residential']

    const user = useQuery(['user'], fetchUser)

    const vendors = useQuery({
        queryKey: ['vendors'],
        queryFn: () => getVendors(user.data.token),
    })

    const vendorLocations = useQuery({
        queryKey: ['vendorLocations'],
        queryFn: () => getVendorLocations(user.data.token),
    })

    const freightRoutes = useQuery({
        queryKey: ['freightRoutes'],
        queryFn: () => getFreightRoutes(user.data.token),
    })

    const mutationDeleteFreightRoute = useMutation({
        mutationKey: ['freightRoutes'],
        mutationFn: ({ id, token }) => deleteFreightRoute(id, token),
        onSuccess: (delId) => {
            if (delId) {
                toast.success('Route deleted', { autoClose: 1000, toastId: 'g98390893fi' })
                queryClient.invalidateQueries(['freightRoutes'])
            }
        },
        onError: (err) => {
            const errMsg = 'Error deleting freight route'
            console.log(errMsg)
            console.log(err)

            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                toast.error(err.response.data.message, { autoClose: false, toastId: 'vFA9294026d0' })
            } else {
                toast.error(errMsg, { autoClose: false, toastId: 'Ae920DVISJ5' })
            }
        },
    })

    // #endregion

    // #region TEMPLATES -------------------------------
    const freightRoutesDataTableHeaderTemplate = () => {
        return (
            <div className="flex gap-4">
                <div>
                    <FreightRouteForm />
                </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Destination"
                    />
                </span>
            </div>
        )
    }

    const vendorNameTemplate = (rowData) => {
        const vendor = vendors.data.find((v) => v._id === rowData.vendorId)
        return vendor ? <>{vendor.name}</> : <>[err]</>
    }

    const routeVendorLocationTemplate = (rowData) => {
        const location = vendorLocations?.data?.find(
            (loc) => loc._id === rowData.vendorLocationId
        )
        return location ? (
            <>
                <strong>{location.name}</strong>
            </>
        ) : (
            <>[err]</>
        )
    }

    const routeDestinationTemplate = (option) => {
        return (
            <>
                <strong>{option.destination}</strong>
            </>
        )
    }

    const freightRouteFreightCostTemplate = (rowData) => {
        return <>${parseFloat(rowData.freightCost).toFixed(2)}</>
    }

    const isActiveRowFilterTemplate = (options) => {
        ;<TriStateCheckbox
            value={options.value}
            onChange={(e) => options.filterApplyCallback(e.value)}
        />
    }

    const isActiveTemplate = (rowData) => {
        return <>{rowData.isActive ? <i className="pi pi-check" /> : ''}</>
    }

    const typeTemplate = (option, props) => {
        // console.log('[typeTemplate] option: ')
        // console.log(option)
        // return <span>{option && option.type ? option.type : '(Loading)'}</span>
        if (option && !option.type) {
            return <span>{option}</span>
        } else if (option && option.type) {
            return <span>{option.type}</span>
        } else {
            return <span>Err</span>
        }
    }

    const actionsTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex' }}>
                <EditFreightRouteForm freightRoute={rowData} />
                <Button
                    icon="pi pi-trash"
                    className="p-button-danger"
                    onClick={(e) => onDelete(e, rowData)}
                />
            </div>
        )
    }

    const statusItemTemplate = (option) => {
        return <div>{option}</div>
    }

    const statusBodyTemplate = (rowData) => {
        return <div>{rowData.type}</div>
    }

    const typeFilterTemplate = (options) => {
        if (options) {
            console.log('[typeFilterTemplate] options: ')
            console.log(options)
            return (
                <Dropdown
                    value={options.value}
                    options={types}
                    onChange={(e) => options.filterApplyCallback(e.value)}
                    itemTemplate={statusItemTemplate}
                    placeholder="Select One"
                    className="p-column-filter"
                    style={{ minWidth: '12rem' }}
                    showClear
                />
            )
        }
    }
    // #endregion

    // #region FILTERS -------------------------------
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
            message: `Delete route ${rowData.destination}?`,
            icon: 'pi pi-exclamation-triangle',
            accept: () =>
                mutationDeleteFreightRoute.mutate({
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
                    value={freightRoutes.data}
                    loading={freightRoutes.isLoading}
                    header={freightRoutesDataTableHeaderTemplate}
                    globalFilterFields={['destination', 'type']}
                    size="small"
                    scrollHeight="flex"
                    sortMode="multiple"
                    responsiveLayout="scroll"
                    filter="true"
                    filters={filters}
                    // filterfield="type"
                    filterDisplay="row"
                    onFilter={(e) => setFilters(e.filters)}
                    selectionMode="single"
                    selection={freightRouteRowSelected}
                    onSelectionChange={(e) =>
                        setFreightRouteRowSelected(e.value)
                    }
                    dataKey="_id"
                    stateStorage="session"
                    stateKey="dt-freightRoutes-session"
                    emptyMessage="No freight routes found"
                    stripedRows="true"
                    scrollable="true"
                >
                    {/* VENDOR NAME */}
                    <Column
                        field="vendorId"
                        header="Vendor"
                        body={vendorNameTemplate}
                        sortable
                    />

                    {/* VENDOR LOCATION */}
                    <Column
                        field="vendorLocationId"
                        header="Location"
                        body={routeVendorLocationTemplate}
                        sortable
                    />

                    {/* DESTINATION */}
                    <Column
                        field="destination"
                        header="Destination"
                        body={routeDestinationTemplate}
                        sortable
                    ></Column>

                    {/* FREIGHT COST */}
                    <Column
                        field="freightCost"
                        dataType="number"
                        header="Freight Cost"
                        body={freightRouteFreightCostTemplate}
                        sortable
                    ></Column>

                    {/* <Column field="notes" header="Notes" /> */}

                    {/* TYPE */}
                    <Column
                        field="type"
                        header="Type"
                        body={statusBodyTemplate}
                        filter
                        filterElement={typeFilterTemplate}
                        showFilterMenu={false}
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

export default FreightRouteDataTable
