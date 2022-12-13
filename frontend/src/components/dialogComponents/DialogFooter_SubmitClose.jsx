import { useState, useEffect } from 'react'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'

const DialogFooter_SubmitClose = ({
    onSubmit,
    onClose,
    isHaulDialog,
    loadType,
    onDrivingTime,
    onOffDuty,
}) => {
    // #region VARS ======================================================================
    const [offDutyOptions, setOffDutyOptions] = useState([
        {
            name: 'None',
            value: null,
        },
        {
            name: 'Maintenance',
            value: 'maintenance',
        },
        {
            name: 'Sick',
            value: 'sick',
        },
        {
            name: 'Holiday',
            value: 'holiday',
        },
        {
            name: 'Vacation',
            value: 'vacation',
        },
        {
            name: 'Weather',
            value: 'weather',
        },
        {
            name: 'Personal',
            value: 'personal',
        },
        {
            name: 'Bereavement',
            value: 'bereavement',
        },
        {
            name: 'Custom',
            value: 'custom',
        },
    ])

    const [offDutySelected, setOffDutySelected] = useState(null)
    // #endregion

    const handleOffDutySelected = (value) => {
        // console.log('inside handleOffDutySelected, value: ' + value)
        setOffDutySelected(value)
        onOffDuty(value)
    }

    useEffect(() => {
        // if (loadType) {
        //     console.log('LOAD TYPE: ' + loadType)
        // }

        onOffDuty(offDutySelected)
    }, [loadType, offDutySelected])

    return (
        <footer className="dialog-footer flex justify-content-between">
            <div className="flex justify-content-evenly gap-3">
                <div>
                    <span className="p-float-label">
                        <Dropdown
                            id="dialogOffDuty"
                            type="button"
                            label="Off Duty"
                            icon="pi pi-times"
                            className="p-button-text"
                            value={offDutySelected}
                            options={offDutyOptions}
                            optionLabel="name"
                            optionValue="value"
                            placeholder="Off Duty"
                            onChange={(e) => handleOffDutySelected(e.value)}
                            tabIndex={-1}
                            // onClick={onOffDuty}
                        />
                        <label htmlFor="dialogOffDuty">Off Duty</label>
                    </span>
                </div>

                {isHaulDialog &&
                    loadType &&
                    (loadType === 'flatbedperc' ||
                        loadType === 'flatbedmi') && (
                        <div>
                            <Button
                                type="button"
                                label="Show Driving"
                                icon="pi pi-truck"
                                className="p-button-text"
                                tabIndex={-1}
                                onClick={onDrivingTime}
                            />
                        </div>
                    )}
            </div>
            <div>
                <Button
                    type="button"
                    label="Cancel"
                    icon="pi pi-times"
                    onClick={onClose}
                    className="p-button-text"
                    tabIndex={-1}
                />
                <Button
                    type="submit"
                    label="Save"
                    iconPos="left"
                    icon="pi pi-save"
                    onClick={onSubmit}
                />
            </div>
        </footer>
    )
}

export default DialogFooter_SubmitClose
