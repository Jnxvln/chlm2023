import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import HaulForm from '../../../components/user/dashboard/hauls/HaulForm'
import EditHaulForm from '../../../components/user/dashboard/hauls/EditHaulForm'
import DateRangeSelector from '../../../components/user/dashboard/hauls/DateRangeSelector'
import DriverSelector from '../../../components/user/dashboard/hauls/DriverSelector'
import WorkdayForm from '../../../components/user/dashboard/workdays/WorkdayForm'
import EditWorkdayForm from '../../../components/user/dashboard/workdays/EditWorkdayForm'
// PrimeReact Components
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { FilterMatchMode } from 'primereact/api'
import { InputText } from 'primereact/inputtext'
import { ConfirmPopup } from 'primereact/confirmpopup' // To use <ConfirmPopup> tag
import { confirmPopup } from 'primereact/confirmpopup' // To use confirmPopup method
// Store data
import { fetchUser } from '../../../api/users/usersApi'
import {
    getHauls,
    createHaul,
    updateHaul,
    deleteHaul,
} from '../../../api/hauls/haulsApi'
import { getDrivers } from '../../../api/drivers/driversApi'
import {
    getWorkdaysByDriverIdAndDateRange,
    updateWorkday,
} from '../../../api/workdays/workdaysApi'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

