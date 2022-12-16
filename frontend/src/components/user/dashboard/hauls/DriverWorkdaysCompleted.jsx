import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { Dropdown } from 'primereact/dropdown'
// Store data
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchUser } from '../../../../api/users/usersApi'
import {
    getAllWorkdaysByDateRange,
    getAllWorkdays,
} from '../../../../api/workdays/workdaysApi'
import { toast } from 'react-toastify'

function DriverWorkdaysCompleted({ drivers, currentDriver }) {
    const [dateStart, setDateStart] = useState(
        JSON.parse(localStorage.getItem('selectedHaulsDateRange'))[0]
    )
    const [dateEnd, setDateEnd] = useState(
        JSON.parse(localStorage.getItem('selectedHaulsDateRange'))[1]
    )
    const queryClient = useQueryClient()

    const user = useQuery(['user'], fetchUser)

    const workdays = useQuery({
        queryKey: ['workdays'],
        queryFn: () => getAllWorkdays(user.data.token),
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

    // useEffect(() => {
    //     console.log(
    //         JSON.parse(localStorage.getItem('selectedHaulsDateRange'))[1]
    //     )
    // }, [])

    useEffect(() => {
        if (workdays.data) {
            const loadData = {
                drivers: drivers || null,
                currentDriver: currentDriver || null,
                dateStart: dateStart || null,
                dateEnd: dateEnd || null,
                workdays: workdays.data || [],
            }
        }
    }, [drivers, currentDriver, dateStart, dateEnd, workdays.data])

    return (
        <div>
            <i className="pi pi-calendar" style={{ fontSize: '1.25em' }}></i>
        </div>
    )
}

export default DriverWorkdaysCompleted
