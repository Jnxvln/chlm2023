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
        }
    }, [breakdownData])

    return (
        <section>
            <h1>CostCalculatorPrint</h1>
            <div style={{ border: '1px dashed black' }}>
                {/* Cost-Per Breakdowns */}
                <div>
                    <strong>{breakdownData.material.name}</strong> (
                    {breakdownData.vendor.name})
                </div>
                <div>${breakdownData.costPerTon} /t</div>
                <div>${breakdownData.costPerYard} /yd</div>

                <br />

                {/* Fuel Surcharge Table */}
                <table border={1} style={{ borderCollapse: 'collapse' }}>
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
                            <td>Total FSC:</td>
                            <td>
                                $
                                {(
                                    parseFloat(
                                        breakdownData.vendorFuelSurcharge
                                    ) +
                                    parseFloat(breakdownData.chtFuelSurcharge)
                                ).toFixed(2)}{' '}
                                /t
                            </td>
                        </tr>
                    </tbody>
                </table>

                <br />

                {/* Product & Freight Breakdown */}
                <table border={1} style={{ borderCollapse: 'collapse' }}>
                    <tbody>
                        {/* Product */}
                        <tr>
                            <td>
                                P: $
                                {parseFloat(breakdownData.product).toFixed(2)}
                            </td>
                            <td>${productTotal}</td>
                        </tr>

                        {/* Freight */}
                        <tr>
                            <td>
                                F: $
                                {parseFloat(
                                    breakdownData.freightToYard
                                ).toFixed(2)}
                            </td>
                            <td>${freightTotal}</td>
                        </tr>

                        {/* Plus FSC */}
                        <tr>
                            <td></td>
                            <td>+ ${totalFSC} FSC</td>
                        </tr>

                        {/* Totals */}
                        <tr>
                            <td>=</td>
                            <td>$ {totalWithFSC}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default CostCalculatorPrint
