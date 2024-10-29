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
import { InputSwitch } from 'primereact/inputswitch'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { FileUpload } from 'primereact/fileupload'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Image } from 'primereact/image'
import { Chips } from 'primereact/chips'

// Data
import {
    getActiveMaterials,
    createMaterial,
} from '../../../../api/materials/materialsApi'
import { getMaterialCategories } from '../../../../api/materialCategories/materialCategoriesApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

window.Buffer = window.Buffer || require('buffer').Buffer

function MaterialForm({ keys }) {
    const queryClient = useQueryClient()

    // #region VARS ---------------------------------------------------------

    const initialState = {
        category: '',
        name: '',
        image: '',
        binNumber: '',
        size: '',
        stock: '',
        notes: '',
        description: '',
        keywords: [],
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
    const [formDialog, setFormDialog] = useState(false)
    const [formData, setFormData] = useState(initialState)
    const [uploading, setUploading] = useState(false)

    // Select materials from store
    const materials = useQuery(['materials'], getActiveMaterials)

    const materialCategories = useQuery(
        ['materialCategories'],
        getMaterialCategories
    )

    const user = useQuery(['user'], () => {
        return JSON.parse(localStorage.getItem('user'))
    })

    const mutationAddMaterial = useMutation({
        mutationKey: ['materials'],
        mutationFn: (formData) => {
            return createMaterial(formData, user.data.token)
        },
        onSuccess: (createdMaterial) => {
            toast.success(createdMaterial.name + ' created', { toastId: 'material-form-add-material-success' })
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['materials'] })
        },
        onError: (err) => {
            console.log('ERROR CREATING MATERIAL:')
            console.log(err)
            toast.error('Error creating material, check logs!', {
                autoClose: false,
                toastId: 'material-form-add-material-error'
            })
        },
    })

    const {
        category,
        name,
        image,
        binNumber,
        size,
        stock,
        notes,
        description,
        keywords,
        isFeatured,
        isTruckable,
        isActive,
    } = formData
    // #endregion

    // #region COMPONENT RENDERERS ------------------------------------------
    const materialDialogHeader = () => {
        return <DialogHeader resourceType="Material" isEdit={false} />
    }

    const materialDialogFooter = () => {
        return <DialogFooter onClose={onClose} onSubmit={onSubmit} />
    }
    // #endregion

    // #region FORM HANDLERS ------------------------------------------------
    // Handle form reset
    const resetForm = () => {
        setFormData(initialState)
    }

    // Handle form closing
    const onClose = () => {
        resetForm()
        setFormDialog(false)
    }

    // Handle form input
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const onChangeChips = (e) => {
        // Trim and convert to lower case
        let targets = e.target.value
        for (let i = 0; i < targets.length; i++) {
            targets[i] = targets[i].toString().trim().toLowerCase()
        }
        // console.log('Targets: ')
        // console.log(targets)

        // Set form data
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: targets,
        }))
    }

    // Handle form submit
    const onSubmit = (e) => {
        e.preventDefault()

        if (!name) {
            return toast.error('Name is required', { toastId: 'material-form-submit-err-name-required' })
        }

        if (!category) {
            return toast.error('Category is required', { toastId: 'material-form-submit-err-category-required' })
        }

        if (!stock) {
            return toast.error('Stock is required', { toastId: 'material-form-submit-err-stock-required' })
        }

        // dispatch(createMaterial(formData));
        // alert("TODO: Submit material!");
        mutationAddMaterial.mutate(formData)

        onClose()
    }

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
                        toast.success('Image uploaded successfully!', { toastId: 'material-form-file-upload-form-success' })
                        setFormData((prevState) => ({
                            ...prevState,
                            image: data.location,
                        }))
                    } else if (data) {
                        console.log(
                            '[MaterialForm] ERROR: Expected `location` property on `data`. Printing `data`: '
                        )
                        console.log(data)
                        toast.error(
                            'Error uploading image to AWS! Check logs',
                            { autoClose: 8000, toastId: 'mat-err-upl-log-msg' }
                        )
                    } else {
                        console.log(
                            '[MaterialForm] ERROR, no `data` property found on AWS response'
                        )
                        toast.error(
                            'Error uploading image to AWS! Check logs',
                            { autoClose: 8000, toastId: 'material-form-file-upload-err' }
                        )
                    }
                })
                .catch((err) => console.log(err))
        } else {
            console.log('[MaterialForm] Image Uploader Error: AWS keys not set')
        }
    }

    // #endregion

    return (
        <section>
            <Button
                label="New Material"
                icon="pi pi-plus"
                onClick={() => setFormDialog(true)}
            />

            <Dialog
                id="newMaterialDialog"
                visible={formDialog}
                header={materialDialogHeader}
                footer={materialDialogFooter}
                onHide={onClose}
                style={{ width: '50vw' }}
                blockScroll
            >
                <form onSubmit={onSubmit}>
                    <div className="formgrid grid">
                        <div className="field col">
                            {/* Existing Image */}
                            {image && image.length > 0 && (
                                <div>
                                    <Image
                                        src={image}
                                        alt={name}
                                        width="200"
                                        height="200"
                                        preview
                                    />
                                </div>
                            )}
                        </div>
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
                        {/* Name */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputText
                                        id="name"
                                        name="name"
                                        value={name}
                                        placeholder="Name *"
                                        onChange={onChange}
                                        style={{ width: '100%' }}
                                        autoFocus
                                        required
                                    />
                                    <label htmlFor="name">Name *</label>
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
                                    <label htmlFor="category">Category *</label>
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
                                    <label htmlFor="stock">Stock *</label>
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

                    {/* KEYWORDS */}
                    <div className="formgrid grid">
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <Chips
                                        id="keywords"
                                        name="keywords"
                                        placeholder="Keywords (separate with a comma)"
                                        separator=","
                                        value={keywords}
                                        onChange={onChangeChips}
                                        className="input-chips"
                                    />
                                    <label htmlFor="keywords">Keywords</label>
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

export default MaterialForm
