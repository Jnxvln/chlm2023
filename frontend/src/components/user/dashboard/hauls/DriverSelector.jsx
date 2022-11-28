import { useState } from 'react'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
// Store data
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchUser } from '../../../../api/users/usersApi'
import { getAllWorkdaysByDateRange } from '../../../../api/workdays/workdaysApi'
import { toast } from 'react-toastify'

function DriverSelector({ drivers, onSelectDriver, dateRange }) {
    const [selectedDriverId, setSelectedDriverId] = useState(
        localStorage.getItem('selectedDriverId') || undefined
    )

    const user = useQuery(['user'], fetchUser)

    const workdays = useQuery({
        queryKey: ['workdays'],
        queryFn: () =>
            getAllWorkdaysByDateRange(
                dateRange[0],
                dateRange[1],
                user.data.token
            ),
        onSuccess: (workdays) => {
            console.log('[DriverSelector.jsx] Workdays for date range: ')
            console.log(workdays)
        },
        onError: (err) => {
            const errMsg = 'Error fetching workdays'
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

    const driverNameTemplate = (driver) => {
        return (
            <div className="flex justify-content-between">
                {driver.firstName} {driver.lastName}{' '}
                <i
                    className="pi pi-calendar"
                    style={{ paddingRight: '0.5em' }}
                />
            </div>
        )
    }

    const onChange = (e) => {
        if (!e || !e.value) {
            console.log(
                '[DriverSelector onChange(e)]: No event found OR no value property exists on event'
            )
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
                optionLabel={driverNameTemplate}
                optionValue="_id"
                value={selectedDriverId}
                options={
                    drivers ? drivers.filter((d) => d.isActive === true) : []
                }
                onChange={onChange}
                placeholder="Choose driver..."
            />
        </>
    )
}

export default DriverSelector
