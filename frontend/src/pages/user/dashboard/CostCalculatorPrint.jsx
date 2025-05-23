import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
// PrimeReact Components
import { Button } from 'primereact/button'

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

            console.log(`Tons: ${parseFloat(breakdownData.tons)}`)
            console.log(`Product: ${parseFloat(breakdownData.product)}`)
            console.log(
                `Freight to yard: ${parseFloat(breakdownData.freightToYard)}`
            )
            console.log(
                `chtFuelSurcharge: ${parseFloat(
                    breakdownData.chtFuelSurcharge
                )}`
            )
            console.log(
                `vendorFuelSurcharge: ${parseFloat(
                    breakdownData.vendorFuelSurcharge
                )}`
            )

            let _productTotal = breakdownData.product * breakdownData.tons
            let _freightTotal = breakdownData.freightToYard * breakdownData.tons
            let _fscTotal =
                breakdownData.chtFuelSurcharge * breakdownData.tons +
                breakdownData.vendorFuelSurcharge * breakdownData.tons

            setTotalWithFSC(
                (_productTotal + _freightTotal + _fscTotal).toFixed(2)
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
                    <Button
                        label="Print"
                        icon="pi pi-print"
                        iconPos="left"
                        className="noPrint"
                        onClick={() => window.print()}
                    />

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
                                <td>
                                    ($
                                    {(
                                        breakdownData.vendorFuelSurcharge *
                                        breakdownData.tons
                                    ).toFixed(2)}
                                    )
                                </td>
                            </tr>
                            <tr>
                                <td>CHT FSC:</td>
                                <td>${breakdownData.chtFuelSurcharge} /t</td>
                                <td>
                                    ($
                                    {(
                                        breakdownData.chtFuelSurcharge *
                                        breakdownData.tons
                                    ).toFixed(2)}
                                    )
                                </td>
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
                                <td>
                                    ($
                                    {(
                                        breakdownData.vendorFuelSurcharge *
                                            breakdownData.tons +
                                        breakdownData.chtFuelSurcharge *
                                            breakdownData.tons
                                    ).toFixed(2)}
                                    )
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
                                <td>
                                    + $
                                    {(
                                        breakdownData.vendorFuelSurcharge *
                                            breakdownData.tons +
                                        breakdownData.chtFuelSurcharge *
                                            breakdownData.tons
                                    ).toFixed(2)}{' '}
                                    FSC
                                </td>
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
                        <div>{breakdownData.tons.toFixed(2)} T</div>
                        <div>= {breakdownData.yards.toFixed(2)} yds</div>
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
                                        $
                                        {(
                                            breakdownData.product *
                                                breakdownData.tons +
                                            breakdownData.vendorFuelSurcharge *
                                                breakdownData.tons
                                        ).toFixed(2)}
                                    </td>
                                </tr>

                                <div style={{ marginBottom: '0.5em' }}></div>

                                <tr>
                                    <td className="tdBold">CHT:</td>
                                    <td style={{ paddingLeft: '1em' }}>
                                        $
                                        {(
                                            parseFloat(freightTotal) +
                                            parseFloat(
                                                breakdownData.chtFuelSurcharge *
                                                    breakdownData.tons
                                            )
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
