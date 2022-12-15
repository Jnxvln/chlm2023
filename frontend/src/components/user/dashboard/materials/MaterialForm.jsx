import { useState, useEffect } from 'react'
import DialogHeader from '../../../dialogComponents/DialogHeader'
import DialogFooter from '../../../dialogComponents/DialogFooter_SubmitClose'
import { toast } from 'react-toastify'
import { uploadFile } from 'react-s3'
import axios from 'axios'
import { Buffer } from 'buffer'
// PrimeReact Components
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputSwitch } from 'primereact/inputswitch'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { Image } from 'primereact/image'
import { FileUpload } from 'primereact/fileupload'

// Data
import {
    getActiveMaterials,
    createMaterial,
} from '../../../../api/materials/materialsApi'
import { getMaterialCategories } from '../../../../api/materialCategories/materialCategoriesApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

window.Buffer = window.Buffer || require('buffer').Buffer

function MaterialForm() {
    const queryClient = useQueryClient()

    // const S3_BUCKET = 'your_bucket_name'
    // const REGION = 'us-east-1'
    // const dispatch = useDispatch()
    // const config = {
    //     bucketName: S3_BUCKET,
    //     dirName: 'images',
    //     region: REGION,
    //     accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    //     secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
    //     s3Url: 'your_bucket_url_from_static_website_hosting',
    // }

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
    // const dispatch = useDispatch();

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
            toast.success(createdMaterial.name + ' created')
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['materials'] })
        },
        onError: (err) => {
            console.log('ERROR CREATING MATERIAL:')
            console.log(err)
            toast.error('Error creating material, check logs!', {
                autoClose: false,
            })
        },
    })

    const [keys, setKeys] = useState(null)

    const {
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

    // Handle form submit
    const onSubmit = (e) => {
        e.preventDefault()

        if (!name) {
            return toast.error('Name is required')
        }

        if (!category) {
            return toast.error('Category is required')
        }

        if (!stock) {
            return toast.error('Stock is required')
        }

        // dispatch(createMaterial(formData));
        // alert("TODO: Submit material!");
        mutationAddMaterial.mutate(formData)

        onClose()
    }

    const getAwsKeys = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${user?.data?.token}`,
            },
        }

        const response = await axios.get('/api/awsKeys', config)
        console.log('Response data: ')
        console.log(response.data)
        response && response.data ? setKeys(response.data) : setKeys()
    }

    const handleImageUpload = (e) => {
        // e.files == files to upload
        console.log('e.files: ')
        console.log(e.files)

        if (keys) {
            let config = {
                bucketName: keys.bucketName,
                dirName: 'materials',
                region: keys.awsRegion,
                accessKeyId: keys.accessKeyId,
                secretAccessKey: keys.accessKey,
                s3Url: 's3://django-chlmweb-files/materials/',
            }

            uploadFile(e.files[0], config)
                .then((data) => {
                    console.log('AWS Upload data.location: ')
                    console.log(data.location)
                    if (data && data.location) {
                        setFormData((prevState) => ({
                            ...prevState,
                            image: data.location,
                        }))
                    }
                })
                .catch((err) => console.log(err))
        }
    }

    // #endregion

    // #region USE EFFECTS =====================================================
    useEffect(() => {
        if (!keys) {
            getAwsKeys()
        }
    }, [])

    useEffect(() => {
        if (keys) {
            console.log('Keys set: ')
            console.log(keys)
        }
    }, [keys])
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
                            {/* Image */}
                            <div className="field col">
                                <div style={{ margin: '0.8em 0' }}>
                                    <span className="p-float-label">
                                        <FileUpload
                                            name="image"
                                            url=""
                                            mode="advanced"
                                            accept="image/*"
                                            customUpload
                                            uploadHandler={handleImageUpload}
                                        />
                                        <label htmlFor="image">Image</label>
                                    </span>
                                </div>
                            </div>
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
                        {/* <div className="field col">
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
                        </div> */}

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
