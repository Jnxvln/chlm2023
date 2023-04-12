import { useState, useRef } from 'react'
import styles from './Calculator.module.scss'
import ShapeDisplay from './ShapeDisplay'
import FormDisplay from './FormDispay/FormDisplay'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { OverlayPanel } from 'primereact/overlaypanel'

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
    const [dimensions, setDimensions] = useState(undefined)
    const infoRef = useRef(null)
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

    const onFormUpdated = (formInfo) => {
        console.log(
            '[Calculator.jsx]: FormDisplay.jsx triggered onFormUpdated: '
        )
        console.log(formInfo)
        setDimensions(formInfo)
    }
    // #endregion

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
                <Button
                    type="button"
                    icon="pi pi-info"
                    style={{
                        backgroundColor: 'white',
                        color: 'navy',
                        fontWeight: 'bold',
                        marginLeft: '0.5em',
                    }}
                    onClick={(e) => infoRef.current.toggle(e)}
                />
                <OverlayPanel ref={infoRef} style={{ maxWidth: '600px' }}>
                    <h2>How It Works</h2>
                    <div>
                        <strong>
                            Disclaimer: Results provided by the calculator are
                            an approximation only.
                        </strong>
                    </div>
                    <div>
                        <ol className={styles.instructionList}>
                            <li>
                                Choose the shape that best matches your project.
                            </li>
                            <li>
                                Look at the diagram, input each dimension
                                according to your measurements
                            </li>
                            <li>
                                Click the <strong>Calculate</strong> button to
                                display the result in cubic yards
                            </li>
                        </ol>
                        <div className="mb-3">
                            An image of a skidsteer with a half-yard loader
                            bucket will appear with an approximation of how many
                            buckets it might take.
                        </div>
                        <div className="mb-3">
                            This estimate will round up since the calculator
                            does not figure in compaction.{' '}
                            <strong>
                                In reality, it could take more or less, but this
                                tool should help you get close.
                            </strong>
                        </div>
                        <div className="mb-3">
                            Note: The{' '}
                            <span style={{ fontStyle: 'italic' }}>
                                smallest
                            </span>{' '}
                            quantity we will load is a quarter-yard <br />
                            (1/4yd or 0.25 cubic yards)
                        </div>
                    </div>
                </OverlayPanel>
            </section>

            {/* CALCULATOR */}
            <div className={styles.contentWrapper}>
                {/* Shape Display */}
                <div className={styles.shapeWrapper}>
                    <ShapeDisplay
                        shape={shapeSelected}
                        dimensions={dimensions}
                    />
                </div>
                <div className={styles.formWrapper}>
                    <FormDisplay
                        shape={shapeSelected}
                        onFormUpdated={onFormUpdated}
                    />
                </div>
            </div>
        </div>
    )
}