function HaulsDashboard() {
    // #region VARS ------------------------

    const queryClient = useQueryClient()

    const [rangeDates, setRangeDates] = useState([])
    const [filteredHauls, setFilteredHauls] = useState([])
    const [haulRowSelected, setHaulRowSelected] = useState(null)
    const [selectedDriverId, setSelectedDriverId] = useState(undefined)
    const [globalFilterValue, setGlobalFilterValue] = useState('')
    const [multiSortMeta, setMultiSortMeta] = useState([
        { field: 'dateHaul', order: -1 },
    ])
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        truck: { value: null, matchMode: FilterMatchMode.CONTAINS },
        broker: { value: null, matchMode: FilterMatchMode.CONTAINS },
        chInvoice: { value: null, matchMode: FilterMatchMode.CONTAINS },
        loadType: { value: null, matchMode: FilterMatchMode.CONTAINS },
        invoice: { value: null, matchMode: FilterMatchMode.CONTAINS },
        from: { value: null, matchMode: FilterMatchMode.CONTAINS },
        to: { value: null, matchMode: FilterMatchMode.CONTAINS },
        product: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const workdaySelectedDriver =
        selectedDriverId || localStorage.getItem('selectedDriverId')
    const workdayDateStart =
        rangeDates[0] ||
        JSON.parse(localStorage.getItem('selectedHaulsDateRange'))[0]
    const workdayDateEnd =
        rangeDates[rangeDates.length - 1] ||
        JSON.parse(localStorage.getItem('selectedHaulsDateRange'))[1]

    const user = useQuery(['user'], fetchUser)

    const workdays = useQuery({
        queryKey: ['workdays'],
        queryFn: () =>
            getWorkdaysByDriverIdAndDateRange(
                workdaySelectedDriver,
                workdayDateStart,
                workdayDateEnd,
                user.data.token
            ),
        onError: (err) => {
            console.log('Error fetching workdays: ')
            console.log(err)
        },
    })

    const hauls = useQuery({
        queryKey: ['hauls'],
        queryFn: () => getHauls(user.data.token),
    })

    const drivers = useQuery({
        queryKey: ['drivers'],
        queryFn: () => getDrivers(user.data.token),
    })

    const mutationCreateHaul = useMutation({
        mutationKey: ['hauls'],
        mutationFn: ({ formData, token }) => createHaul(formData, token),
        onSuccess: (haul) => {
            if (haul) {
                toast.success(`Haul invoice ${haul.invoice} created`, {
                    autoClose: 3000,
                })
                queryClient.invalidateQueries(['hauls'])
            }
        },
        onError: (err) => {
            const errMsg = 'Error creating haul'
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

    const mutationDeleteHaul = useMutation({
        mutationKey: ['hauls'],
        mutationFn: ({ id, token }) => deleteHaul(id, token),
        onSuccess: (delId) => {
            if (delId) {
                toast.success('Haul deleted', { autoClose: 1000 })
                queryClient.invalidateQueries(['hauls'])
            }
        },
        onError: (err) => {
            const errMsg = 'Error deleting haul'
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

    const mutationUpdateWorkday = useMutation({
        mutationKey: ['workdays'],
        mutationFn: ({ formData, token }) => updateWorkday(formData, token),
        onSuccess: (workday) => {
            if (workday) {
                toast.success(`Workday updated`, {
                    autoClose: 1000,
                })
                queryClient.invalidateQueries(['workdays'])
            }
        },
        onError: (err) => {
            const errMsg = 'Error updating workday'
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

    // #region DATA TABLE TEMPLATES ------------------------
    const dataTableHeaderTemplate = () => {
        return (
            <div className="flex justify-content-between">
                <div className="flex">
                    <div style={{ marginRight: '1em' }}>
                        <DriverSelector
                            drivers={drivers.data}
                            onSelectDriver={onSelectDriver}
                        />
                    </div>
                    <div style={{ marginRight: '4em' }}>
                        <HaulForm selectedDriverId={selectedDriverId} />
                    </div>
                    <div>
                        <DateRangeSelector
                            onDateRangeSelected={onDateRangeSelected}
                        />
                    </div>
                </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Invoice, truck, from, to, etc."
                    />
                </span>
            </div>
        )
    }

    const dateHaulTemplate = (rowData) => {
        return <>{dayjs(rowData.timeHaul).format('MM/DD/YY')}</>
    }

    const timeHaulTemplate = (rowData) => {
        return <>{dayjs(rowData.timeHaul).format('hh:mm a')}</>
    }

    const brokerTemplate = (rowData) => {
        return <>{rowData.broker}</>
    }

    const invoiceTemplate = (rowData) => {
        return <>{rowData.invoice}</>
    }

    const chInvoiceTemplate = (rowData) => {
        return <>{rowData.chInvoice}</>
    }

    const fromTemplate = (rowData) => {
        return <>{rowData.from}</>
    }

    const toTemplate = (rowData) => {
        return <>{rowData.to}</>
    }

    const productTemplate = (rowData) => {
        return <>{rowData.product}</>
    }

    const tonsTemplate = (rowData) => {
        return <>{rowData.tons ? parseFloat(rowData.tons).toFixed(2) : ''}</>
    }

    const rateTemplate = (rowData) => {
        return <>{rowData.rate ? parseFloat(rowData.rate).toFixed(2) : ''}</>
    }

    const milesTemplate = (rowData) => {
        return <>{rowData.miles ? parseFloat(rowData.miles).toFixed(2) : ''}</>
    }

    const payRateTemplate = (rowData) => {
        return (
            <>{rowData.payRate ? parseFloat(rowData.payRate).toFixed(2) : ''}</>
        )
    }

    const truckTemplate = (rowData) => {
        return <>{rowData.truck}</>
    }

    const workdayTemplate = (rowData) => {
        let _workday

        // Create a driver object based on each haul's `driver` id
        const _driver =
            drivers &&
            drivers.data &&
            drivers.data.find((driver) => driver._id === rowData.driver)

        return (
            <>
                {/* If there are workdays... */}
                {workdays && workdays.data && workdays.data.length > 0 ? (
                    <>
                        {/* If the current haul's `dateHaul` matches an existing Workday... */}
                        {workdays.data.find((workday) => {
                            _workday = { ...workday }
                            return (
                                workday.date.split('T')[0] ===
                                rowData.dateHaul.split('T')[0]
                            )
                        }) ? (
                            <>
                                {/* ... then show the Edit Workday form */}
                                <EditWorkdayForm
                                    workday={_workday}
                                    driver={_driver}
                                    onUpdateWorkdays={onUpdateWorkdays}
                                />
                            </>
                        ) : (
                            <>
                                {/* ... otherwise show the New Workday form */}
                                <WorkdayForm
                                    workDate={rowData.dateHaul}
                                    driver={_driver}
                                />
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {/* If there are no workdays (workdays data variable empty) */}
                        <WorkdayForm
                            workDate={rowData.dateHaul}
                            driver={_driver}
                        />
                    </>
                )}
            </>
        )
    }

    const actionsTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', gap: '0.5em' }}>
                <EditHaulForm haul={rowData} />
                <EditHaulForm haul={rowData} isDuplicating />
                <Button
                    icon="pi pi-trash"
                    className="p-button-danger"
                    onClick={(e) => onDelete(e, rowData)}
                />
            </div>
        )
    }
    // #endregion

    // #region FILTERS ------------------------
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
            truck: { value: null, matchMode: FilterMatchMode.CONTAINS },
            broker: { value: null, matchMode: FilterMatchMode.CONTAINS },
            chInvoice: { value: null, matchMode: FilterMatchMode.CONTAINS },
            loadType: { value: null, matchMode: FilterMatchMode.CONTAINS },
            invoice: { value: null, matchMode: FilterMatchMode.CONTAINS },
            from: { value: null, matchMode: FilterMatchMode.CONTAINS },
            to: { value: null, matchMode: FilterMatchMode.CONTAINS },
            product: { value: null, matchMode: FilterMatchMode.CONTAINS },
        })

        setGlobalFilterValue('')
    }
    // #endregion

    // #region HANDLERS ------------------------

    // Handle Delete haul confirmation
    const onDelete = (e, rowData) => {
        confirmPopup({
            target: e.target,
            message: `Delete haul invoice ${rowData.invoice}?`,
            icon: 'pi pi-exclamation-triangle',
            accept: () =>
                mutationDeleteHaul.mutate({
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
            // Clear ranges and filteredHauls (DataTable will default to `hauls`). Used when clear button pressed
            setRangeDates([])
            setFilteredHauls([])
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

    // Handle driver selected in dropdown
    const onSelectDriver = (driverId) => {
        if (!driverId) {
            return new Error('onSelectDriver: Missing driverId')
        }

        setSelectedDriverId(driverId)
    }

    const handleNoWorkdays = () => {
        console.log('ERROR: Could not load workdays from the database')
        toast.error(
            '"Workdays" is empty, possibly could not fetch from database?',
            { autoClose: 8000 }
        )
    }

    const onUpdateWorkdays = () => {
        queryClient.invalidateQueries({ queryKey: ['workdays'] })
    }
    // #endregion

    // RUN ONCE
    useEffect(() => {
        initFilters()

        if (localStorage.getItem('selectedHaulsDateRange')) {
            const _haulsDateRange = JSON.parse(
                localStorage.getItem('selectedHaulsDateRange')
            )

            if (_haulsDateRange.length > 0) {
                // Manually call onDateRangeSelected, passing in a pseudo-event object based on localStorage values
                let e = {
                    value: [
                        new Date(_haulsDateRange[0]),
                        new Date(_haulsDateRange[1]),
                    ],
                }
                onDateRangeSelected(e)
            }
        }

        if (localStorage.getItem('selectedDriverId')) {
            setSelectedDriverId(localStorage.getItem('selectedDriverId'))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (rangeDates && rangeDates.length > 0) {
            // Filter hauls first by date range (rangeDates), then by the driver's id
            let _selectedDriverId =
                localStorage.getItem('selectedDriverId') || null

            // Filter hauls within selected date range
            if (_selectedDriverId && _selectedDriverId.length > 0) {
                let _filteredHauls =
                    hauls &&
                    hauls.data &&
                    hauls.data.filter(
                        (haul) =>
                            haul.driver === _selectedDriverId &&
                            rangeDates.includes(
                                new Date(haul.dateHaul).toDateString()
                            )
                    )
                setFilteredHauls(_filteredHauls)
                workdays.refetch()
            } else {
                console.log('No driver id found, no hauls to display')
                setFilteredHauls([])
            }
        }
    }, [
        hauls.data,
        drivers.data,
        rangeDates,
        rangeDates.length,
        selectedDriverId,
    ])

    return (
        <section>
            <h1 style={{ textAlign: 'center', fontSize: '20pt' }}>C&H Hauls</h1>
            <ConfirmPopup />

            <div className="datatable-templating-demo">
                <div className="card" style={{ height: 'calc(100vh - 145px)' }}>
                    <DataTable
                        value={filteredHauls}
                        loading={hauls.isLoading}
                        header={dataTableHeaderTemplate}
                        globalFilterFields={[
                            'dateHaul',
                            'broker',
                            'invoice',
                            'chInvoice',
                            'invoice',
                            'from',
                            'to',
                            'product',
                        ]}
                        scrollable
                        autoLayout
                        size="small"
                        scrollHeight="flex"
                        removableSort
                        onSort={(e) => setMultiSortMeta(e.multiSortMeta)}
                        responsiveLayout="scroll"
                        filter="true"
                        filters={filters}
                        filterDisplay="row"
                        sortField="dateHaul"
                        sortOrder={1}
                        onFilter={(e) => setFilters(e.filters)}
                        selectionMode="single"
                        selection={haulRowSelected}
                        onSelectionChange={(e) => setHaulRowSelected(e.value)}
                        dataKey="_id"
                        stateStorage="session"
                        stateKey="dt-hauls-session"
                        emptyMessage="No hauls found"
                        stripedRows
                    >
                        {/* <Column field="driver" header="Driver" body={driverTemplate}></Column> */}
                        {/* HAUL DATE */}
                        <Column
                            field="dateHaul"
                            header="Date"
                            body={dateHaulTemplate}
                            dataType="date"
                            sortable
                        ></Column>

                        {/* TIME (DATE HAUL) */}
                        <Column
                            field="timeHaul"
                            header="Time"
                            body={timeHaulTemplate}
                            dataType="date"
                            sortable
                        ></Column>

                        {/* BROKER */}
                        <Column
                            field="broker"
                            header="Cust"
                            body={brokerTemplate}
                        ></Column>

                        {/* INVOICE */}
                        <Column
                            field="invoice"
                            header="Inv"
                            body={invoiceTemplate}
                        ></Column>

                        {/* CHINVOICE */}
                        <Column
                            field="chInvoice"
                            header="CH Inv"
                            body={chInvoiceTemplate}
                        ></Column>

                        {/* FROM */}
                        <Column
                            field="from"
                            header="From"
                            body={fromTemplate}
                        ></Column>

                        {/* TO */}
                        <Column
                            field="to"
                            header="To"
                            body={toTemplate}
                        ></Column>

                        {/* PRODUCT */}
                        <Column
                            field="product"
                            header="Mat"
                            body={productTemplate}
                        ></Column>

                        {/* TONS */}
                        <Column
                            field="tons"
                            header="Tons"
                            body={tonsTemplate}
                        ></Column>

                        {/* RATE */}
                        <Column
                            field="rate"
                            header="Rate"
                            body={rateTemplate}
                        ></Column>

                        {/* MILES */}
                        <Column
                            field="miles"
                            header="Miles"
                            body={milesTemplate}
                        ></Column>

                        {/* PAYRATE */}
                        <Column
                            field="payRate"
                            header="Pay"
                            body={payRateTemplate}
                        ></Column>

                        {/* TRUCK */}
                        <Column
                            field="truck"
                            header="Truck"
                            body={truckTemplate}
                        ></Column>

                        {/* WORKDAY */}
                        <Column
                            header="Workday"
                            body={workdayTemplate}
                        ></Column>

                        {/* ACTIONS */}
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

export default HaulsDashboard
