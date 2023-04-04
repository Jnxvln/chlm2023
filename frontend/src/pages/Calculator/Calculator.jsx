import { useState, useEffect } from 'react'
import styles from './Calculator.module.scss'
import ShapeDisplay from './ShapeDisplay'
import FormDisplay from './FormDispay/FormDisplay'
import { Dropdown } from 'primereact/dropdown'

export default function Calculator() {
    // #region VARS
    const [shapes] = useState([
        {
            name: 'Clear Selection',
            value: null,
        },
        {
            name: 'Rectangle',
            value: 'rectangle',
        },
        {
            name: 'Rectangle Border',
            value: 'rectangleBorder',
        },
        {
            name: 'Circle',
            value: 'circle',
        },
        {
            name: 'Circle Border',
            value: 'circleBorder',
        },
        {
            name: 'Annulus',
            value: 'annulus',
        },
        {
            name: 'Triangle',
            value: 'triangle',
        },
        {
            name: 'Trapezoid',
            value: 'trapezoid',
        },
    ])
    const [shapeSelected, setShapeSelected] = useState(undefined)
    // #endregion

    // #region SHAPE TEMPLATES
    const shapesTemplate = (option) => {
        switch (option.value) {
            case 'rectangle':
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg
                            width={50}
                            height={50}
                            style={{ marginRight: '0.4em' }}
                        >
                            <rect
                                width={50}
                                height={25}
                                y={12.5}
                                style={{
                                    fill: 'green',
                                    fillOpacity: 1,
                                }}
                            />
                        </svg>
                        <span>Rectangle</span>
                    </div>
                )

            case 'rectangleBorder':
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg
                            width={50}
                            height={50}
                            style={{ marginRight: '0.4em' }}
                        >
                            <rect
                                width={50}
                                height={50}
                                style={{ fill: 'green' }}
                            />
                            <rect
                                width={30}
                                height={30}
                                x={10}
                                y={10}
                                style={{
                                    fill: '#F3F3F3',
                                    fillOpacity: 1,
                                }}
                            />
                        </svg>
                        <span>Rectangle Border</span>
                    </div>
                )

            case 'circle':
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg
                            width={50}
                            height={50}
                            style={{ marginRight: '0.4em' }}
                        >
                            <ellipse
                                cx={25}
                                cy={25}
                                rx={25}
                                ry={25}
                                style={{
                                    fill: 'green',
                                    fillOpacity: 1,
                                }}
                            />
                        </svg>
                        <span>Circle</span>
                    </div>
                )

            case 'circleBorder':
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg
                            width={50}
                            height={50}
                            style={{ marginRight: '0.4em' }}
                        >
                            <ellipse
                                cx={25}
                                cy={25}
                                rx={25}
                                ry={25}
                                style={{
                                    fill: 'green',
                                    fillOpacity: 1,
                                }}
                            />

                            <ellipse
                                cx={25}
                                cy={25}
                                rx={12.5}
                                ry={12.5}
                                style={{
                                    fill: '#F3F3F3',
                                    fillOpacity: 1,
                                }}
                            />
                        </svg>
                        <span>Circle Border</span>
                    </div>
                )

            case 'annulus':
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg
                            width={50}
                            height={50}
                            style={{ marginRight: '0.4em' }}
                        >
                            <ellipse
                                cx={25}
                                cy={25}
                                rx={25}
                                ry={25}
                                style={{
                                    fill: 'green',
                                    fillOpacity: 1,
                                }}
                            />

                            <ellipse
                                cx={25}
                                cy={25}
                                rx={12.5}
                                ry={12.5}
                                style={{
                                    fill: '#F3F3F3',
                                    fillOpacity: 1,
                                }}
                            />
                        </svg>
                        <span>Annulus</span>
                    </div>
                )

            case 'triangle':
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg
                            width={50}
                            height={50}
                            style={{ marginRight: '0.4em' }}
                        >
                            <polygon
                                points="25,0 50,45 0,45"
                                style={{
                                    fill: 'green',
                                    strokeWidth: 1,
                                }}
                            />
                        </svg>
                        <span>Triangle</span>
                    </div>
                )

            case 'trapezoid':
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg
                            width={50}
                            height={50}
                            style={{ marginRight: '0.4em' }}
                        >
                            <polygon
                                points="0,40 10,10 40,10 50,40"
                                style={{
                                    fill: 'green',
                                    strokeWidth: 1,
                                }}
                            />
                        </svg>
                        <span>Trapezoid</span>
                    </div>
                )

            default:
                return <>Clear Selection</>
        }
    }

    const selectedShapeTemplate = (option) => {
        if (option) {
            return <>{option.name}</>
        } else {
            return <>Choose project shape</>
        }
    }
    // #endregion

    // useEffect(() => {
    //     if (shapeSelected) {
    //         console.log('Shape selected: ')
    //         console.log(shapeSelected)
    //     }
    // }, [shapeSelected])

    return (
        <div>
            <header className={styles.header}>
                <div className={styles.gradient}></div>
                <h1 className={styles.title}>Bulk Calculator</h1>
            </header>

            {/* Shape Selector */}
            <section className={styles.shapeSelectorContainer}>
                <Dropdown
                    value={shapeSelected}
                    onChange={(e) => setShapeSelected(e.value)}
                    options={shapes}
                    optionLabel="name"
                    optionValue="value"
                    placeholder="Choose project shape"
                    valueTemplate={selectedShapeTemplate}
                    itemTemplate={shapesTemplate}
                    className="w-full md:w-24rem"
                />
            </section>

            {/* CALCULATOR */}
            <div className={styles.contentWrapper}>
                {/* Shape Display */}
                <div className={styles.shapeWrapper}>
                    <ShapeDisplay shape={shapeSelected} />
                </div>
                <div className={styles.formWrapper}>
                    <FormDisplay shape={shapeSelected} />
                </div>
            </div>
        </div>
    )
}
