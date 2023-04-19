import { useState } from 'react'
import WaitListForm from '../../../components/user/dashboard/waitlist/WaitListForm'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { ConfirmPopup } from 'primereact/confirmpopup' // To use <ConfirmPopup> tag
import { confirmPopup } from 'primereact/confirmpopup' // To use confirmPopup method
import { toast } from 'react-toastify'
import { fetchUser } from '../../../api/users/usersApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteEntry, getEntries } from '../../../api/waitList/waitList'
import { FilterMatchMode, FilterOperator } from 'primereact/api'

export default function WaitList() {
    const queryClient = useQueryClient()
    const user = useQuery(['user'], fetchUser)

    // const [waitList, setWaitList] = useState([
    //     {
    //         _id: 'd023odf90u1rhifg',
    //         dateCreated:
    //             'Tue Apr 06 2023 00:00:00 GMT-0500 (Central Daylight Time)',
    //         dateModified:
    //             'Tue Apr 14 2023 00:00:00 GMT-0500 (Central Daylight Time)',
    //         firstName: 'Hector',
    //         lastName: 'Garcia',
    //         phone: '888-999-7777',
    //         email: '',
    //         material: 'Chopped Limestone',
    //         quantity: '2pl 4x4',
    //         status: 'waiting',
    //         notes: '',
    //         alert: true,
    //     },
    //     {
    //         _id: 'ik9582hf9ah3fhj',
    //         dateCreated:
    //             'Tue Apr 06 2023 00:00:00 GMT-0500 (Central Daylight Time)',
    //         dateModified: null,
    //         firstName: 'Joe',
    //         lastName: 'Williams',
    //         phone: '505-333-1111',
    //         email: '',
    //         material: 'Compost',
    //         quantity: '6yds',
    //         status: 'waiting',
    //         notes: 'Please call his other number: 903-444-2222',
    //         alert: true,
    //     },
    //     {
    //         _id: 'nKhd93934iawde19jh',
    //         dateCreated:
    //             'Tue Apr 07 2023 00:00:00 GMT-0500 (Central Daylight Time)',
    //         dateModified:
    //             'Tue Apr 08 2023 00:00:00 GMT-0500 (Central Daylight Time)',
    //         firstName: 'Thomas',
    //         lastName: 'Jones',
    //         phone: '444-222-3333',
    //         email: '',
    //         material: 'Cherry Blend',
    //         quantity: '1/2 PL',
    //         status: 'informed',
    //         notes: '',
    //         alert: false,
    //     },
    //     {
    //         _id: 'BA84fBgjdjOhf92',
    //         dateCreated:
    //             'Tue Apr 08 2023 00:00:00 GMT-0500 (Central Daylight Time)',
    //         dateModified:
    //             'Tue Apr 09 2023 00:00:00 GMT-0500 (Central Daylight Time)',
    //         firstName: 'Gloria',
    //         lastName: 'Pennington',
    //         phone: '444-111-2222',
    //         email: 'gloriapenn@test.com',
    //         material: 'Sm. Round Creek',
    //         quantity: '5gal bucket',
    //         status: 'waiting',
    //         notes: '',
    //         alert: true,
    //     },
    //     {
    //         _id: 'nJ83jcTcvmajn4j',
    //         dateCreated:
    //             'Tue Apr 09 2023 00:00:00 GMT-0500 (Central Daylight Time)',
    //         dateModified:
    //             'Tue Apr 12 2023 00:00:00 GMT-0500 (Central Daylight Time)',
    //         firstName: 'Shawn',
    //         lastName: 'Bradbury',
    //         phone: '222-666-5555',
    //         email: '',
    //         material: '3x300 Ground Cover',
    //         quantity: '3 rolls',
    //         status: 'waiting',
    //         notes: '',
    //         alert: true,
    //     },
    // ])
    const [rowSelected, setRowSelected] = useState(null)
    const [entryToEdit, setEntryToEdit] = useState(null)
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        firstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        lastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        material: { value: null, matchMode: FilterMatchMode.CONTAINS },
        phone: { value: null, matchMode: FilterMatchMode.CONTAINS },
        email: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [globalFilterValue, setGlobalFilterValue] = useState('')

    // Get entries from store
    const entries = useQuery({
        queryKey: ['waitlist'],
        queryFn: () => getEntries(user?.data?.token),
        refetchOnWindowFocus: true,
        enabled: !!user && !!user.data,
        onError: (err) => {
            const errMsg = 'Error fetching waitlist entries'
            console.log(errMsg)
            console.log(err)
        },
    })

    const mutationDeleteEntry = useMutation({
        mutationKey: ['waitlist'],
        mutationFn: ({ id, token }) => deleteEntry(id, token),
        onSuccess: (delId) => {
            if (delId) {
                toast.success('Entry deleted', { autoClose: 1000 })
                queryClient.invalidateQueries(['waitlist'])
            }
        },
        onError: (err) => {
            const errMsg = 'Error deleting waitlist entry'
            console.log(errMsg)
            console.log(err)

            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                toast.error(err.response.data.message, { autoClose: 5000 })
            } else {
                toast.error(errMsg, { autoClose: 5000 })
            }
        },
    })

    // #region ACTION HANDLERS =======================================================================================================================
    const onEditCancel = () => {
        setEntryToEdit(null)
    }

    const onDelete = (e, rowData) => {
        confirmPopup({
            target: e.target,
            message: `Delete entry?`,
            icon: 'pi pi-exclamation-triangle',
            accept: () =>
                mutationDeleteEntry.mutate({
                    id: rowData._id,
                    token: user.data.token,
                }),
            reject: () => null,
        })
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value
        let _filters = { ...filters }

        _filters['global'].value = value

        setFilters(_filters)
        setGlobalFilterValue(value)
    }
    // #endregion

    // #region TEMPLATES =============================================================================================================================
    const materialTemplate = (rowData) => {
        return <div>{rowData.material}</div>
    }

    const quantityTemplate = (rowData) => {
        return <div>{rowData.quantity}</div>
    }

    const actionsTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', gap: '10px' }}>
                <WaitListForm
                    isEditIcon
                    entryToEdit={rowData ? rowData : null}
                    onEditCancel={onEditCancel}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-danger"
                    onClick={(e) => onDelete(e, rowData)}
                />
            </div>
        )
    }

    const reminderTemplate = (rowData) => {
        return (
            <div>
                {rowData.reminder === true ? (
                    <i className="pi pi-check" style={{ fontSize: '1rem' }}></i>
                ) : (
                    <i className="pi pi-times" style={{ fontSize: '1rem' }}></i>
                )}
            </div>
        )
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Keyword Search"
                    />
                </span>
            </div>
        )
    }
    // #endregion

    const filterHeader = renderHeader()

    return (
        <div>
            <h1>Wait List </h1>
            <ConfirmPopup />

            <WaitListForm />

            <DataTable
                value={entries && entries.data}
                loading={entries && entries.loading}
                selectionMode="single"
                selection={rowSelected}
                onSelectionChange={(e) => setRowSelected(e.value)}
                paginator
                rows={10}
                dataKey="id"
                filters={filters}
                filterDisplay="row"
                globalFilterFields={[
                    'status',
                    'material',
                    'quantity',
                    'firstName',
                    'lastName',
                    'phone',
                    'email',
                ]}
                header={filterHeader}
                stripedRows
                rowHover
            >
                <Column field="status" header="Status"></Column>
                <Column
                    field="material"
                    header="Material"
                    body={materialTemplate}
                    sortable
                ></Column>
                <Column
                    field="quantity"
                    header="Quantity"
                    body={quantityTemplate}
                    sortable
                ></Column>
                <Column field="firstName" header="First Name" sortable></Column>
                <Column field="lastName" header="Last Name" sortable></Column>
                <Column field="phone" header="Phone" sortable></Column>
                <Column field="email" header="E-mail" sortable></Column>
                <Column field="notes" header="Notes" sortable></Column>
                <Column
                    field="alert"
                    header="Remind?"
                    body={reminderTemplate}
                    sortable
                ></Column>
                <Column header="Actions" body={actionsTemplate} />
            </DataTable>
        </div>
    )
}
