import { useState, useEffect } from 'react'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { confirmPopup } from 'primereact/confirmpopup' // To use confirmPopup method

const DialogFooter_SubmitClose = ({
    onSubmit,
    onClose,
    isHaulDialog,
    isDelete,
    loadType,
    onDrivingTime,
    onOffDuty,
    onDelete,
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
        setOffDutySelected(value)
        onOffDuty(value)
    }

    useEffect(() => {
        if (onOffDuty && offDutySelected) {
            onOffDuty(offDutySelected)
        }
    }, [loadType, offDutySelected])

    return (
        <footer className="dialog-footer flex justify-content-between">
            <div className="flex justify-content-evenly gap-3">
                {onOffDuty && (
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
                            />
                            <label htmlFor="dialogOffDuty">Off Duty</label>
                        </span>
                    </div>
                )}

                {isHaulDialog &&
                    loadType &&
                    (loadType === 'flatbedperc' ||
                        loadType === 'flatbedmi') && (
                        <div>
                            <Button
                                id="showDrivingBtn"
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
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                {/* Delete Button */}
                <div>
                    {isDelete && (
                        <Button
                            type="button"
                            label="Delete"
                            icon="pi pi-trash"
                            className="p-button-danger"
                            tabIndex={-1}
                            onClick={onDelete}
                        />
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
            </div>
        </footer>
    )
}

export default DialogFooter_SubmitClose
