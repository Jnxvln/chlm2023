import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
// PrimeReact Components
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
// Store data
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchUser } from '../../../api/users/usersApi'
import { getWorkdaysByDriverIdAndDateRange } from '../../../api/workdays/workdaysApi'
import { getDriverById } from '../../../api/drivers/driversApi'
import { getHaulsByDriverIdAndDateRange } from '../../../api/hauls/haulsApi'
import { toast } from 'react-toastify'

function HaulSummary() {
    // #region VARS ----------------------------------------------------
    let [searchParams, setSearchParams] = useSearchParams()
    const [dates, setDates] = useState([])
    const [data, setData] = useState(null)
    const queryClient = useQueryClient()
    const _driverId = searchParams.get('driverId')
    const _dateStart = searchParams.get('dateStart')
    const _dateEnd = searchParams.get('dateEnd')
    const chDatesPrinted = []
    const ncDatesPrinted = []

    const user = useQuery({
        queryKey: ['user'],
        queryFn: () => fetchUser(),
        // onSuccess: (user) => {
        //     console.log('User fetched: ')
        //     console.log(user)
        // },
    })

    const userId = user?.data?._id

    const driver = useQuery({
        queryKey: ['driver', userId],
        queryFn: () => getDriverById(_driverId, user.data.token),
        enabled: !!userId,
        // onSuccess: (driver) => {
        //     console.log('Driver Fetched: ')
        //     console.log(driver)
        // },
        onError: (err) => {
            console.log('AN ERROR OCCURRED: ')
            console.log(err)
        },
    })

    const driverId = driver?.data?._id

    const workdays = useQuery({
        queryKey: ['workdays'],
        queryFn: () =>
            getWorkdaysByDriverIdAndDateRange(
                driverId,
                _dateStart,
                _dateEnd,
                user.data.token
            ),
        enabled: !!driverId,
        onSuccess: (workdays) => {
            console.log('Workdays fetched: ')
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

    const hauls = useQuery({
        queryKey: ['hauls'],
        queryFn: () => {
            const data = {
                driverId,
                _dateStart,
                _dateEnd,
                token: user.data.token,
            }
            // console.log('Running getHaulsByDriverIdAndDateRange with data: ')
            // console.log(data)
            return getHaulsByDriverIdAndDateRange(
                driverId,
                _dateStart,
                _dateEnd,
                user.data.token
            )
        },
        enabled: !!driverId,
        // onSuccess: (_hauls) => {
        //     console.log('Hauls Fetched: ')
        //     console.log(_hauls)
        // },
        onError: (err) => {
            console.log('ERROR FETCHING HAULS: ')
            console.log(err)
        },
    })
    // #endregion

    const generateDates = (d) => {
        if (_dateStart && _dateEnd) {
            const startDate = dayjs(_dateStart)
            const endDate = dayjs(_dateEnd)

            const diff = Math.abs(dayjs(startDate).diff(endDate, 'day'))

            let _dates = []

            for (let i = 0; i < diff + 1; i++) {
                _dates.push(
                    dayjs(startDate).add([i], 'day').format('YYYY-MM-DD')
                )
            }

            setDates(_dates)
        } else {
            setDates([])
        }
    }

    // #region TEMPLATES ------------------------------------------------------
    const dateHaulTemplate = (rowData) => {
        return <>{dayjs(rowData.dateHaul).format('MM/DD/YY')}</>
    }

    const tonsTemplate = (rowData) => {
        return <>{parseFloat(rowData.tons).toFixed(2)}</>
    }

    const rateTemplate = (rowData) => {
        return <>{parseFloat(rowData.rate).toFixed(2)}</>
    }

    const chHoursTemplate = (rowData) => {
        if (!chDatesPrinted.includes(rowData.dateHaul.split('T')[0])) {
            const wday = workdays.data.find((w) => {
                chDatesPrinted.push(w.date.split('T')[0])
                return w.date.split('T')[0] === rowData.dateHaul.split('T')[0]
            })

            const _chhours = parseFloat(wday.chhours)
            return _chhours ? _chhours.toFixed(2) : parseFloat(0).toFixed(2)
        }
    }

    const ncHoursTemplate = (rowData) => {
        if (!ncDatesPrinted.includes(rowData.dateHaul.split('T')[0])) {
            const wday = workdays.data.find((w) => {
                ncDatesPrinted.push(w.date.split('T')[0])
                return w.date.split('T')[0] === rowData.dateHaul.split('T')[0]
            })

            const _nchours = parseFloat(wday.nchours)
            return _nchours ? _nchours.toFixed(2) : parseFloat(0).toFixed(2)
        }
    }

    const freightPayTemplate = (rowData) => {
        let _freightPay
        let driverEndDumpRate = parseFloat(driver.data.endDumpPayRate)
        let driverFlatBedRate = parseFloat(driver.data.flatBedPayRate)
        let tons = parseFloat(rowData.tons)
        let rate = parseFloat(rowData.rate)

        if (rowData.loadType === 'enddump') {
            _freightPay = tons * rate
        }

        return parseFloat(_freightPay).toFixed(2)
    }

    const driverPayTemplate = (rowData) => {
        let driverEndDumpRate = parseFloat(driver.data.endDumpPayRate)
        let driverFlatBedRate = parseFloat(driver.data.flatBedPayRate)
        let _freightPay = freightPayTemplate(rowData)
        let _driverPay

        if (rowData.loadType === 'enddump') {
            _driverPay = _freightPay * driverEndDumpRate
        }

        return parseFloat(_driverPay).toFixed(2)
    }
    // #endregion

    // #region useEffect
    useEffect(() => {
        generateDates()
    }, [])

    useEffect(() => {
        if (workdays.data && hauls.data) {
            setData((prevState) => ({
                ...prevState,
                hauls: hauls.data,
                workdays: workdays.data,
            }))
        }
    }, [workdays.data, hauls.data])

    useEffect(() => {
        if (data) {
            console.log('Data loaded...')
            console.log(data)
        }
    }, [data])

    // useEffect(() => {
    //     if (dates) {
    //         console.log('Dates set: ')
    //         console.log(dates)
    //     }

    //     if (userId) {
    //         console.log(`User ID: ${userId}`)
    //     }

    //     if (driverId) {
    //         console.log(`Driver ID: ${driverId}`)
    //     }
    // }, [dates, userId, driverId])
    // #endregion

    return (
        <section>
            {/* Page Header */}
            <header
                style={{
                    textAlign: 'center',
                    padding: '1em',
                }}
            >
                <h4 style={{ margin: '0', marginBottom: '0.25em' }}>
                    C&H Trucking
                </h4>
                <h1 style={{ margin: '0' }}>Haul Summary</h1>
            </header>

            {/* Subheader */}
            <div
                id="haulSummaryHeader"
                className="flex justify-content-between"
                style={{ padding: '0.5em' }}
            >
                {/* Driver Name (far left) */}
                <div>
                    {driver &&
                        driver.data &&
                        driver.data.firstName &&
                        driver.data.lastName && (
                            <>
                                <span style={{ fontWeight: 'bold' }}>
                                    Driver:{' '}
                                </span>
                                <span>
                                    {driver.data.firstName}{' '}
                                    {driver.data.lastName}
                                </span>
                            </>
                        )}
                </div>

                {/* Period info (far right)*/}
                <div>
                    {_dateStart && _dateEnd && (
                        <>
                            <span style={{ fontWeight: 'bold' }}>Period: </span>
                            <span>
                                {dayjs(_dateStart).format('MM/DD/YYYY')} -{' '}
                                {dayjs(_dateEnd).format('MM/DD/YYYY')}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Data Table */}
            <div id="haulSummaryDataTable">
                <DataTable
                    value={hauls.data}
                    responsiveLayout="scroll"
                    size="small"
                    stripedRows
                >
                    <Column
                        field="dateHaul"
                        header="Date"
                        body={dateHaulTemplate}
                    ></Column>
                    <Column field="broker" header="Cust"></Column>
                    <Column field="invoice" header="Ref #"></Column>
                    <Column field="chInvoice" header="CH Inv"></Column>
                    <Column field="product" header="Material"></Column>
                    <Column field="from" header="From"></Column>
                    <Column field="to" header="To"></Column>
                    <Column
                        field="tons"
                        header="Tons"
                        body={tonsTemplate}
                    ></Column>
                    <Column
                        field="rate"
                        header="Rate"
                        body={rateTemplate}
                    ></Column>
                    <Column header="CH Hrs" body={chHoursTemplate}></Column>
                    <Column header="NC Hrs" body={ncHoursTemplate}></Column>
                    <Column
                        header="Freight Pay"
                        body={freightPayTemplate}
                    ></Column>
                    <Column
                        header="Driver Pay"
                        body={driverPayTemplate}
                    ></Column>
                </DataTable>
            </div>

            {/* NC Summary Section */}
            <section className="flex justify-content-between flex-wrap ncSummarySection">
                <div style={{ border: '2px dashed red' }}>
                    <div style={{ border: '1px dotted black' }}>
                        <table>
                            <tr>
                                <td>C&H Hours: </td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>NC Hours: </td>
                                <td>-1.00</td>
                            </tr>
                            <tr>
                                <td>NC Rate: </td>
                                <td>$20.00</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div style={{ border: '1px dotted blue' }}>
                    <div>
                        <strong>NC Reasons: </strong>
                    </div>
                    <div>11/24: HOlidaaaay</div>
                </div>

                <div style={{ border: '1px dotted orange' }}>Totals Area</div>
            </section>
        </section>
    )
}

export default HaulSummary
