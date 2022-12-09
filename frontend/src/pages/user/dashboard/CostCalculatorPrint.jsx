import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

function CostCalculatorPrint() {
    let [searchParams, setSearchParams] = useSearchParams()

    const breakdownData = JSON.parse(searchParams.get('breakdownData'))

    const [productTotal, setProductTotal] = useState(0)
    const [freightTotal, setFreightTotal] = useState(0)
    const [totalFSC, setTotalFSC] = useState(0)
    const [totalWithFSC, setTotalWithFSC] = useState(0)
    const [totalWithoutFSC, setTotalWithoutFSC] = useState(0)

    // UseEffect - Perform calculations and set data
    useEffect(() => {
        if (breakdownData) {
            console.log('Breakdown Data: ')
            console.log(breakdownData)

            setProductTotal(
                (
                    parseFloat(breakdownData.product) *
                    parseFloat(breakdownData.tons)
                ).toFixed(2)
            )
            setFreightTotal(
                (
                    parseFloat(breakdownData.freightToYard) *
                    parseFloat(breakdownData.tons)
                ).toFixed(2)
            )

            setTotalFSC(
                (
                    parseFloat(breakdownData.chtFuelSurcharge) +
                    parseFloat(breakdownData.vendorFuelSurcharge)
                ).toFixed(2)
            )

            setTotalWithFSC(
                (
                    parseFloat(breakdownData.chtFuelSurcharge) +
                    parseFloat(breakdownData.vendorFuelSurcharge) +
                    parseFloat(breakdownData.product) *
                        parseFloat(breakdownData.tons) +
                    parseFloat(breakdownData.freightToYard) *
                        parseFloat(breakdownData.tons)
                ).toFixed(2)
            )

            setTotalWithoutFSC(
                (
                    parseFloat(breakdownData.product) *
                        parseFloat(breakdownData.tons) +
                    parseFloat(breakdownData.freightToYard) *
                        parseFloat(breakdownData.tons)
                ).toFixed(2)
            )
        }
    }, [breakdownData])

    return (
        <section
            id="costCalculatorPrintPage"
            style={{
                position: 'fixed',
                bottom: '0.5em',
                width: '100%',
                padding: '0 1em 1em 1em',
            }}
        >
            <div className="flex justify-space-between">
                {/* LEFT COLUMN */}
                <div
                    className="flex-grow-1"
                    style={{ border: '1px solid #E1E1E1', padding: '0.75em' }}
                >
                    {/* Cost-Per Breakdowns */}
                    <div style={{ marginBottom: '1em' }}>
                        <div>
                            <span
                                style={{
                                    fontSize: '1.3em',
                                    fontWeight: 'bold',
                                }}
                            >
                                {breakdownData.material.name}
                            </span>{' '}
                            <span
                                style={{
                                    fontSize: '1.3em',
                                }}
                            >
                                ({breakdownData.vendor.name}:{' '}
                                {breakdownData.location})
                            </span>
                        </div>
                    </div>
                    <div>${breakdownData.costPerTon} /t</div>
                    <div>${breakdownData.costPerYard} /yd</div>

                    <br />

                    {/* Fuel Surcharge Table */}
                    <table>
                        <tbody>
                            <tr>
                                <td>Vendor FSC:</td>
                                <td>${breakdownData.vendorFuelSurcharge} /t</td>
                            </tr>
                            <tr>
                                <td>CHT FSC:</td>
                                <td>${breakdownData.chtFuelSurcharge} /t</td>
                            </tr>
                            <tr>
                                <td className="tdBold">Total FSC:</td>
                                <td className="tdBold">
                                    $
                                    {(
                                        parseFloat(
                                            breakdownData.vendorFuelSurcharge
                                        ) +
                                        parseFloat(
                                            breakdownData.chtFuelSurcharge
                                        )
                                    ).toFixed(2)}{' '}
                                    /t
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <br />

                    {/* Product & Freight Breakdown */}
                    <table>
                        <tbody>
                            {/* Product */}
                            <tr>
                                <td>
                                    P: $
                                    {parseFloat(breakdownData.product).toFixed(
                                        2
                                    )}
                                </td>
                                <td>
                                    <span style={{ paddingLeft: '1.3em' }}>
                                        ${productTotal}
                                    </span>
                                </td>
                            </tr>
                            {/* Freight */}
                            <tr>
                                <td>
                                    F: $
                                    {parseFloat(
                                        breakdownData.freightToYard
                                    ).toFixed(2)}
                                </td>
                                <td>
                                    <span style={{ paddingLeft: '1.3em' }}>
                                        ${freightTotal}
                                    </span>
                                </td>
                            </tr>
                            {/* Plus FSC */}
                            <tr>
                                <td></td>
                                <td>+ ${totalFSC} FSC</td>
                            </tr>
                            {/* Totals */}
                            <br />
                            <tr style={{ paddingTop: '1em' }}>
                                <td className="tdBold">Total: </td>
                                <td style={{ paddingLeft: '1.2em' }}>
                                    <span style={{ fontWeight: 'bold' }}>
                                        ${totalWithFSC} &nbsp;&nbsp;
                                    </span>
                                    <span>
                                        ($
                                        {totalWithoutFSC} w/o FSC)
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* MIDDLE COLUMN */}
                <div
                    className="flex-grow-1"
                    style={{ border: '1px solid #E1E1E1', padding: '0.75em' }}
                >
                    <div style={{ marginTop: '2em' }}>
                        <div>{breakdownData.tons} T</div>
                        <div>= {breakdownData.yards} yds</div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div
                    className="flex-grow-1"
                    style={{ border: '1px solid #E1E1E1', padding: '0.75em' }}
                >
                    <div style={{ marginTop: '2em' }}>
                        <div style={{ marginBottom: '1em' }}>
                            <strong style={{ fontSize: '1rem' }}>
                                BILLING
                            </strong>
                        </div>

                        <table>
                            <tbody>
                                <tr>
                                    <td className="tdBold">Vendor:</td>
                                    <td style={{ paddingLeft: '1em' }}>
                                        ${productTotal}
                                    </td>
                                </tr>

                                <div style={{ marginBottom: '0.5em' }}></div>

                                <tr>
                                    <td className="tdBold">CHT:</td>
                                    <td style={{ paddingLeft: '1em' }}>
                                        $
                                        {(
                                            parseFloat(freightTotal) +
                                            parseFloat(totalFSC)
                                        ).toFixed(2)}
                                    </td>
                                </tr>

                                <div style={{ marginBottom: '0.5em' }}></div>

                                <tr>
                                    <td className="tdBold">Total Cost:</td>
                                    <td style={{ paddingLeft: '1em' }}>
                                        ${totalWithFSC}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CostCalculatorPrint
