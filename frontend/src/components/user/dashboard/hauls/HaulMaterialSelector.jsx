import { useState, useEffect } from 'react'
import { AutoComplete } from 'primereact/autocomplete'

function HaulVendorProductSelector({
    vendorProducts,
    onVendorProductSelected,
    vendorLocationSelected,
    value,
}) {
    const [vendorProductSelected, setVendorProductSelected] = useState(null)
    const [filteredVendorProducts, setFilteredVendorProducts] = useState([])

    // #region TEMPLATES -------------------------------------
    const vendorProductItemTemplate = (option) => {
        return <>{option.name}</>
    }
    // #endregion

    const searchVendorProduct = (e) => {
        const { query } = e

        if (vendorProducts && vendorProducts.length > 0) {
            const _filteredVendorProducts = vendorProducts.filter(
                (product) =>
                    product.name.toLowerCase().includes(query.toLowerCase()) &&
                    product.vendorLocationId === vendorLocationSelected._id
            )
            setFilteredVendorProducts(_filteredVendorProducts)
        }
    }

    useEffect(() => {
        if (value) {
            setVendorProductSelected(value)
        }
    }, [])

    return (
        <div style={{ width: '100%' }}>
            <AutoComplete
                id="haulVendorProductSelector"
                dropdown
                field="name"
                value={vendorProductSelected}
                suggestions={filteredVendorProducts}
                completeMethod={searchVendorProduct}
                itemTemplate={vendorProductItemTemplate}
                placeholder="Material *"
                onChange={(e) => {
                    setVendorProductSelected(e.value)
                    onVendorProductSelected(e.value)
                }}
                style={{ width: '100%' }}
                required
            />
        </div>
    )
}

export default HaulVendorProductSelector
