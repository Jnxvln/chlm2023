import { AutoComplete } from 'primereact/autocomplete'

// PrimeReact Components
import { useState } from 'react'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
// Store data
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchUser } from '../../../api/users/usersApi'
import { getVendorProducts } from '../../../api/vendorProducts/vendorProductsApi'
import { toast } from 'react-toastify'

function CostCalculator() {
    // #region VARS --------------------------------------------------------------------------

    const [filteredProducts, setFilteredProducts] = useState([])
    const [formData, setFormData] = useState({
        tons: null,
        material: '',
        costPerTon: null,
        totalCost: null,
    })

    const user = useQuery(['user'], fetchUser)
    const userId = user?.data._id
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

    return (
        <section className="flex gap-4">
            <Card
                title="Input"
                className="flex-grow-1"
                style={{ backgroundColor: '#F7F7F7' }}
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
                                        ? 'p-inputwrapper-filled'
                                        : ''
                                }
                                style={{ width: '100%' }}
                            />
                            <label htmlFor="cc_costPerTon">Cost Per Ton</label>
                        </span>
                    </div>

                    {/* TOTAL COST PER TON */}
                    <div className="field">
                        <span className="p-float-label">
                            <InputNumber
                                id="cc_totalCost"
                                placeholder="Total Cost (ton)"
                                name="totalCost"
                                value={formData.totalCost}
                                onChange={onChangeNumber}
                                mode="decimal"
                                minFractionDigits={2}
                                maxFractionDigits={2}
                                readOnly
                                className={
                                    formData.totalCost &&
                                    formData.totalCost <= 0
                                        ? 'p-inputwrapper-filled'
                                        : ''
                                }
                                style={{
                                    width: '100%',
                                }}
                            />
                            <label htmlFor="cc_totalCost">
                                Total Cost (ton)
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
                    <table>
                        <tbody>
                            <tr>
                                <td className="tdBold">Product:</td>
                                <td>$/T</td>
                            </tr>
                            <tr>
                                <td className="tdBold">Freight:</td>
                                <td>$/T</td>
                            </tr>
                            <tr>
                                <td className="tdBold">Tons:</td>
                                <td>$/T</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* FUEL SURCHARGES */}
                    <table>
                        <tbody>
                            <tr>
                                <td className="tdBold">Vendor FSC:</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td className="tdBold">CHT FSC:</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td className="tdBold">Total FSC:</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>

                    {/* TOTALS */}
                    <table>
                        <tbody>
                            <tr>
                                <td className="tdBold">Qty (yds):</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td className="tdBold">Cost Per Yard:</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td className="tdBold">Total Cost (yd):</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </section>
    )
}

export default CostCalculator
