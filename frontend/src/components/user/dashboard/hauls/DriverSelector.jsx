import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { Dropdown } from 'primereact/dropdown'
// Store data
import { useQuery } from '@tanstack/react-query'
import { fetchUser } from '../../../../api/users/usersApi'
import { getAllWorkdaysByDateRange } from '../../../../api/workdays/workdaysApi'
import { toast } from 'react-toastify'

function DriverSelector({ drivers, onSelectDriver, rangeDates }) {
    const [selectedDriverId, setSelectedDriverId] = useState(
        localStorage.getItem('selectedDriverId') || undefined
    )
    const [dateStart, setDateStart] = useState(
        JSON.parse(localStorage.getItem('selectedHaulsDateRange'))[0] || null
    )
    const [dateEnd, setDateEnd] = useState(
        JSON.parse(localStorage.getItem('selectedHaulsDateRange'))[1] || null
    )
    const [workdates, setWorkdates] = useState([])
    const user = useQuery(['user'], fetchUser)

    const workdays = useQuery({
        queryKey: ['workdays'],
        queryFn: () =>
            getAllWorkdaysByDateRange(
                rangeDates[0],
                rangeDates[1],
                user.data.token
            ),
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

    const getDateDifference = (dateStart, dateEnd) => {
        const _dateStart = dayjs(dateStart)
        const _dateEnd = dayjs(dateEnd)

        const diff = _dateStart.diff(_dateEnd, 'day')

        const dates = []

        for (let i = 0; i <= Math.abs(diff); i++) {
            dates.push(
                dayjs(dayjs(_dateStart).add(i, 'day')).format('YYYY-MM-DD')
            )
        }

        // console.log('[DriverSelector getDateDifference()] dates: ')
        // console.log(dates)

        setWorkdates(dates)
    }

    const WorkdaysInRange = (driver) => {
        let _workdaysInRange = []
        const _driver = { ...driver.driver }

        if (workdays && workdays.data && workdays.data.length > 0) {
            for (let i = 0; i < workdates.length; i++) {
                let _wday = workdays.data.find(
                    (d) =>
                        d.date.split('T')[0] === workdates[i] &&
                        d.driverId === _driver._id
                )
                _workdaysInRange.push(_wday)
            }

            // console.log('_workdaysInRange: ')
            // console.log(_workdaysInRange)

            if (
                _workdaysInRange.some((el) => el === undefined || el === null)
            ) {
                return (
                    <i
                        className="pi pi-calendar"
                        style={{ color: 'gray', fontWeight: 'none' }}
                    />
                )
            } else {
                return (
                    <i
                        className="pi pi-calendar"
                        style={{ color: 'green', fontWeight: 'bold' }}
                    />
                )
            }
        } else {
            // console.log('Workdays: ')
            // console.log(workdays)
            return (
                <>
                    <i
                        className="pi pi-exclamation-circle"
                        style={{ color: 'red' }}
                    />
                </>
            )
        }
    }

    const driverNameTemplate = (option) => {
        const _driver = { ...option }
        return (
            <>
                <div className="flex justify-content-between">
                    {_driver.firstName} {_driver.lastName}{' '}
                    <WorkdaysInRange driver={_driver} />
                </div>
            </>
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

    useEffect(() => {
        // if (dateStart && dateEnd) {
        //     getDateDifference(dateStart, dateEnd)
        // }

        if (rangeDates) {
            getDateDifference(rangeDates[0], rangeDates[1])
        }

        if (rangeDates) {
            console.log('rangeDates: ')
            console.log(rangeDates)
        }
    }, [dateStart, dateEnd, rangeDates])

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
