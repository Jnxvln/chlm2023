import { useState, useEffect } from 'react'
import DialogHeader from '../../../dialogComponents/DialogHeader'
import DialogFooter from '../../../dialogComponents/DialogFooter_SubmitClose'
// PrimeReact Components
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputSwitch } from 'primereact/inputswitch'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'
import { ConfirmPopup } from 'primereact/confirmpopup' // To use <ConfirmPopup> tag
import { confirmPopup } from 'primereact/confirmpopup' // To use confirmPopup method
// Store data
import { fetchUser } from '../../../../api/users/usersApi'
import {
    updateWorkday,
    deleteWorkday,
} from '../../../../api/workdays/workdaysApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

function EditWorkdayForm({ workday, driver, onUpdateWorkdays }) {
    const queryClient = useQueryClient()

    // #region VARS ---------------------------------

    const initialState = {
        chhours: '',
        nchours: '',
        ncReasons: '',
        notes: '',
    }

    const [formDialog, setFormDialog] = useState(false)
    const [formData, setFormData] = useState(initialState)
    const { _id, date, chhours, nchours, ncReasons, notes, ncRateOverride } =
        formData

    const user = useQuery(['user'], fetchUser)

    const mutationUpdateWorkday = useMutation({
        mutationKey: ['workdays'],
        onMutate: ({ formData }) => {
            formData.date = new Date(workday.date)
            formData.driverId = driver._id
        },
        mutationFn: ({ formData, token }) => updateWorkday(formData, token),
        onSuccess: (updWorkday) => {
            if (updWorkday) {
                toast.success('Workday updated', { autoClose: 1000 })
                queryClient.invalidateQueries(['workdays'])
                onUpdateWorkdays()
                setFormDialog(false)
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
                toast.error(err.response.data.message, { autoClose: 8000 })
            } else {
                toast.error(errMsg, { autoClose: 8000 })
            }
        },
    })

    const mutationDeleteWorkday = useMutation({
        mutationKey: ['workdays'],
        mutationFn: ({ id, token }) => deleteWorkday(id, token),
        onSuccess: (delId) => {
            if (delId) {
                toast.success('Workday deleted', { autoClose: 1000 })
                queryClient.invalidateQueries(['workdays'])
            }
        },
        onError: (err) => {
            const errMsg = 'Error deleting workday'
            console.log(errMsg)
            console.log(err)

            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                return toast.error(err.response.data.message, {
                    autoClose: 8000,
                })
            } else {
                return toast.error(errMsg, { autoClose: 8000 })
            }
        },
    })
    // #endregion

    // #region COMPONENT RENDERERS
    const workdayDialogHeader = () => {
        return (
            <DialogHeader
                resourceType="Workday"
                resourceName={
                    workday
                        ? driver.firstName +
                          ' ' +
                          dayjs(workday.date).format('MM/DD/YYYY')
                        : ''
                }
                isEdit
            />
        )
    }

    const workdayDialogFooter = () => {
        return <DialogFooter onClose={onClose} onSubmit={onSubmit} />
    }
    // #endregion

    // #region FORM HANDLERS ----------------------------------
    // Handle form reset
    const resetForm = () => {
        setFormData(initialState)
    }

    // Handle form closing
    const onClose = () => {
        resetForm()
        setFormDialog(false)
    }

    // Handle form text input
    const onChange = (e) => {
        if (e.hasOwnProperty('target')) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
    }

    // Handle form number input
    const onChangeNumber = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.originalEvent.target.name]: e.value,
        }))
    }

    const handleConfirmDelete = (e) => {
        confirmPopup({
            target: e.target,
            message: `Delete this workday?`,
            icon: 'pi pi-exclamation-triangle',
            accept: () =>
                mutationDeleteWorkday.mutate({
                    id: formData._id,
                    token: user.data.token,
                }),
            reject: () => null,
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()

        const hasNCHours = nchours && parseFloat(nchours) > 0
        const hasNCReasons = ncReasons && ncReasons.length > 0
        const hasNCOverride = ncRateOverride && parseFloat(ncRateOverride) > 0

        if (!hasNCHours && hasNCReasons) {
            return toast.error('NC Reasons is provided but NC Hours is blank')
        }

        if (hasNCHours && !hasNCReasons) {
            return toast.error('NC Hours is provided but NC Reasons is blank')
        }

        if (hasNCOverride && (!hasNCHours || !hasNCReasons)) {
            return toast.error(
                'NC Override requires values for both NC Hours and NC Reasons'
            )
        }

        mutationUpdateWorkday.mutate({ formData, token: user.data.token })
    }
    // #endregion

    useEffect(() => {
        if (workday) {
            setFormData((prevState) => ({
                ...prevState,
                _id: workday._id,
                chhours: workday.chhours,
                nchours: workday.nchours,
                ncReasons: workday.ncReasons,
                notes: workday.notes,
            }))
        }
    }, [formDialog])

    return (
        <section>
            <ConfirmPopup />
            <Button
                icon="pi pi-calendar"
                className="p-button-rounded p-button-success p-button-sm"
                onClick={() => setFormDialog(true)}
            />

            <Dialog
                id="editWorkday"
                visible={formDialog}
                header={workdayDialogHeader}
                footer={workdayDialogFooter}
                onHide={onClose}
                style={{ minWidth: '30vw' }}
                blockScroll
            >
                <form onSubmit={onSubmit}>
                    {/* ID */}
                    <div className="field col">
                        <div style={{ margin: '0.8em 0' }}>
                            <span className="p-float-label">
                                <InputText
                                    id="_id"
                                    name="_id"
                                    value={_id}
                                    readOnly
                                    style={{ width: '100%' }}
                                />
                                <label htmlFor="_id">ID</label>
                            </span>
                        </div>
                    </div>

                    {/* CHHOURS, NCHOURS */}
                    <div className="formgrid grid">
                        {/* chhours */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputNumber
                                        id="chhours"
                                        name="chhours"
                                        value={chhours}
                                        placeholder="CH Hours"
                                        mode="decimal"
                                        minFractionDigits={2}
                                        onChange={onChangeNumber}
                                        style={{ width: '100%' }}
                                        autoFocus
                                    />
                                    <label htmlFor="chhours">CH Hours</label>
                                </span>
                            </div>
                        </div>

                        {/* nchours */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputNumber
                                        id="nchours"
                                        name="nchours"
                                        value={nchours}
                                        placeholder="CH Hours"
                                        mode="decimal"
                                        minFractionDigits={2}
                                        onChange={onChangeNumber}
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="nchours">NC Hours</label>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* NCREASONS, NOTES */}
                    <div className="formgrid grid">
                        {/* NCReasons */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputTextarea
                                        id="ncreasons"
                                        name="ncReasons"
                                        value={ncReasons}
                                        onChange={onChange}
                                        rows={4}
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="ncreasons">
                                        NC Reasons
                                    </label>
                                </span>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <InputTextarea
                                        id="notes"
                                        name="notes"
                                        value={notes}
                                        placeholder="Notes entered here are private and will not be printed"
                                        onChange={onChange}
                                        rows={4}
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="notes">Notes</label>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* NC RATE OVERRIDE */}
                    <div className="formgrid grid">
                        <div className="field col">
                            <div style={{ margin: '0.8em 0 0 0' }}>
                                <span className="p-float-label">
                                    <InputNumber
                                        id="ncRateOverride"
                                        name="ncRateOverride"
                                        value={ncRateOverride}
                                        placeholder="NC Rate Override"
                                        mode="decimal"
                                        minFractionDigits={2}
                                        onChange={onChangeNumber}
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="ncRateOverride">
                                        NC Rate Override
                                    </label>
                                </span>
                            </div>
                            <small style={{ fontStyle: 'italic' }}>
                                (If blank, defaults to NC Rate in{' '}
                                {driver.firstName}'s profile, $
                                {parseFloat(driver.ncRate).toFixed(2)})
                            </small>
                        </div>
                    </div>

                    <div className="flex justify-content-end">
                        <Button
                            type="button"
                            icon="pi pi-trash"
                            className="p-button-danger p-button-text"
                            tabIndex={-1}
                            onClick={(e) => handleConfirmDelete(e)}
                        ></Button>
                    </div>
                </form>
            </Dialog>
        </section>
    )
}

export default EditWorkdayForm
