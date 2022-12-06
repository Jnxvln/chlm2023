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

    const [formData, setFormData] = useState({
        tons: null,
        material: '',
        costPerTon: null,
        totalCostPerTon: null,
    })

    const user = useQuery(['user'], fetchUser)
    const userId = user?.data._id
    const vendorProducts = useQuery({
        queryKey: ['vendorProducts'],
        queryFn: () => getVendorProducts(user.data.token),
        enabled: !!userId,
        onSuccess: (products) => {
            console.log('Vendor Products fetched: ')
            console.log(products)
        },
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

    return (
        <section className="flex justify-content-between gap-4">
            <Card title="Input">
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
                            <InputText
                                id="cc_material"
                                name="material"
                                placeholder="Material"
                                value={formData.material}
                                onChange={onChange}
                                style={{ width: '100%' }}
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
                </form>
            </Card>

            <Card title="Breakdown">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </Card>
        </section>
    )
}

export default CostCalculator
