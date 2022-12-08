import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
// PrimeReact Components
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
// Store data
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchUser } from '../../../api/users/usersApi'
import { getWorkdaysByDriverIdAndDateRange } from '../../../api/workdays/workdaysApi'
import { getDriverById } from '../../../api/drivers/driversApi'
import { getHaulsByDriverIdAndDateRange } from '../../../api/hauls/haulsApi'
import { toast } from 'react-toastify'

function HaulSummary() {
    // #region VARS -----------------------------------------------------------
    const navigate = useNavigate()

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
    })

    const userId = user?.data?._id

    const driver = useQuery({
        queryKey: ['driver', userId],
        queryFn: () => getDriverById(_driverId, user.data.token),
        enabled: !!userId,
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

    // #region ACTION HANDLERS ------------------------------------------------
    const roundPrecise = (num) => {
        // return +(Math.round(num + 'e+2') + 'e-2')
        return Math.round(num * 100 + Number.EPSILON) / 100
    }

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

    const calculateCHHours = () => {
        if (data && data.workdays) {
            let _chHours = 0

            for (let i = 0; i < data.workdays.length; i++) {
                _chHours += parseFloat(data.workdays[i].chhours)
            }
            return _chHours.toFixed(2)
        } else return -1
    }

    const calculateNCHours = () => {
        if (data && data.workdays) {
            let _ncHours = 0
            for (let i = 0; i < data.workdays.length; i++) {
                if (data.workdays[i].nchours) {
                    _ncHours += parseFloat(data.workdays[i].nchours)
                }
            }
            return _ncHours.toFixed(2)
        } else return -1
    }

    const calculateTotalFreightPay = () => {
        if (data && data.hauls) {
            let _totalFreightPay = 0

            for (let i = 0; i < data.hauls.length; i++) {
                if (data.hauls[i].loadType === 'enddump') {
                    _totalFreightPay +=
                        parseFloat(data.hauls[i].tons) *
                        parseFloat(data.hauls[i].rate)
                }

                if (data.hauls[i].loadType === 'flatbedperc') {
                    _totalFreightPay += parseFloat(data.hauls[i].payRate)
                }
            }

            return roundPrecise(_totalFreightPay).toFixed(2)
        } else return -1
    }

    const calculateDriverSubtotal = () => {
        if (data && data.driver && data.hauls) {
            let _totalDriverPay = 0
            const _driverEndDumpPayRate = parseFloat(data.driver.endDumpPayRate)
            const _driverFlatBedPayRate = parseFloat(data.driver.flatBedPayRate)

            for (let i = 0; i < data.hauls.length; i++) {
                if (data.hauls[i].loadType === 'enddump') {
                    let _add = roundPrecise(
                        parseFloat(data.hauls[i].tons) *
                            parseFloat(data.hauls[i].rate) *
                            _driverEndDumpPayRate
                    )
                    _totalDriverPay += _add
                }
                if (data.hauls[i].loadType === 'flatbedperc') {
                    let _add = roundPrecise(
                        parseFloat(data.hauls[i].payRate) *
                            _driverFlatBedPayRate
                    )
                    _totalDriverPay += _add
                }
            }

            return roundPrecise(_totalDriverPay).toFixed(2)
        } else return -1
    }

    const calculateNCTotal = () => {
        if (data && data.workdays && data.driver) {
            let _nctotal = 0
            let _driverNCRate = parseFloat(data.driver.ncRate)

            for (let i = 0; i < data.workdays.length; i++) {
                if (data.workdays[i].nchours) {
                    _nctotal += roundPrecise(
                        parseFloat(data.workdays[i].nchours) * _driverNCRate
                    )
                }
            }

            return roundPrecise(_nctotal).toFixed(2)
        } else return -1
    }
    // #endregion

    // #region TEMPLATES ------------------------------------------------------
    const dateHaulTemplate = (rowData) => {
        if (rowData) {
            return <>{dayjs(rowData.dateHaul).format('MM/DD/YY')}</>
        } else {
            return <>Loading...</>
        }
    }

    const tonsTemplate = (rowData) => {
        if (rowData) {
            return <>{parseFloat(rowData.tons).toFixed(2)}</>
        } else {
            return <>Loading...</>
        }
    }

    const rateTemplate = (rowData) => {
        if (rowData) {
            if (rowData.loadType === 'enddump') {
                return <>{parseFloat(rowData.rate).toFixed(2)}</>
            } else {
                return <>-</>
            }
        } else {
            return <>Loading...</>
        }
    }

    const chHoursTemplate = (rowData) => {
        if (rowData && data && data.workdays) {
            const _dateHaul = rowData.dateHaul.split('T')[0]

            if (!chDatesPrinted.includes(_dateHaul)) {
                const wday = data.workdays.find((w) => {
                    const _date = w.date.split('T')[0]
                    if (_dateHaul === _date) {
                        chDatesPrinted.push(w.date.split('T')[0])
                    }
                    return w.date.split('T')[0] === _dateHaul
                })

                const _chhours =
                    wday && wday.chhours
                        ? parseFloat(wday.chhours).toFixed(2)
                        : -1
                return _chhours
            }
        } else {
            return <>Loading....</>
        }
    }

    const ncHoursTemplate = (rowData) => {
        if (rowData && data && data.workdays) {
            if (!ncDatesPrinted.includes(rowData.dateHaul.split('T')[0])) {
                const wday = data.workdays.find((w) => {
                    ncDatesPrinted.push(w.date.split('T')[0])
                    return (
                        w.date.split('T')[0] === rowData.dateHaul.split('T')[0]
                    )
                })

                const _nchours = parseFloat(wday?.nchours)
                return _nchours ? _nchours.toFixed(2) : parseFloat(0).toFixed(2)
            }
        } else {
            return <>Loading...</>
        }
    }

    const freightPayTemplate = (rowData) => {
        if (rowData && driver && driver.data) {
            let _freightPay
            let tons = parseFloat(rowData.tons)
            let rate = parseFloat(rowData.rate)
            let payRate = parseFloat(rowData.payRate)

            if (rowData.loadType === 'enddump') {
                _freightPay = roundPrecise(tons * rate)
            }

            if (rowData.loadType === 'flatbedperc') {
                _freightPay = roundPrecise(payRate)
            }

            return roundPrecise(parseFloat(_freightPay)).toFixed(2)
        } else {
            return <>Loading...</>
        }
    }

    const driverPayTemplate = (rowData) => {
        if (rowData && driver && driver.data) {
            let driverEndDumpRate = parseFloat(driver.data.endDumpPayRate)
            let driverFlatBedRate = parseFloat(driver.data.flatBedPayRate)
            let _tons = parseFloat(rowData.tons)
            let _rate = parseFloat(rowData.rate)
            let _payRate = parseFloat(rowData.payRate)
            let _driverPay

            if (rowData.loadType === 'enddump') {
                _driverPay = roundPrecise(_tons * _rate * driverEndDumpRate)
            }

            if (rowData.loadType === 'flatbedperc') {
                _driverPay = roundPrecise(_payRate * driverFlatBedRate)
            }

            return roundPrecise(_driverPay).toFixed(2)
        } else {
            return <>Loading...</>
        }
    }
    // #endregion

    // #region useEffect ------------------------------------------------------
    useEffect(() => {
        generateDates()
    }, [])

    useEffect(() => {
        if (workdays.data && hauls.data) {
            setData((prevState) => ({
                ...prevState,
                driver: driver.data,
                hauls: hauls.data,
                workdays: workdays.data,
            }))
        }
    }, [workdays.data, hauls.data])
    // #endregion

    return (
        <section style={{ padding: '1em' }}>
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

            <Button
                icon="pi pi-arrow-left"
                iconPos="left"
                label="Back"
                className="noPrint"
                style={{ backgroundColor: '#595959', marginRight: '0.5em' }}
                onClick={() => navigate('/dashboard')}
            />

            <Button
                icon="pi pi-print"
                iconPos="left"
                label="Print"
                className="noPrint"
                onClick={() => {
                    window.print()
                }}
            />

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
                    value={data && data.hauls}
                    loading={hauls && hauls.isLoading}
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
                {/* TOTAL HOURS */}
                <div>
                    <div>
                        <table>
                            <tbody className="ncSummaryTableBody">
                                <tr>
                                    <td>
                                        <strong>C&H Hours:</strong>{' '}
                                    </td>
                                    <td className="tdSpacer">
                                        {calculateCHHours()}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>NC Hours:</strong>{' '}
                                    </td>
                                    <td className="tdSpacer">
                                        {calculateNCHours()}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>NC Rate:</strong>{' '}
                                    </td>
                                    <td className="tdSpacer">
                                        $
                                        {data &&
                                        data.driver &&
                                        data.driver.ncRate ? (
                                            parseFloat(
                                                data.driver.ncRate
                                            ).toFixed(2)
                                        ) : (
                                            <>...</>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* NC REASONS */}
                <div>
                    <div>
                        <strong>NC Reasons: </strong>
                    </div>
                    {data &&
                        data.workdays &&
                        data.workdays.map((day) => (
                            <div key={day._id}>
                                {day && day.ncReasons ? (
                                    <>
                                        {dayjs(day.date).format('MM/DD')}:{' '}
                                        {day.ncReasons} ({day.nchours} hrs)
                                    </>
                                ) : (
                                    <></>
                                )}
                            </div>
                        ))}
                </div>

                {/* PAY TOTALS */}
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>
                                    Total Freight Pay:
                                </td>
                                <td className="tdSpacer">
                                    $ {calculateTotalFreightPay()}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>
                                    Driver Subtotal:
                                </td>
                                <td className="tdSpacer">
                                    $ {calculateDriverSubtotal()}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>
                                    NC Total:
                                </td>
                                <td className="tdSpacer">
                                    $ {calculateNCTotal()}
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style={{
                                        fontWeight: 'bold',
                                        paddingTop: '1em',
                                    }}
                                >
                                    Driver Total:{' '}
                                </td>
                                <td className="tdSpacer">
                                    ${'     '}
                                    {(
                                        parseFloat(calculateDriverSubtotal()) +
                                        parseFloat(calculateNCTotal())
                                    ).toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </section>
    )
}

export default HaulSummary
