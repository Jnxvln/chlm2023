import { useState } from 'react'
import dayjs from 'dayjs'
import WaitListForm from '../../../components/user/dashboard/waitlist/WaitListForm'
import { Badge } from 'primereact/badge'
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
import { getActiveMaterials } from '../../../api/materials/materialsApi'
import { FilterMatchMode, FilterOperator } from 'primereact/api'

export default function WaitList() {
    const queryClient = useQueryClient()
    const user = useQuery(['user'], fetchUser)

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

    const materials = useQuery({
        queryKey: ['materials'],
        queryFn: getActiveMaterials,
        onError: (err) => {
            const errMsg = 'Error fetching materials for wait list table'
            console.log(errMsg)
            console.log(err)
            toast.error(errMsg, { autoClose: 5000 })
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
        if (e.target.value === '') {
            let _filters = { ...filters }
            _filters['global'].value = ''
            setFilters(_filters)
            setGlobalFilterValue(e.target.value)
        } else {
            const value = e.target.value
            let _filters = { ...filters }

            let entryMatch =
                entries && entries.data
                    ? entries.data.find((mat) =>
                          mat.material
                              .toLowerCase()
                              .includes(value.toLowerCase())
                      )
                    : null

            if (entryMatch) {
                _filters['global'].value = entryMatch.material
            } else {
                _filters['global'].value = value
            }

            setFilters(_filters)
            setGlobalFilterValue(value)
        }
    }

    const capitalize = (string) => {
        return string[0].toUpperCase() + string.slice(1)
    }
    // #endregion

    // #region TEMPLATES =============================================================================================================================

    const createdAtTemplate = (rowData) => {
        return <div>{dayjs(rowData.createdAt).format('MM/DD/YY')}</div>
    }

    const firstNameTemplate = (rowData) => {
        return <div style={{ whiteSpace: 'pre' }}>{rowData.firstName}</div>
    }

    const lastNameTemplate = (rowData) => {
        return <div style={{ whiteSpace: 'pre' }}>{rowData.lastName}</div>
    }

    const phoneTemplate = (rowData) => {
        return <div style={{ whiteSpace: 'pre' }}>{rowData.phone}</div>
    }

    const emailTemplate = (rowData) => {
        return <div style={{ whiteSpace: 'pre' }}>{rowData.email}</div>
    }

    const materialsIdToDiv = (matId) => {
        // console.log('[WaitList materialIdToName()] material id passed: ')
        // console.log(matId)

        if (materials && materials.data && materials.data.length > 0) {
            return (
                <div style={{ whiteSpace: 'pre' }}>
                    {materials.data.find((mat) => mat._id === matId)
                        ? materials.data.find((mat) => mat._id === matId).name
                        : '<Error>'}
                </div>
            )
        }
    }

    const materialTemplate = (rowData) => {
        return <div style={{ whiteSpace: 'pre' }}>{rowData.material}</div>
    }

    const quantityTemplate = (rowData) => {
        return <div style={{ whiteSpace: 'pre' }}>{rowData.quantity}</div>
    }

    const stockTemplate = (rowData) => {
        if (materials && materials.data) {
            let _stocks = []

            for (let i = 0; i < rowData.tags.length; i++) {
                _stocks.push(
                    materials.data.find((mat) => mat._id === rowData.tags[i])
                        .stock
                )
            }

            let divs = []
            for (let i = 0; i < _stocks.length; i++) {
                switch (_stocks[i].toLowerCase()) {
                    case 'notavail':
                        divs.push(
                            <div
                                key={`stk-${i}`}
                                style={{
                                    color: '#525252',
                                    fontWeight: 'normal',
                                    fontStyle: 'italic',
                                }}
                            >
                                Not Avail.
                            </div>
                        )
                        break
                    case 'new':
                        divs.push(
                            <div
                                key={`stk-${i}`}
                                style={{ color: '#039F58', fontWeight: 'bold' }}
                            >
                                New
                            </div>
                        )
                        break
                    case 'in':
                        divs.push(
                            <div
                                key={`stk-${i}`}
                                style={{ color: '#0C6C07', fontWeight: 'bold' }}
                            >
                                In
                            </div>
                        )
                        break
                    case 'low':
                        divs.push(
                            <div
                                key={`stk-${i}`}
                                style={{ color: 'orange', fontWeight: 'bold' }}
                            >
                                Low
                            </div>
                        )
                        break
                    case 'out':
                        divs.push(
                            <div
                                key={`stk-${i}`}
                                style={{ color: 'red', fontWeight: 'bold' }}
                            >
                                Out
                            </div>
                        )
                        break
                }
            }

            return <div style={{ whiteSpace: 'pre' }}>{divs}</div>
        } else {
            return '<ERR>'
        }
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

    const notesTemplate = (rowData) => {
        return <div style={{ whiteSpace: 'pre' }}>{rowData.notes}</div>
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-start">
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

            <br />

            <DataTable
                value={entries && entries.data}
                loading={entries && entries.loading}
                selectionMode="single"
                selection={rowSelected}
                onSelectionChange={(e) => setRowSelected(e.value)}
                paginator
                rows={10}
                size="small"
                dataKey="_id"
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
                <Column
                    field="createdAt"
                    header="Created"
                    body={createdAtTemplate}
                    sortable
                ></Column>
                <Column field="status" header="Status" sortable></Column>
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
                <Column
                    field="tags"
                    header="Stock"
                    body={stockTemplate}
                    sortable
                ></Column>
                <Column
                    field="firstName"
                    header="First Name"
                    body={firstNameTemplate}
                    sortable
                ></Column>
                <Column
                    field="lastName"
                    header="Last Name"
                    body={lastNameTemplate}
                    sortable
                ></Column>
                <Column
                    field="phone"
                    header="Phone"
                    body={phoneTemplate}
                    sortable
                ></Column>
                <Column
                    field="email"
                    header="E-mail"
                    body={emailTemplate}
                    sortable
                ></Column>
                <Column
                    field="notes"
                    header="Notes"
                    body={notesTemplate}
                    sortable
                ></Column>
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
