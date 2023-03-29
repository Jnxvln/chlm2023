import MaterialsHeader from '../../components/Materials/MaterialsHeader/MaterialsHeader'
import FilterBar from '../../components/Materials/MaterialsHeader/FilterBar/FilterBar'

export default function Materials() {
    return (
        <section style={{ paddingBottom: '3em' }}>
            <MaterialsHeader />
            <FilterBar />
        </section>
    )
}
