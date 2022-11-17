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
// Store data
import { fetchUser } from '../../../../api/users/usersApi'
import { updateWorkday } from '../../../../api/workdays/workdaysApi'
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

    const onSubmit = (e) => {
        e.preventDefault()

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
    }, [])

    return (
        <section>
            <Button
                icon="pi pi-calendar"
                className="p-button-rounded p-button-warning"
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
                    {/* DATE */}
                    {/* <div className="formgrid grid">
                        <div className="field col">
                            <div style={{ margin: '0.8em 0' }}>
                                <span className="p-float-label">
                                    <Calendar
                                        id="date"
                                        name="date"
                                        value={date}
                                        onChange={onChange}
                                        selectOtherMonths
                                        style={{ width: '100%' }}
                                    />
                                    <label htmlFor="date">Date</label>
                                </span>
                            </div>
                        </div>
                    </div> */}

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
                                        name="ncreasons"
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
                </form>
            </Dialog>
        </section>
    )
}

export default EditWorkdayForm
