import { AutoComplete } from 'primereact/autocomplete'

// PrimeReact Components
import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
// Store data
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchUser } from '../../../api/users/usersApi'
import { getVendors } from '../../../api/vendors/vendorsApi'
import { getVendorProducts } from '../../../api/vendorProducts/vendorProductsApi'
import { getFreightRoutes } from '../../../api/freightRoutes/freightRoutesApi'
import { toast } from 'react-toastify'

function CostCalculator() {
    // #region VARS --------------------------------------------------------------------------

    const [filteredProducts, setFilteredProducts] = useState([])
    const [breakdownData, setBreakdownData] = useState(null)
    const [formData, setFormData] = useState({
        tons: null,
        material: '',
        costPerTon: null,
        totalCostTons: null,
    })

    const user = useQuery(['user'], fetchUser)
    const userId = user?.data._id

    const vendors = useQuery({
        queryKey: ['vendors'],
        queryFn: () => getVendors(user.data.token),
        onSuccess: (vendors) => {
            console.log('Vendors fetched: ')
            console.log(vendors)
        },
        onError: (err) => {
            const errMsg = 'Error fetching vendors'
            console.log(errMsg)
            console.log(err)

            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                toast.error(err.response.data.message)
            }
        },
    })

    const vendorProducts = useQuery({
        queryKey: ['vendorProducts'],
        queryFn: () => getVendorProducts(user.data.token),
        enabled: !!userId,
        // onSuccess: (products) => {
        //     console.log('Vendor Products fetched: ')
        //     console.log(products)
        // },
        onError: (err) => {
            const errMsg = 'Error fetching vendor products'
            console.log(errMsg)
            console.log(err)

            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                toast.error(err.response.data.message)
            }
        },
    })

    const freightRoutes = useQuery({
        queryKey: ['freightRoutes'],
        queryFn: () => getFreightRoutes(user.data.token),
        enabled: !!userId,
        onSuccess: (freightRoutes) => {
            console.log('Routes fetched: ')
            console.log(freightRoutes)
        },
        onError: (err) => {
            const errMsg = 'Error fetching routes'
            console.log(errMsg)
            console.log(err)

            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                toast.error(err.response.data.message)
            }
        },
    })
    // #endregion

    const onChange = (e) => {
        if (e.hasOwnProperty('target')) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
    }

    const onChangeNumber = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.originalEvent.target.name]: e.value,
        }))
    }

    const onChangeAutoComplete = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.value,
        }))
    }

    const searchProduct = (e) => {
        let _filteredProducts = vendorProducts.data.filter((product) =>
            product.name.startsWith(e.query)
        )

        if (!_filteredProducts || _filteredProducts.length <= 0) {
            setFilteredProducts([])
        } else {
            setFilteredProducts(_filteredProducts)
        }
    }

    const performCalculations = (e) => {
        // Get vendor info
        const vendor = vendors.data.find(
            (v) => v._id === formData.material.vendorId
        )

        // Find routes matching vendorLocationId from material
        const routesMatchingVendorLocationId = freightRoutes?.data.find(
            (route) =>
                route.vendorLocationId === formData.material.vendorLocationId
        )

        // Calculations
        const _product = parseFloat(formData.material.productCost)
        const _freightToYard = parseFloat(
            routesMatchingVendorLocationId.freightCost
        )
        const _chtFuelSurchage = vendor.chtFuelSurcharge
            ? parseFloat(vendor.chtFuelSurcharge)
            : 0

        const _costPerYard = (
            (_product + _freightToYard + _chtFuelSurchage) *
            1.35
        ).toFixed(2)

        const _costPerTon = (
            _product +
            _freightToYard +
            _chtFuelSurchage
        ).toFixed(2)

        const _totalCostTons = (_costPerTon * formData.tons).toFixed(2)

        // Set Breakdown Data
        setBreakdownData({
            product: parseFloat(_product).toFixed(2),
            freightToYard: parseFloat(_freightToYard).toFixed(2),
            chtFuelSurcharge: vendor.chtFuelSurcharge
                ? parseFloat(vendor.chtFuelSurcharge).toFixed(2)
                : parseFloat(0).toFixed(2),
            vendorFuelSurcharge: vendor.vendorFuelSurcharge
                ? parseFloat(vendor.vendorFuelSurcharge).toFixed(2)
                : parseFloat(0).toFixed(2),
            yards: (parseFloat(formData.tons) / 1.35).toFixed(2),
            costPerYard: _costPerYard,
            costPerTon: _costPerTon,
            totalCostTons: _totalCostTons,
        })

        setFormData((prevState) => ({
            ...prevState,
            costPerTon: _costPerTon,
            totalCostTons: _totalCostTons,
        }))

        return _costPerTon
    }
    // #region USE EFFECT

    useEffect(() => {
        if (
            formData.tons &&
            formData.material &&
            formData.material._id &&
            formData.material._id.length > 0
        ) {
            console.log('Running calculations...')
            performCalculations()
        }
    }, [formData.tons, formData.material])

    useEffect(() => {
        if (breakdownData) {
            console.log('Breakdown Data: ')
            console.log(breakdownData)
        }
    }, [breakdownData])
    // #endregion

    return (
        <section className="flex gap-4">
            <Card
                title="Input"
                className="flex-grow-1"
                style={{ backgroundColor: '' }}
            >
                <form className="flex flex-column gap-3">
                    {/* TONAGE */}
                    <div className="field">
                        <span className="p-float-label">
                            <InputNumber
                                id="cc_tons"
                                placeholder="Cost Per Ton"
                                name="tons"
                                value={formData.tons}
                                onChange={onChangeNumber}
                                mode="decimal"
                                minFractionDigits={2}
                                maxFractionDigits={2}
                                className={
                                    formData.tons && formData.tons <= 0
                                        ? 'p-inputwrapper-filled'
                                        : ''
                                }
                                style={{ width: '100%' }}
                            />
                            <label htmlFor="cc_tons">Tons</label>
                        </span>
                    </div>

                    {/* MATERIAL */}
                    <div className="field">
                        <span className="p-float-label">
                            <AutoComplete
                                id="cc_material"
                                name="material"
                                field="name"
                                value={formData.material}
                                suggestions={filteredProducts}
                                completeMethod={searchProduct}
                                onChange={(e) => onChangeAutoComplete(e)}
                            />

                            <label htmlFor="cc_material">Material</label>
                        </span>
                    </div>

                    {/* COST PER TON */}
                    <div className="field">
                        <span className="p-float-label">
                            <InputNumber
                                id="cc_costPerTon"
                                placeholder="Cost Per Ton"
                                name="costPerTon"
                                value={formData.costPerTon}
                                onChange={onChangeNumber}
                                mode="decimal"
                                minFractionDigits={2}
                                maxFractionDigits={2}
                                readOnly
                                className={
                                    formData.costPerTon &&
                                    formData.costPerTon <= 0
                                        ? 'p-inputwrapper-filled readOnlyBgColor'
                                        : 'readOnlyBgColor'
                                }
                                style={{ width: '100%' }}
                            />
                            <label
                                htmlFor="cc_costPerTon"
                                style={{
                                    backgroundColor: 'white',
                                }}
                            >
                                Cost Per Ton (w FSC)
                            </label>
                        </span>
                    </div>

                    {/* TOTAL COST PER TON */}
                    <div className="field">
                        <span className="p-float-label">
                            <InputNumber
                                id="cc_totalCost"
                                placeholder="Total Cost (ton)"
                                name="totalCost"
                                value={formData.totalCostTons}
                                onChange={onChangeNumber}
                                mode="decimal"
                                minFractionDigits={2}
                                maxFractionDigits={2}
                                readOnly
                                className={
                                    formData.totalCost &&
                                    formData.totalCost <= 0
                                        ? 'p-inputwrapper-filled readOnlyBgColor'
                                        : 'readOnlyBgColor'
                                }
                                style={{
                                    width: '100%',
                                }}
                            />
                            <label
                                htmlFor="cc_totalCost"
                                style={{
                                    backgroundColor: 'white',
                                }}
                            >
                                Total Cost (w FSC)
                            </label>
                        </span>
                    </div>

                    <Button type="button" icon="pi pi-print" label="Print" />
                </form>
            </Card>

            <Card
                title="Breakdown"
                className="flex-grow-1"
                style={{ backgroundColor: '#E0E9F0' }}
            >
                <div className="flex flex-column gap-4">
                    {/* PRODUCT, FREIGHT, TONS */}
                    <table style={{ borderCollapse: 'collapse' }} border="1">
                        <tbody>
                            {/* PRODUCT, FREIGHT, TONS */}
                            <tr>
                                <td className="tdBold">Product:</td>
                                <td>
                                    ${breakdownData && breakdownData.product} /T
                                </td>
                            </tr>
                            <tr>
                                <td className="tdBold ">Freight:</td>
                                <td>
                                    $
                                    {breakdownData &&
                                        breakdownData.freightToYard}{' '}
                                    /T
                                </td>
                            </tr>
                            <tr>
                                <td className="tdBold ">Tons:</td>
                                <td>{formData.tons} Tons</td>
                            </tr>

                            <tr class="spacer">
                                <td colspan="4">&nbsp;</td>
                            </tr>

                            {/* FUEL SURCHARGES */}
                            <tr>
                                <td className="tdBold">Vendor FSC:</td>
                                <td>
                                    $
                                    {breakdownData &&
                                        breakdownData.vendorFuelSurcharge}{' '}
                                    /T ($
                                    {(
                                        parseFloat(
                                            breakdownData &&
                                                breakdownData.vendorFuelSurcharge
                                        ) * parseFloat(formData.tons)
                                    ).toFixed(2)}
                                    )
                                </td>
                            </tr>

                            <tr>
                                <td className="tdBold">CHT FSC:</td>
                                <td>
                                    $
                                    {breakdownData &&
                                        breakdownData.chtFuelSurcharge}{' '}
                                    /T ($
                                    {(
                                        parseFloat(
                                            breakdownData &&
                                                breakdownData.chtFuelSurcharge
                                        ) * parseFloat(formData.tons)
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
                                            breakdownData &&
                                                breakdownData.vendorFuelSurcharge
                                        ) +
                                        parseFloat(
                                            breakdownData &&
                                                breakdownData.chtFuelSurcharge
                                        )
                                    ).toFixed(2)}{' '}
                                    /T ($
                                    {(
                                        parseFloat(
                                            breakdownData &&
                                                breakdownData.vendorFuelSurcharge
                                        ) *
                                            parseFloat(formData.tons) +
                                        parseFloat(
                                            breakdownData &&
                                                breakdownData.chtFuelSurcharge
                                        ) *
                                            parseFloat(formData.tons)
                                    ).toFixed(2)}
                                    )
                                </td>
                            </tr>

                            <tr class="spacer">
                                <td colspan="4">&nbsp;</td>
                            </tr>

                            {/* TOTALS */}
                            <tr>
                                <td className="tdBold">Qty (yds):</td>
                                <td>
                                    {breakdownData && breakdownData.yards} cu
                                    yds
                                </td>
                            </tr>
                            <tr>
                                <td className="tdBold">Cost Per Yard:</td>
                                <td>
                                    $
                                    {breakdownData && breakdownData.costPerYard}{' '}
                                    /yd
                                </td>
                            </tr>
                            <tr>
                                <td className="tdBold">Total Cost (w FSC):</td>
                                <td>${formData.totalCostTons}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </section>
    )
}

export default CostCalculator
