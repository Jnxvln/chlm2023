import { useState } from 'react'
import days from 'dayjs'
import DialogHeader from '../../../dialogComponents/DialogHeader'
import DialogFooter from '../../../dialogComponents/DialogFooter_SubmitClose'
// PrimeReact Components
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputSwitch } from 'primereact/inputswitch'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'
// Store data
import { createDriver } from '../../../../api/drivers/driversApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'

function EditWorkdayForm({ workday }) {
    const queryClient = useQueryClient()

    // #region VARS ---------------------------------

    const initialState = {}

    const [formDialog, setFormDialog] = useState(false)
    const [formData, setFormData] = useState(initialState)
    const { date, chhours } = formData
    // #endregion

    // #region COMPONENT RENDERERS
    const workdayDialogHeader = () => {
        return (
            <DialogHeader
                resourceType="Workday"
                resourceName={
                    workday ? dayjs(workday.date).format('MM/DD/YYYY') : ''
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
        alert('TODO: Submit')
    }
    // #endregion

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
                blockScroll
            >
                <form onSubmit={onSubmit}>
                    {/* DATE */}
                    <div className="formgrid grid">
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
                    </div>

                    {/* CHHOURS */}
                    <div className="formgrid grid">
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
                                        required
                                    />
                                    <label htmlFor="chhours">CH Hours</label>
                                </span>
                            </div>
                        </div>
                    </div>
                </form>
            </Dialog>
        </section>
    )
}

export default EditWorkdayForm
