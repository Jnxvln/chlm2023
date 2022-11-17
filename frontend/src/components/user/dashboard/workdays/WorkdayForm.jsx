import { useState } from 'react'
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

function WorkdayForm() {
    const queryClient = useQueryClient()

    // #region VARS ---------------------------------

    const initialState = {}

    const [formDialog, setFormDialog] = useState(false)
    const [formData, setFormData] = useState(initialState)
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
        alert('TODO: Submit')
    }
    // #endregion

    return (
        <section>
            <Button
                icon="pi pi-calendar"
                className="p-button-rounded p-button-gray"
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
                <form onSubmit={onSubmit}></form>
            </Dialog>
        </section>
    )
}

export default WorkdayForm
