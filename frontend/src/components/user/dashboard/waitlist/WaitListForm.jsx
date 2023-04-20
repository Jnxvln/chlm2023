import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Checkbox } from 'primereact/checkbox'
import { InputTextarea } from 'primereact/inputtextarea'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { fetchUser } from '../../../../api/users/usersApi'
import { createEntry, updateEntry } from '../../../../api/waitList/waitList'

export default function WaitListForm({
    entryToEdit,
    onEditCancel,
    isEditIcon,
}) {
    // #region VARS =========================================================================================================================
    const user = useQuery(['user'], fetchUser)
    const queryClient = useQueryClient()

    const initialForm = {
        id: '',
        dateCreated: '',
        dateModified: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        material: '',
        quantity: '',
        status: '',
        notes: '',
        reminder: true,
    }

    const [visible, setVisible] = useState(false)
    const [form, setForm] = useState(initialForm)
    const [statuses] = useState([
        {
            name: 'Choose',
            value: null,
        },
        {
            name: 'Waiting',
            value: 'waiting',
        },
        {
            name: 'Informed',
            value: 'informed',
        },
        {
            name: 'Call Back',
            value: 'callback',
        },
        {
            name: 'Awaiting Call',
            value: 'awaitingcall',
        },
    ])
    const {
        id,
        firstName,
        lastName,
        phone,
        email,
        material,
        quantity,
        status,
        notes,
        reminder,
    } = form

    // Create entry mutation
    const mutationCreateEntry = useMutation({
        mutationKey: ['waitlist'],
        mutationFn: ({ form, token }) => createEntry(form, token),
        onSuccess: (entry) => {
            if (entry) {
                toast.success(`Entry created`, { autoFocus: 3000 })
                queryClient.invalidateQueries(['waitlist'])
            }
        },
        onError: (err) => {
            const errMsg = `Error creating waitlist entry`
            console.log(errMsg)
            console.log(err)

            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                toast.error(err.response.data.message, { autoClose: 8000 })
            } else {
                toast.error(errMsg, { autoClose: 8000 })
            }
        },
    })

    const mutationUpdateEntry = useMutation({
        mutationKey: ['waitlist'],
        mutationFn: ({ form, token }) => updateEntry(form, token),
        onSuccess: (updEntry) => {
            if (updEntry) {
                toast.success(`Entry updated`, { autoClose: 1000 })
                queryClient.invalidateQueries(['waitlist'])
            }
        },
        onError: (err) => {
            const errMsg = 'Error updating entry'
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

    // #region ACTION HANDLERS ==============================================================================================================
    const onResetForm = () => {
        setForm(initialForm)
    }

    const onCancel = () => {
        onResetForm()
        if (onEditCancel) {
            onEditCancel()
        }
        setVisible(false)
    }

    const onClose = () => {
        onResetForm()
        setVisible(false)
    }

    const footerContent = () => {
        return (
            <div className="flex justify-content-end gap-2">
                <Button
                    label="Cancel"
                    style={{ backgroundColor: '#5E5E5E' }}
                    onClick={onCancel}
                />
                <Button
                    label="Save"
                    className="p-button-primary"
                    onClick={onSubmit}
                />
            </div>
        )
    }

    const onSubmit = (e) => {
        e.preventDefault()

        // #region ERROR CHECKS
        if (!phone) {
            return toast.error('Phone is required', { autoClose: 3000 })
        }

        if (!material) {
            return toast.error('Material is required', { autoClose: 3000 })
        }

        if (!quantity) {
            return toast.error('Quantity is required', { autoClose: 3000 })
        }

        if (entryToEdit !== null && isEditIcon) {
            // Update entry
            mutationUpdateEntry.mutate({ form, token: user.data.token })
            onClose()
        } else {
            // New entry
            mutationCreateEntry.mutate({ form, token: user.data.token })
            onClose()
        }
    }

    const onChange = (e) => {
        setForm((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onChangeCheckbox = (e) => {
        setForm((prevState) => ({
            ...prevState,
            reminder: e.checked,
        }))
    }
    // #endregion

    useEffect(() => {
        if (visible && entryToEdit !== null && entryToEdit !== undefined) {
            setForm((prevState) => ({
                ...prevState,
                id: entryToEdit._id,
                firstName: entryToEdit.firstName,
                lastName: entryToEdit.lastName,
                phone: entryToEdit.phone,
                email: entryToEdit.email,
                material: entryToEdit.material,
                quantity: entryToEdit.quantity,
                status: entryToEdit.status,
                notes: entryToEdit.notes,
                reminder: entryToEdit.reminder,
            }))
            setVisible(true)
        }
    }, [entryToEdit, visible])

    return (
        <div>
            <Button
                icon={isEditIcon ? 'pi pi-pencil' : 'pi pi-plus'}
                label={isEditIcon ? null : 'Add'}
                onClick={() => setVisible(true)}
            />
            <Dialog
                header={
                    entryToEdit !== null && isEditIcon
                        ? 'Edit Entry'
                        : 'New Entry'
                }
                visible={visible}
                style={{ width: '40vw' }}
                onHide={() => setVisible(false)}
                footer={footerContent}
            >
                <form onSubmit={onSubmit}>
                    {/* ID */}
                    {isEditIcon && (
                        <div className="formgrid grid mb-3">
                            <div className="field col">
                                <span className="p-float-label">
                                    <InputText
                                        id="id"
                                        name="id"
                                        value={id}
                                        readOnly
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="id">ID</label>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* FIRST NAME & LAST NAME */}
                    <div className="formgrid grid mb-3">
                        {/* First Name */}
                        <div className="field col">
                            <span className="p-float-label">
                                <InputTextarea
                                    id="firstName"
                                    name="firstName"
                                    value={firstName}
                                    onChange={onChange}
                                    autoFocus
                                    rows={2}
                                    style={{ width: '100%' }}
                                />
                                <label htmlFor="firstName">First Name</label>
                            </span>
                        </div>

                        {/* Last Name */}
                        <div className="field col">
                            <span className="p-float-label">
                                <InputTextarea
                                    id="lastName"
                                    name="lastName"
                                    value={lastName}
                                    onChange={onChange}
                                    rows={2}
                                    style={{ width: '100%' }}
                                />
                                <label htmlFor="lastName">Last Name</label>
                            </span>
                        </div>
                    </div>

                    {/* PHONE & EMAIL */}
                    <div className="formgrid grid mb-3">
                        {/* Phone */}
                        <div className="field col">
                            <span className="p-float-label">
                                <InputTextarea
                                    id="phone"
                                    name="phone"
                                    value={phone}
                                    onChange={onChange}
                                    rows={2}
                                    style={{ width: '100%' }}
                                />
                                <label htmlFor="phone">Phone</label>
                            </span>
                        </div>

                        {/* Email */}
                        <div className="field col">
                            <span className="p-float-label">
                                <InputTextarea
                                    id="email"
                                    name="email"
                                    value={email}
                                    style={{ width: '100%' }}
                                    rows={2}
                                    onChange={onChange}
                                />
                                <label htmlFor="email">E-mail</label>
                            </span>
                        </div>
                    </div>

                    {/* MATERIAL & QUANTITY */}
                    <div className="formgrid grid mb-3">
                        {/* Material */}
                        <div className="field col">
                            <span className="p-float-label">
                                <InputTextarea
                                    id="material"
                                    name="material"
                                    style={{ width: '100%' }}
                                    value={material}
                                    rows={2}
                                    onChange={onChange}
                                />
                                <label htmlFor="material">Material</label>
                            </span>
                        </div>

                        {/* Quantity */}
                        <div className="field col">
                            <span className="p-float-label">
                                <InputTextarea
                                    id="quantity"
                                    name="quantity"
                                    style={{ width: '100%' }}
                                    value={quantity}
                                    rows={2}
                                    onChange={onChange}
                                />
                                <label htmlFor="quantity">Quantity</label>
                            </span>
                        </div>
                    </div>

                    {/* STATUS & REMINDER */}
                    <div className="formgrid grid mb-3">
                        {/* Status */}
                        <div className="field col">
                            <span className="p-float-label">
                                <Dropdown
                                    id="status"
                                    name="status"
                                    value={status}
                                    onChange={onChange}
                                    options={statuses}
                                    style={{ width: '100%' }}
                                    optionLabel="name"
                                    optionValue="value"
                                    placeholder="Choose Status"
                                />
                                <label htmlFor="status">Status</label>
                            </span>
                        </div>

                        {/* Reminder */}
                        <div className="field col">
                            <div className="flex align-items-center gap-3">
                                <Checkbox
                                    id="reminder"
                                    name="reminder"
                                    onChange={onChangeCheckbox}
                                    checked={reminder}
                                ></Checkbox>
                                <label htmlFor="reminder">Reminder</label>
                            </div>
                        </div>
                    </div>

                    {/* NOTES */}
                    <div className="formgrid grid mb-3">
                        <div className="field col">
                            <span className="p-float-label">
                                {/* Notes */}
                                <InputTextarea
                                    id="notes"
                                    name="notes"
                                    value={notes}
                                    onChange={onChange}
                                    rows={5}
                                    cols={30}
                                    style={{ width: '100%' }}
                                />
                                <label htmlFor="notes">Notes</label>
                            </span>
                        </div>
                    </div>
                </form>
            </Dialog>
        </div>
    )
}
