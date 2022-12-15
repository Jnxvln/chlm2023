import { useState, useEffect } from 'react'
import DialogHeader from '../../../dialogComponents/DialogHeader'
import DialogFooter from '../../../dialogComponents/DialogFooter_SubmitClose'
import { toast } from 'react-toastify'
import { uploadFile } from 'react-s3'
import axios from 'axios'
// PrimeReact Components
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { InputSwitch } from 'primereact/inputswitch'
import { InputTextarea } from 'primereact/inputtextarea'
import { FileUpload } from 'primereact/fileupload'
import { ProgressSpinner } from 'primereact/progressspinner'
// Select data
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getMaterialCategories } from '../../../../api/materialCategories/materialCategoriesApi'
import { updateMaterial } from '../../../../api/materials/materialsApi'

window.Buffer = window.Buffer || require('buffer').Buffer

function EditMaterialForm({ material, keys }) {
    const queryClient = useQueryClient()
    // #region VARS ------------------------
    const initialState = {
        _id: '',
        category: '',
        name: '',
        image: '',
        binNumber: '',
        size: '',
        stock: '',
        notes: '',
        description: '',
        isFeatured: false,
        isTruckable: false,
        isActive: true,
    }

    const stockStatuses = [
        {
            label: 'New',
            value: 'new',
        },
        {
            label: 'In',
            value: 'in',
        },
        {
            label: 'Low',
            value: 'low',
        },
        {
            label: 'Out',
            value: 'out',
        },
        {
            label: 'Not Avail',
            value: 'notavail',
        },
    ]

    const [token, setToken] = useState(null)
    const [formDialog, setFormDialog] = useState(false)
    const [formData, setFormData] = useState(initialState)
    // const [keys, setKeys] = useState(null)
    const [uploading, setUploading] = useState(false)

    // Select materials from state
    const user = useQuery({
        queryKey: ['user'],
        queryFn: () => JSON.parse(localStorage.getItem('user')),
        onSuccess: (user) => {
            setToken(user.token)
        },
    })

    const materialCategories = useQuery(
        ['materialCategories'],
        getMaterialCategories
    )

    const mutationUpdate = useMutation({
        mutationKey: ['materials'],
        mutationFn: ({ formData, token }) => updateMaterial(formData, token),
        onSuccess: (updMaterial) => {
            toast.success(`${updMaterial.name} updated`, { autoClose: 1000 })
            queryClient.invalidateQueries(['materials'])
        },
        onError: (err) => {
            console.log('Error updating material: ')
            console.log(err)
            toast.error('Error updating material', { autoClose: false })
        },
    })

    const {
        _id,
        category,
        name,
        image,
        binNumber,
        size,
        stock,
        notes,
        description,
        isFeatured,
        isTruckable,
        isActive,
    } = formData
    // #endregion

    // #region COMPONENT RENDERERS
    const materialDialogHeader = () => {
        return (
            <DialogHeader
                resourceType="Material"
                resourceName={material.name}
                isEdit
            />
        )
    }

    const materialDialogFooter = () => {
        return <DialogFooter onClose={onClose} onSubmit={onSubmit} />
    }
    // #endregion

    // #region FORM HANDLERS
    // Handle reset form
    const resetForm = () => {
        if (material) {
            setFormData((prevState) => ({
                ...prevState,
                _id: material._id,
                name: material.name,
                category: material.category,
                image: material.image,
                binNumber: material.binNumber,
                size: material.size,
                stock: material.stock,
                notes: material.notes,
                description: material.description,
                isFeatured: material.isFeatured,
                isActive: material.isFeatured,
                isTruckable: material.isTruckable,
            }))
        } else {
            setFormData(initialState)
        }
    }

    // Handle form closing
    const onClose = () => {
        resetForm()
        setFormDialog(false)
    }
    // Handle form change
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    // Handle form submit
    const onSubmit = (e) => {
        e.preventDefault()
        mutationUpdate.mutate({ formData, token })
        onClose()
    }

    // const getAwsKeys = async () => {
    //     const config = {
    //         headers: {
    //             Authorization: `Bearer ${user?.data?.token}`,
    //         },
    //     }

    //     const response = await axios.get('/api/awsKeys', config)
    //     return response.data
    // }

    const handleImageUpload = (e) => {
        // e.files == files to upload

        if (keys) {
            let config = {
                bucketName: keys.bucketName,
                dirName: 'materials',
                region: keys.awsRegion,
                accessKeyId: keys.accessKeyId,
                secretAccessKey: keys.accessKey,
                s3Url: 's3://django-chlmweb-files/materials/',
            }

            setUploading(true)

            uploadFile(e.files[0], config)
                .then((data) => {
                    setUploading(false)
                    if (data && data.location) {
                        console.log(
                            '[EditMaterialForm] AWS Upload data.location: '
                        )
                        console.log(data.location)
                        toast.success('Image uploaded successfully!')
                        setFormData((prevState) => ({
                            ...prevState,
                            image: data.location,
                        }))
                    } else if (data) {
                        console.log(
                            '[EditMaterialForm] ERROR: Expected `location` property on `data`. Printing `data`: '
                        )
                        console.log(data)
                        toast.error(
                            'Error uploading image to AWS! Check logs',
                            { autoClose: 8000 }
                        )
                    } else {
                        console.log(
                            '[EditMaterialForm] ERROR, no `data` property found on AWS response'
                        )
                        toast.error(
                            'Error uploading image to AWS! Check logs',
                            { autoClose: 8000 }
                        )
                    }
                })
                .catch((err) => console.log(err))
        } else {
            console.log(
                '[EditMaterialForm] Image Uploader Error: AWS keys not set'
            )
        }
    }
    // #endregion

    // #region USE EFFECTS -------------------------------------------------------------
    // Fill FormData with contents of Material prop
    useEffect(() => {
        if (material) {
            setFormData((prevState) => ({
                ...prevState,
                _id: material._id,
                name: material.name,
                category: material.category,
                image: material.image,
                binNumber: material.binNumber,
                size: material.size,
                stock: material.stock,
                notes: material.notes,
                description: material.description,
                isFeatured: material.isFeatured,
                isActive: material.isFeatured,
                isTruckable: material.isTruckable,
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // #endregion

    return (
        <section>
            <Button
                icon="pi pi-pencil"
                iconPos="left"
                style={{ marginRight: '0.5em' }}
                onClick={(e) => setFormDialog(true)}
            />

            <Dialog
                id="editMaterialDialog"
                visible={formDialog}
                style={{ width: '50vw' }}
                header={materialDialogHeader}
                footer={materialDialogFooter}
                onHide={onClose}
                blockScroll
            >
                <form onSubmit={onSubmit}>
                    <div className="formgrid grid">
                        <div className="field col">
                            {/* Image */}
                            {keys && (
                                <div className="field col">
                                    <div style={{ margin: '0.8em 0' }}>
                                        <span className="p-float-label">
                                            <FileUpload
                                                name="image"
                                                url=""
                                                mode="advanced"
                                                accept="image/*"
                                                customUpload
                                                uploadHandler={
                                                    handleImageUpload
                                                }
                                            />
                                            <label htmlFor="image">Image</label>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* NAME, CATEGORY, BIN NUMBER */}
                    <div className="formgrid grid">
                        {/* ID */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputText
                                        id="_id"
                                        name="_id"
                                        value={_id}
                                        placeholder="ID"
                                        onChange={onChange}
                                        style={{ width: '100%' }}
                                        readOnly
                                        required
                                    />
                                    <label htmlFor="_id">ID</label>
                                </span>
                            </div>
                        </div>

                        {/* Name */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputText
                                        id="name"
                                        name="name"
                                        value={name}
                                        placeholder="Name"
                                        onChange={onChange}
                                        style={{ width: '100%' }}
                                        autoFocus
                                        required
                                    />
                                    <label htmlFor="name">Name</label>
                                </span>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <Dropdown
                                        name="category"
                                        optionLabel="name"
                                        optionValue="_id"
                                        value={category}
                                        options={materialCategories.data}
                                        onChange={onChange}
                                        filter
                                        showClear
                                        filterBy="name"
                                        placeholder="Choose..."
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="category">Category</label>
                                </span>
                            </div>
                        </div>

                        {/* Bin Number */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputText
                                        id="binNumber"
                                        name="binNumber"
                                        value={binNumber}
                                        placeholder="Bin #"
                                        onChange={onChange}
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="binNumber">Bin #</label>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* IMAGE, SIZE, STOCK */}
                    <div className="formgrid grid">
                        {/* Image */}
                        <div className="field col">
                            {uploading ? (
                                <ProgressSpinner
                                    style={{ width: '50px', height: '50px' }}
                                    strokeWidth="8"
                                    fill="var(--surface-ground)"
                                    animationDuration=".5s"
                                />
                            ) : (
                                <div style={{ margin: '0.8em 0' }}>
                                    <span className="p-float-label">
                                        <InputText
                                            id="image"
                                            name="image"
                                            value={image}
                                            placeholder="Image"
                                            onChange={onChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="image">Image</label>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Size */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputText
                                        id="size"
                                        name="size"
                                        value={size}
                                        placeholder="Size"
                                        onChange={onChange}
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="size">Size</label>
                                </span>
                            </div>
                        </div>

                        {/* Stock */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <Dropdown
                                        name="stock"
                                        optionLabel="label"
                                        optionValue="value"
                                        value={stock}
                                        options={stockStatuses}
                                        onChange={onChange}
                                        placeholder="Choose..."
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="stock">Stock</label>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* NOTES, DESCRIPTION */}
                    <div className="formgrid grid">
                        {/* Notes */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputTextarea
                                        id="notes"
                                        name="notes"
                                        value={notes}
                                        placeholder="Notes"
                                        onChange={onChange}
                                        rows={5}
                                        cols={30}
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="notes">Notes</label>
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputTextarea
                                        id="description"
                                        name="description"
                                        value={description}
                                        placeholder="Description"
                                        onChange={onChange}
                                        rows={5}
                                        cols={30}
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="description">
                                        Description
                                    </label>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* FEATURED, TRUCKABLE, ACTIVE  */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'center',
                            gap: '25px',
                        }}
                    >
                        {/* Featured */}
                        <div style={{ margin: '0.8em' }}>
                            <InputSwitch
                                id="isFeatured"
                                name="isFeatured"
                                checked={isFeatured}
                                onChange={onChange}
                            />
                            <strong style={{ marginLeft: '0.5em' }}>
                                Featured
                            </strong>
                        </div>

                        {/* Truckable */}
                        <div style={{ margin: '0.8em 0' }}>
                            <InputSwitch
                                id="isTruckable"
                                name="isTruckable"
                                checked={isTruckable}
                                onChange={onChange}
                            />
                            <strong style={{ marginLeft: '0.5em' }}>
                                Truckable
                            </strong>
                        </div>

                        {/* Active */}
                        <div style={{ margin: '0.8em 0' }}>
                            <InputSwitch
                                id="isActive"
                                name="isActive"
                                checked={isActive}
                                onChange={onChange}
                            />
                            <strong style={{ marginLeft: '0.5em' }}>
                                Active
                            </strong>
                        </div>
                    </div>
                </form>
            </Dialog>
        </section>
    )
}

export default EditMaterialForm
