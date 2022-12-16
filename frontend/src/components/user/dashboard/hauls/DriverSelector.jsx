import { useState } from 'react'
// PrimeReact Components
import { Dropdown } from 'primereact/dropdown'
import { Badge } from 'primereact/badge'

function DriverSelector({ drivers, onSelectDriver }) {
    const [selectedDriverId, setSelectedDriverId] = useState(
        localStorage.getItem('selectedDriverId') || undefined
    )

    // #region TEMPLATES --------------------------------------------------
    const driverOptionLabel = (option, props) => {
        if (option) {
            const _driver = { ...option }

            return (
                <div className="flex justify-content-between">
                    <>
                        {_driver.firstName} {_driver.lastName}
                    </>
                    <Badge
                        value={_driver.defaultTruck}
                        style={{ marginLeft: '0.5em' }}
                    />
                </div>
            )
        } else {
            return <>{props.placeholder}</>
        }
    }

    const driverItemTemplate = (option, props) => {
        if (option) {
            const _driver = { ...option }

            return (
                <div className="flex justify-content-between">
                    {_driver.firstName} {_driver.lastName}
                    <Badge
                        value={_driver.defaultTruck}
                        style={{ marginLeft: '0.5em' }}
                    />
                </div>
            )
        } else {
            return <>{props.placeholder}</>
        }
    }
    // #endregion

    const onChange = (e) => {
        if (!e || !e.value) {
            return
        }

        const _driverId = e.value

        localStorage.setItem('selectedDriverId', _driverId)
        setSelectedDriverId(_driverId)
        onSelectDriver(_driverId)
    }

    return (
        <>
            <Dropdown
                className="driver-selector-dropdown"
                optionLabel={driverOptionLabel}
                itemTemplate={driverItemTemplate}
                optionValue="_id"
                options={
                    drivers
                        ? drivers
                              .filter((d) => d.isActive === true)
                              .sort(
                                  (a, b) =>
                                      parseInt(a.defaultTruck) -
                                      parseInt(b.defaultTruck)
                              )
                        : []
                }
                value={selectedDriverId}
                onChange={onChange}
                placeholder="Choose driver..."
            />
        </>
    )
}

export default DriverSelector
