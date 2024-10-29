import { useState, useEffect } from 'react'
import { useNavigate, createSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
// PrimeReact Components
import { AutoComplete } from 'primereact/autocomplete'
import { Panel } from 'primereact/panel'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
// Store data
import { useQuery } from '@tanstack/react-query'
import { fetchUser } from '../../../api/users/usersApi'
import { getVendors } from '../../../api/vendors/vendorsApi'
import { getVendorProducts } from '../../../api/vendorProducts/vendorProductsApi'
import { getVendorLocations } from '../../../api/vendorLocations/vendorLocationsApi'
import { getFreightRoutes } from '../../../api/freightRoutes/freightRoutesApi'

function CostCalculator() {
    // #region VARS -----------------------------------------------------------------------------
    const initialState = {
        vendor: null,
        tons: null,
        material: '',
        costPerTon: null,
        totalCostTons: null,
    }
    const [filteredProducts, setFilteredProducts] = useState([])
    const [selectedMaterial, setSelectedMaterial] = useState(null)
    const [breakdownData, setBreakdownData] = useState(null)
    const [formData, setFormData] = useState(initialState)
    const [isComplete, setIsComplete] = useState(false)

    const navigate = useNavigate()

    const user = useQuery(['user'], fetchUser)
    const userId = user?.data._id

    const vendors = useQuery({
        queryKey: ['vendors'],
        queryFn: () => getVendors(user.data.token),
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
                toast.error(err.response.data.message, { toastId: 'error-getting-vendors' })
            }
        },
    })

    const vendorProducts = useQuery({
        queryKey: ['vendorProducts'],
        queryFn: () => getVendorProducts(user.data.token),
        enabled: !!userId,
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
                toast.error(err.response.data.message, { toastId: 'error-getting-vendor-products' })
            }
        },
    })

    const vendorLocations = useQuery({
        queryKey: ['vendorLocations'],
        queryFn: () => getVendorLocations(user.data.token),
        enabled: !!userId,
        onError: (err) => {
            const errMsg = 'Error fetching vendor locations'
            console.log(errMsg)
            console.log(err)

            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                toast.error(err.response.data.message, { toastId: 'error-getting-vendor-locations' })
            }
        },
    })

    const freightRoutes = useQuery({
        queryKey: ['freightRoutes'],
        queryFn: () => getFreightRoutes(user.data.token),
        enabled: !!userId,
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
                toast.error(err.response.data.message, { toastId: 'error-fetching-freight-routes' })
            }
        },
    })
    // #endregion

    // #region ACTION HANDLERS ------------------------------------------------------------------
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

        if (e.target.value._id) {
            setSelectedMaterial(e.target.value)
        } else {
            setSelectedMaterial(null)
        }
    }

    const searchProduct = (e) => {
        let _filteredProducts = vendorProducts.data.filter((product) =>
            product.name.toLowerCase().includes(e.query.toLowerCase())
        )

        if (!_filteredProducts || _filteredProducts.length <= 0) {
            setFilteredProducts([])
        } else {
            setFilteredProducts(_filteredProducts)
        }
    }

    const performCalculations = (e) => {
        // Get vendor info
        // const vendor = vendors.data.find(
        //     (v) => v._id === formData.material.vendorId
        // )
        const vendor = vendors.data.find(
            (v) => v._id === selectedMaterial.vendorId
        )

        // Find routes matching vendorLocationId from material
        const routesMatchingVendorLocationId = freightRoutes?.data.find(
            (route) =>
                route.vendorLocationId === formData.material.vendorLocationId &&
                route.destination.toLowerCase() === 'c&h yard'
        )

        // Calculations
        const _location = vendorLocations.data.find(
            (loc) => loc._id === formData.material.vendorLocationId
        )
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
            vendor,
            material: formData.material,
            location: _location.name,
            tons: parseFloat(formData.tons),
            product: parseFloat(_product),
            freightToYard: parseFloat(_freightToYard),
            chtFuelSurcharge: vendor.chtFuelSurcharge
                ? parseFloat(vendor.chtFuelSurcharge)
                : parseFloat(0),
            vendorFuelSurcharge: vendor.vendorFuelSurcharge
                ? parseFloat(vendor.vendorFuelSurcharge)
                : parseFloat(0),
            yards: parseFloat(formData.tons) / 1.35,
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

    const resetFormData = () => {
        setFormData(initialState)
    }

    const resetBreakdownData = () => {
        setBreakdownData(null)
    }

    const handlePrint = () => {
        const params = {
            breakdownData: JSON.stringify(breakdownData),
        }

        navigate({
            pathname: '/dashboard/cost-calculator/print',
            search: `?${createSearchParams(params)}`,
        })
    }

    const vendorIdToName = (vendorId) => {
        let _vendor = vendors.data.find((vendor) => vendor._id === vendorId)
        return _vendor.name
    }

    const vendorLocationToName = (vendorLocationId) => {
        let _vendorLoc = vendorLocations.data.find(
            (loc) => loc._id === vendorLocationId
        )
        return _vendorLoc.name
    }
    // #endregion

    // #region TEMPLATES ------------------------------------------------------------------------
    const inputHeaderTemplate = () => {
        return (
            <div
                style={{
                    backgroundColor: '#124f77',
                    padding: '1em',
                    borderTopLeftRadius: '5px',
                    borderTopRightRadius: '5px',
                    marginBottom: '1em',
                }}
            >
                <h1 style={{ margin: 0, color: 'white', fontWeight: 'bold' }}>
                    Input
                </h1>
            </div>
        )
    }

    const breakdownHeaderTemplate = () => {
        return (
            <div
                style={{
                    backgroundColor: '#826736',
                    padding: '1em',
                    borderTopLeftRadius: '5px',
                    borderTopRightRadius: '5px',
                    marginBottom: '1em',
                }}
            >
                <h1 style={{ margin: 0, color: 'white', fontWeight: 'bold' }}>
                    Breakdown
                </h1>
            </div>
        )
    }

    const materialItemTemplate = (rowData) => {
        // console.log(rowData)
        const vendorName = vendorIdToName(rowData.vendorId)
        const vendorLocName = vendorLocationToName(rowData.vendorLocationId)
        return `${rowData.name} (${vendorName} - ${vendorLocName})`
    }
    // #endregion

    // #region USE EFFECT -----------------------------------------------------------------------
    useEffect(() => {
        if (
            formData.tons &&
            formData.material &&
            formData.material._id &&
            formData.material._id.length > 0
        ) {
            performCalculations()
        }

        if (formData.tons && formData.material) {
            setIsComplete(true)
        } else if (!formData.tons && !formData.material) {
            setIsComplete(false)
        }
    }, [formData.tons, formData.material])

    useEffect(() => {
        if (!isComplete) {
            resetBreakdownData()
            resetFormData()
        }
    }, [isComplete])
    // #endregion

    return (
        <section className="flex gap-4">
            {/* INPUT PANEL */}
            <Panel
                header="Input"
                headerTemplate={inputHeaderTemplate}
                className="flex-grow-1"
            >
                <form className="flex flex-column gap-3">
                    {/* TONAGE */}
                    <div className="field">
                        <span className="p-float-label">
                            <InputNumber
                                id="cc_tons"
                                placeholder="Tons"
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
                                autoFocus
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
                                itemTemplate={materialItemTemplate}
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
                                tabIndex={-1}
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
                                tabIndex={-1}
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

                    <Button
                        type="button"
                        id="costCalculatorPrintBtn"
                        icon="pi pi-print"
                        label="Print"
                        disabled={
                            !formData.tons ||
                            !formData.material ||
                            !formData.costPerTon ||
                            !formData.totalCostTons
                        }
                        onClick={handlePrint}
                    />
                </form>
            </Panel>

            {/* BREAKDOWN PANEL */}
            <Panel
                header="Breakdown"
                headerTemplate={breakdownHeaderTemplate}
                className="flex-grow-1"
            >
                <div className="flex flex-column gap-4">
                    <div
                        style={{
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                            textAlign: 'center',
                        }}
                    >
                        {formData && formData.material ? (
                            <>{formData.material.name}</>
                        ) : (
                            ''
                        )}

                        <br />

                        {selectedMaterial && (
                            <div
                                style={{
                                    textAlign: 'center',
                                    fontSize: '1rem',
                                }}
                            >
                                {vendorIdToName(selectedMaterial.vendorId)} -{' '}
                                {vendorLocationToName(
                                    selectedMaterial.vendorLocationId
                                )}
                            </div>
                        )}
                    </div>

                    {/* BREAKDOWN TABLES */}
                    <table
                        style={{
                            borderCollapse: 'collapse',
                            borderColor: '#AAAAAA',
                        }}
                        border="1"
                    >
                        <tbody>
                            {/* PRODUCT, FREIGHT ---------------------------------- */}

                            {/* Product */}
                            <tr>
                                <td className="tdBold">Product:</td>
                                {breakdownData && breakdownData.product ? (
                                    <td>
                                        $
                                        {breakdownData && breakdownData.product}{' '}
                                        /T
                                    </td>
                                ) : (
                                    <td></td>
                                )}
                            </tr>

                            {/* Freight */}
                            <tr>
                                <td className="tdBold ">Freight:</td>
                                {breakdownData &&
                                breakdownData.freightToYard ? (
                                    <td>
                                        $
                                        {breakdownData &&
                                            breakdownData.freightToYard}{' '}
                                        /T
                                    </td>
                                ) : (
                                    <td></td>
                                )}
                            </tr>

                            <tr className="spacer">
                                <td colSpan="4">&nbsp;</td>
                            </tr>

                            {/* FUEL SURCHARGES ----------------------------------------- */}

                            {/* Vendor FSC */}
                            <tr>
                                <td className="tdBold">Vendor FSC:</td>
                                {breakdownData &&
                                breakdownData.vendorFuelSurcharge ? (
                                    <td>
                                        ${breakdownData.vendorFuelSurcharge} /T
                                        ($
                                        {(
                                            parseFloat(
                                                breakdownData.vendorFuelSurcharge
                                            ) * parseFloat(formData.tons)
                                        ).toFixed(2)}
                                        )
                                    </td>
                                ) : (
                                    <td></td>
                                )}
                            </tr>

                            {/* CHT FSC */}
                            <tr>
                                <td className="tdBold">CHT FSC:</td>
                                {breakdownData &&
                                breakdownData.chtFuelSurcharge ? (
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
                                ) : (
                                    <td></td>
                                )}
                            </tr>

                            {/* Total FSC */}
                            <tr>
                                <td className="tdBold">Total FSC:</td>

                                {breakdownData &&
                                breakdownData.vendorFuelSurcharge &&
                                breakdownData.chtFuelSurcharge ? (
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
                                ) : (
                                    <td></td>
                                )}
                            </tr>

                            <tr className="spacer">
                                <td colSpan="4">&nbsp;</td>
                            </tr>

                            {/* TONS, COST PER TON ----------------------------------- */}

                            {/* Tons */}
                            <tr>
                                <td className="tdBold ">Tons:</td>
                                {formData && formData.tons ? (
                                    <td>{formData.tons} Tons</td>
                                ) : (
                                    <td></td>
                                )}
                            </tr>

                            {/* Cost Per Ton */}
                            <tr>
                                <td className="tdBold ">
                                    Cost Per Ton (w FSC):
                                </td>
                                {breakdownData && breakdownData.costPerTon ? (
                                    <td>${breakdownData.costPerTon} /T</td>
                                ) : (
                                    <td></td>
                                )}
                            </tr>

                            {/* Qty (yds) */}
                            <tr>
                                <td className="tdBold">Qty (yds):</td>
                                {breakdownData && breakdownData.yards ? (
                                    <td>
                                        {breakdownData && breakdownData.yards}{' '}
                                        cu yds
                                    </td>
                                ) : (
                                    <td></td>
                                )}
                            </tr>

                            {/* Cost Per Yard */}
                            <tr>
                                <td className="tdBold">Cost Per Yard:</td>
                                {breakdownData && breakdownData.costPerYard ? (
                                    <td>
                                        $
                                        {breakdownData &&
                                            breakdownData.costPerYard}{' '}
                                        /yd
                                    </td>
                                ) : (
                                    <td></td>
                                )}
                            </tr>

                            <tr className="spacer">
                                <td colSpan="4">&nbsp;</td>
                            </tr>

                            {/* TOTALS ----------------------------------------- */}

                            {/* Total Cost (w FSC) */}
                            <tr>
                                <td className="tdBold">Total Cost (w FSC):</td>
                                {formData && formData.totalCostTons ? (
                                    <td style={{ fontWeight: 'bold' }}>
                                        ${formData.totalCostTons}
                                    </td>
                                ) : (
                                    <td></td>
                                )}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Panel>
        </section>
    )
}

export default CostCalculator
