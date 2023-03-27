import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import MaterialForm from '../../../components/user/dashboard/materials/MaterialForm'
import EditMaterialForm from '../../../components/user/dashboard/materials/EditMaterialForm'
// import Spinner from "../../../components/layout/Spinner";
// PrimeReact Components
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { ProgressBar } from 'primereact/progressbar'
import { TriStateCheckbox } from 'primereact/tristatecheckbox'
import { ConfirmPopup } from 'primereact/confirmpopup' // To use <ConfirmPopup> tag
import { confirmPopup } from 'primereact/confirmpopup' // To use confirmPopup method
import { FilterMatchMode } from 'primereact/api'
import { classNames } from 'primereact/utils'
import { Image } from 'primereact/image'
// Data
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getActiveMaterials,
    deleteMaterial,
} from '../../../api/materials/materialsApi'
import { getMaterialCategories } from '../../../api/materialCategories/materialCategoriesApi'

function MaterialsDashboard() {
    const queryClient = useQueryClient()
    // #region VARS ------------------------
    const stockStatuses = ['new', 'in', 'low', 'out', 'notavail']
    const [categoryFilter, setCategoryFilter] = useState(null)
    const [token, setToken] = useState(null)
    const [globalFilterValue2, setGlobalFilterValue2] = useState('')
    const [materialRowSelected, setMaterialRowSelected] = useState(null)
    const [filters2, setFilters2] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        stock: { value: null, matchMode: FilterMatchMode.EQUALS },
        category: { value: null, matchMode: FilterMatchMode.CONTAINS },
        isFeatured: { value: null, matchMode: FilterMatchMode.EQUALS },
        isActive: { value: null, matchMode: FilterMatchMode.EQUALS },
        isTruckable: { value: null, matchMode: FilterMatchMode.EQUALS },
    })

    const materials = useQuery({
        queryKey: ['materials'],
        queryFn: getActiveMaterials,
    })

    const materialCategories = useQuery({
        queryKey: ['materialCategories'],
        queryFn: getMaterialCategories,
    })

    const user = useQuery({
        queryKey: ['user'],
        queryFn: () => JSON.parse(localStorage.getItem('user')),
        onSuccess: (user) => {
            setToken(user.token)
        },
    })

    const keys = useQuery({
        queryKey: ['awsKeys'],
        queryFn: () => getAwsKeys(),
        enabled: !!user?.data?._id,
        onError: (err) => {
            toast.error('[MaterialsDashboard] Error settings AWS keys', {
                autoClose: 8000,
            })
            console.log(err)
        },
        refetchOnWindowFocus: false,
    })
    // #endregion

    const mutationDeleteMaterial = useMutation({
        mutationKey: ['materials'],
        mutationFn: ({ _id, token }) => deleteMaterial(_id, token),
        onSuccess: (delId) => {
            if (delId) {
                toast.success('Material deleted')
                queryClient.invalidateQueries(['materials'])
            }
        },
        onError: (err) => {
            console.log('Error deleting material: ')
            console.log(err)
            toast.error('Error deleting material', { autoClose: false })
        },
    })

    // #region DATA TABLE TEMPLATES
    const imageBodyTemplate = (rowData) => {
        return (
            <Image
                src={`${rowData.image}`}
                width="100%"
                height="auto"
                alt={rowData.name}
                className="material-img"
                preview
            />
        )
    }

    const categoryTemplate = (rowData) => {
        return (
            <span className={`product-badge status-${rowData.category}`}>
                {categoryRowTemplate(rowData)}
            </span>
        )
    }

    const categoryRowFilterTemplate = (options) => {
        return (
            <Dropdown
                value={categoryFilter}
                options={materialCategories.data}
                optionLabel="name"
                optionValue="_id"
                onChange={(e) => {
                    setCategoryFilter(e.value)
                    return options.filterApplyCallback(e.value)
                }}
                itemTemplate={categoryItemTemplate}
                placeholder="Choose..."
                className="p-column-filter"
            />
        )
    }

    const categoryItemTemplate = (option) => {
        return (
            <span className={`category status-${option.name}`}>
                {option.name}
            </span>
        )
    }

    const stockTemplate = (rowData) => {
        let progress = {
            value: '',
            color: '',
        }

        switch (rowData.stock.toLowerCase()) {
            case 'new':
                progress.value = 100
                progress.color = '#68DF2C'
                break
            case 'in':
                progress.value = 50
                progress.color = '#F4BD2B'
                break
            case 'low':
                progress.value = 25
                progress.color = '#F37531'
                break
            case 'out':
                progress.value = 2
                progress.color = '#DF1C1C'
                break
            case 'notavail':
                progress.value = 0
                progress.color = '#F35131'
                break
            default:
                progress.value = 0
                progress.color = '#F35131'
                break
        }

        return (
            <div style={{ width: '100%' }}>
                <ProgressBar
                    value={progress.value}
                    color={progress.color}
                    style={{ height: '6px' }}
                />
            </div>
        )
    }

    const stockItemTemplate = (option) => {
        return (
            <span className={`customer-badge status-${option}`}>{option}</span>
        )
    }

    const stockRowFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={stockStatuses}
                onChange={(e) => {
                    return options.filterApplyCallback(e.value)
                }}
                itemTemplate={stockItemTemplate}
                placeholder="Choose..."
                className="p-column-filter"
            />
        )
    }

    const categoryRowTemplate = (rowData) => {
        let mat
        if (
            materialCategories &&
            materialCategories.data &&
            materialCategories.data.length > 0
        ) {
            mat = materialCategories.data.find(
                (cat) => cat._id === rowData.category
            )
            return mat ? <>{mat.name}</> : <></>
        }
    }

    const binNumberTemplate = (rowData) => {
        return (
            <>
                {rowData.binNumber ? (
                    <span>Bin #{rowData.binNumber}</span>
                ) : (
                    <span></span>
                )}
            </>
        )
    }

    const actionsTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex' }}>
                <EditMaterialForm material={rowData} keys={keys.data} />
                <Button
                    icon="pi pi-trash"
                    className="p-button-danger"
                    onClick={(e) => onDelete(e, rowData)}
                />
            </div>
        )
    }

    const isFeaturedTemplate = (rowData) => {
        return (
            <i
                className={classNames('pi', {
                    'true-icon pi-check-circle': rowData.isFeatured,
                })}
            ></i>
        )
    }

    const isActiveTemplate = (rowData) => {
        return (
            <i
                className={classNames('pi', {
                    'true-icon pi-check-circle': rowData.isActive,
                })}
            ></i>
        )
    }

    const isTruckableTemplate = (rowData) => {
        return (
            <i
                className={classNames('pi', {
                    'true-icon pi-check-circle': rowData.isTruckable,
                })}
            ></i>
        )
    }

    const verifiedRowFilterTemplate = (options) => {
        return (
            <TriStateCheckbox
                value={options.value}
                onChange={(e) => options.filterApplyCallback(e.value)}
            />
        )
    }
    // #endregion

    // #region FILTER HANDLERS
    const onGlobalFilterChange2 = (e) => {
        const value = e.target.value
        let _filters2 = { ...filters2 }
        _filters2['global'].value = value

        setFilters2(_filters2)
        setGlobalFilterValue2(value)
    }
    // #endregion

    // Handle delete material
    const onDelete = (e, rowData) => {
        confirmPopup({
            target: e.target,
            message: `Delete material ${rowData.name}?`,
            icon: 'pi pi-exclamation-triangle',
            // accept: () => dispatch(deleteMaterial(rowData._id)),
            accept: () =>
                mutationDeleteMaterial.mutate({ _id: rowData._id, token }),
            reject: () => null,
        })
    }

    const renderHeader = () => {
        return (
            <div className="flex gap-4">
                <div>
                    <MaterialForm keys={keys.data} />
                </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue2}
                        onChange={onGlobalFilterChange2}
                        placeholder="Keyword Search"
                    />
                </span>
            </div>
        )
    }

    const getAwsKeys = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${user?.data?.token}`,
            },
        }

        const response = await axios.get('/api/awsKeys', config)
        return response.data
    }

    return (
        <section>
            <h1 style={{ textAlign: 'center', fontSize: '20pt' }}>
                C&H Materials
            </h1>

            <br />
            <br />

            <ConfirmPopup />

            <div className="datatable-templating-demo">
                <div className="card" style={{ height: 'calc(100vh - 145px)' }}>
                    <DataTable
                        value={materials.data}
                        header={renderHeader}
                        globalFilterFields={[
                            'name',
                            'category',
                            'stock',
                            'binNumber',
                            'isActive',
                            'isTruckable',
                        ]}
                        size="small"
                        scrollable
                        scrollHeight="flex"
                        sortMode="multiple"
                        responsiveLayout="scroll"
                        selectionMode="single"
                        selection={materialRowSelected}
                        onSelectionChange={(e) =>
                            setMaterialRowSelected(e.value)
                        }
                        dataKey="_id"
                        stateStorage="session"
                        stateKey="dt-materials-session"
                        filter="true"
                        filters={filters2}
                        filterfield="name"
                        filterDisplay="row"
                        onFilter={(e) => setFilters2(e.filters)}
                        emptyMessage="No materials found"
                        stripedRows
                    >
                        {/* IMAGE COLUMN */}
                        <Column
                            header="Image"
                            style={{ minWidth: '120px' }}
                            body={imageBodyTemplate}
                        ></Column>

                        {/* BIN NUMBER COLUMN */}
                        <Column
                            sortable
                            header="Bin"
                            body={binNumberTemplate}
                        ></Column>

                        {/* NAME COLUMN */}
                        <Column
                            field="name"
                            header="Name"
                            style={{ minWidth: '14rem' }}
                            sortable
                        ></Column>

                        {/* CATEGORY COLUMN */}
                        <Column
                            field="category"
                            header="Category"
                            body={categoryTemplate}
                            filter
                            filterElement={categoryRowFilterTemplate}
                            showFilterMenu={false}
                            filterMenuStyle={{ width: '14rem' }}
                            style={{ minWidth: '14rem' }}
                        ></Column>

                        {/* STOCK COLUMN */}
                        <Column
                            field="stock"
                            header="Stock"
                            body={stockTemplate}
                            filter
                            filterElement={stockRowFilterTemplate}
                            showFilterMenu={false}
                            filterMenuStyle={{ width: '14rem' }}
                            style={{ minWidth: '8rem' }}
                        ></Column>

                        {/* SIZE COLUMN */}
                        <Column sortable field="size" header="Size"></Column>

                        {/* ISFEATURED COLUMN */}
                        <Column
                            field="isFeatured"
                            header="Featured"
                            dataType="boolean"
                            filter
                            filterElement={verifiedRowFilterTemplate}
                            body={isFeaturedTemplate}
                            sortable
                        ></Column>

                        {/* ISACTIVE COLUMN */}
                        <Column
                            field="isActive"
                            header="Active"
                            dataType="boolean"
                            filter="true"
                            filterfield="isActive"
                            filterElement={verifiedRowFilterTemplate}
                            body={isActiveTemplate}
                            sortable
                        ></Column>

                        {/* ISTRUCKABLE COLUMN */}
                        <Column
                            field="isTruckable"
                            header="Truckable"
                            dataType="boolean"
                            filter="true"
                            filterfield="isTruckable"
                            filterElement={verifiedRowFilterTemplate}
                            body={isTruckableTemplate}
                            sortable
                        ></Column>
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

export default MaterialsDashboard
