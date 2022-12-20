import { useState } from 'react'
import styles from '../../../styles/pages/landing/Landing.module.scss'
import { SelectButton } from 'primereact/selectbutton'

function LandingMaterials() {
    const materialCategories = [
        { label: 'Gravel', value: 'gravel' },
        { label: 'Soil', value: 'soil' },
        { label: 'Compost', value: 'compost' },
        { label: 'Mulch', value: 'mulch' },
        { label: 'Flagstone', value: 'flagstone' },
        { label: 'Creek Rock', value: 'creekRock' },
    ]
    const [categorySelected, setCategorySelected] = useState('soil')

    const categoryTemplate = (option) => {
        return (
            <div className={styles['materials-category-label']}>
                {option.label}
            </div>
        )
    }

    return (
        <div className={styles['materials-container']}>
            <header className={styles['materials-header']}>
                <h1 className={styles['materials-header-title']}>
                    Browse Our Materials
                </h1>
                <div className={styles['materials-gallery']}></div>

                {/* CATEGORIES */}
                <div className={styles['materials-categories']}>
                    <SelectButton
                        value={categorySelected}
                        options={materialCategories}
                        itemTemplate={categoryTemplate}
                        onChange={(e) => setCategorySelected(e.value)}
                    />
                </div>
            </header>
        </div>
    )
}

export default LandingMaterials
