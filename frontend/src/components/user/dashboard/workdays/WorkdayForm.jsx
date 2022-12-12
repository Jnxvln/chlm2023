import { useState, useEffect } from 'react'
import DialogHeader from '../../../dialogComponents/DialogHeader'
import DialogFooter from '../../../dialogComponents/DialogFooter_SubmitClose'
// PrimeReact Components
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'
// Store data
import { fetchUser } from '../../../../api/users/usersApi'
import { createWorkday } from '../../../../api/workdays/workdaysApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

function WorkdayForm({ workDate, driver }) {
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

    const mutationCreateWorkday = useMutation({
        mutationKey: ['workdays'],
        onMutate: ({ formData }) => {
            formData.date = new Date(workDate)
            formData.driverId = driver._id

            console.log('Inside onMutate with workDate: ')
            console.log(workDate)
        },
        mutationFn: ({ formData, token }) => createWorkday(formData, token),
        onSuccess: (workday) => {
            if (workday) {
                toast.success('Workday created', { autoClose: 1000 })
                queryClient.invalidateQueries(['workdays'])
            }
        },
        onError: (err) => {
            const errMsg = 'Error creating workday'
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
        return <DialogHeader resourceType="Workday" isEdit={false} />
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

        const hasCHHours = chhours && chhours.length > 0
        const hasNCHours = nchours && parseFloat(nchours) > 0
        const hasNCReasons = ncReasons && ncReasons.length > 0
        const hasNCOverride = ncRateOverride && parseFloat(ncRateOverride) > 0

        console.log(
            'hasCHHours: ' + hasCHHours + ' (' + typeof hasCHHours + ')'
        )

        if (!hasCHHours && hasCHHours != '0') {
            return toast.error('CH Hours is required (enter 0 if not needed)')
        }

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

        mutationCreateWorkday.mutate({ formData, token: user.data.token })
    }
    // #endregion

    useEffect(() => {
        if (formDialog && workDate) {
            console.log('workDate received: ' + workDate)
        }
    }, [formDialog])

    return (
        <section>
            <Button
                icon="pi pi-calendar"
                className="p-button-rounded p-button-gray p-button-sm"
                onClick={() => setFormDialog(true)}
            />

            <Dialog
                id="newWorkday"
                visible={formDialog}
                header={workdayDialogHeader}
                footer={workdayDialogFooter}
                onHide={onClose}
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
                                {driver ? (
                                    <>
                                        {driver.firstName}'s profile, $
                                        {parseFloat(driver.ncRate).toFixed(2)})
                                    </>
                                ) : (
                                    <>driver's profile</>
                                )}
                            </small>
                        </div>
                    </div>
                </form>
            </Dialog>
        </section>
    )
}

export default WorkdayForm
