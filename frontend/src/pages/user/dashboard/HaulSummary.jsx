import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
// Store data
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchUser } from '../../../api/users/usersApi'
import { getDriverById } from '../../../api/drivers/driversApi'
import { getAllHaulsByDateRange } from '../../../api/hauls/haulsApi'

function HaulSummary() {
    let [searchParams, setSearchParams] = useSearchParams()
    const [data, setData] = useState(null)
    const queryClient = useQueryClient()
    const driverId = searchParams.get('driverId')
    const dateStart = searchParams.get('dateStart')
    const dateEnd = searchParams.get('dateEnd')
    const user = useQuery(['user'], fetchUser)
    const { data: driver } = useQuery({
        queryKey: ['driver'],
        queryFn: () => getDriverById(driverId, user.data.token),
        onError: (err) => {
            console.log('AN ERROR OCCURRED: ')
            console.log(err)
        },
    })

    const { data: hauls } = useQuery({
        queryKey: ['hauls'],
        queryFn: () =>
            getAllHaulsByDateRange(dateStart, dateEnd, user.data.token),
        onSuccess: (_hauls) => {
            console.log('Hauls Fetched: ')
            console.log(_hauls)
        },
        onError: (err) => {
            console.log('ERROR FETCHING HAULS: ')
            console.log(err)
        },
    })

    const generateDates = (dateStart, dateEnd) => {
        const startDate = dayjs(dateStart)
        const endDate = dayjs(dateEnd)

        console.log('Start Date: ' + dayjs(startDate).format('MM/DD/YYYY'))
        console.log('End Date: ' + dayjs(endDate).format('MM/DD/YYYY'))

        const diff = Math.abs(dayjs(startDate).diff(endDate, 'day'))

        console.log('Diff: ' + diff + ' days')

        let _dates = []

        for (let i = 0; i < diff + 1; i++) {
            _dates.push(dayjs(startDate).add([i], 'day').format('YYYY-MM-DD'))
        }

        console.log('_dates: ')
        console.log(_dates)

        return _dates
    }

    const generateHauls = () => {
        if (data && data.dates) {
            console.log('Generating hauls...')
            return hauls.filter((haul) =>
                data.dates.includes(haul.dateHaul.split('T')[0])
            )
        }
    }

    useEffect(() => {
        setData((prevState) => ({
            ...prevState,
            driverId,
            driver,
            dateStart,
            dateEnd,
            dates: generateDates(dateStart, dateEnd),
            hauls: generateHauls(),
        }))
    }, [driverId, dateStart, dateEnd, driver, hauls])

    useEffect(() => {
        console.log('Data: ')
        console.log(data)
    }, [data])

    return (
        <section>
            <header>
                <h1>Haul Summary</h1>
                <p>Driver ID: {driverId}</p>
                <p>Date Start: {dateStart}</p>
                <p>Date End: {dateEnd}</p>
            </header>
        </section>
    )
}

export default HaulSummary
