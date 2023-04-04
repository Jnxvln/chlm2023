import styles from './FormDisplay.module.scss'
import { useState, useEffect } from 'react'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'

export default function FormDisplay({ shape }) {
    const units = [
        {
            name: 'Feet',
            value: 'feet',
        },
        {
            name: 'Inches',
            value: 'inches',
        },
    ]

    // #region INITIAL STATE
    const initRectangle = {
        length: 0,
        width: 0,
        depth: 0,
        lengthUnit: units[0].value,
        widthUnit: units[0].value,
        depthUnit: units[1].value,
    }

    const initRectangleBorder = {
        innerLength: 0,
        innerWidth: 0,
        borderWidth: 0,
        depth: 0,
        innerLengthUnit: units[0].value,
        innerWidthUnit: units[0].value,
        borderWidthUnit: units[0].value,
        depthUnit: units[1].value,
    }

    const initCircle = {
        diameter: 0,
        depth: 0,
        diameterUnit: units[0].value,
        depthUnit: units[1].value,
    }

    const initCircleBorder = {
        innerDiameter: 0,
        borderWidth: 0,
        depth: 0,
        innerDiameterUnit: units[0].value,
        borderWidthUnit: units[0].value,
        depthUnit: units[1].value,
    }
    // #endregion

    // #region STATE ========================================================================================
    const [result, setResult] = useState(undefined)
    const [rectangle, setRectangle] = useState(initRectangle)
    const [rectangleBorder, setRectangleBorder] = useState(initRectangleBorder)
    const [circle, setCircle] = useState(initCircle)
    const [circleBorder, setCircleBorder] = useState(initCircleBorder)
    // #endregion

    // #region ACTION HANDLERS ==============================================================================
    const resetFocus = () => {
        switch (shape) {
            case 'rectangle':
                let rectElm = document.querySelector('#rectLength input')
                setRectangle((prevState) => ({
                    ...prevState,
                    length: null,
                }))
                rectElm.focus()
                break

            case 'rectangleBorder':
                let rectBorderElm = document.querySelector(
                    '#rectBorderInnerLength input'
                )
                setRectangleBorder((prevState) => ({
                    ...prevState,
                    innerLength: null,
                }))
                rectBorderElm.focus()
                break

            case 'circle':
                let circleElm = document.querySelector('#circleDiameter input')
                setCircle((prevState) => ({
                    ...prevState,
                    diameter: null,
                }))
                circleElm.focus()
                break

            case 'circleBorder':
                let circleBorderElm = document.querySelector(
                    '#circleBorderInnerDiameter input'
                )
                setCircleBorder((prevState) => ({
                    ...prevState,
                    innerDiameter: null,
                }))
                circleBorderElm.focus()
                break
        }
    }

    const resetForm = () => {
        // console.log('[FormDisplay resetForm()]: Resetting state...')
        setRectangle(initRectangle)
        setRectangleBorder(initRectangleBorder)
        setCircle(initCircle)
        setCircleBorder(initCircleBorder)
        setResult(undefined)
        resetFocus()
    }

    const onCalculate = () => {
        switch (shape) {
            case 'rectangle':
                // Formula: (L' * W' * D") / 324
                let RectL =
                    rectangle.lengthUnit === 'inches'
                        ? parseFloat(rectangle.length / 12)
                        : parseFloat(rectangle.length)
                let RectW =
                    rectangle.widthUnit === 'inches'
                        ? parseFloat(rectangle.width / 12)
                        : parseFloat(rectangle.width)
                let RectD =
                    rectangle.depthUnit === 'feet'
                        ? parseFloat(rectangle.depth * 12)
                        : parseFloat(rectangle.depth)
                let RectResult = ((RectL * RectW * RectD) / 324).toFixed(3)

                setResult(RectResult)
                break

            case 'rectangleBorder':
                /*
                    Inner Area (ft2) = Length x Width
                    Total Area (ft2) = (Length + (2 x Border Width)) x (Width + (2 x Border Width))
                    Area (ft2) = Total Area - Inner Area
                    Volume (ft3) = Depth x Area
                    Volume in Cubic Yards (yd3) = Volume (ft3) / 27
                */
                let RectBorderInnerLength =
                    rectangleBorder.innerLengthUnit === 'inches'
                        ? parseFloat(rectangleBorder.innerLength / 12)
                        : rectangleBorder.innerLengthUnit === 'feet'
                        ? parseFloat(rectangleBorder.innerLength)
                        : console.error(
                              'Unknown rectangle border inner length unit'
                          )

                let RectBorderInnerWidth =
                    rectangleBorder.innerWidthUnit === 'inches'
                        ? parseFloat(rectangleBorder.innerWidth / 12)
                        : rectangleBorder.innerWidthUnit === 'feet'
                        ? parseFloat(rectangleBorder.innerWidth)
                        : console.error(
                              'Unknown rectangle border inner width unit'
                          )

                let RectBorderBorderWidth =
                    rectangleBorder.borderWidthUnit === 'inches'
                        ? parseFloat(rectangleBorder.borderWidth / 12)
                        : rectangleBorder.borderWidthUnit === 'feet'
                        ? parseFloat(rectangleBorder.borderWidth)
                        : console.error(
                              'Unknown rectangle border border width unit'
                          )

                let RectBorderDepth =
                    rectangleBorder.depthUnit === 'feet'
                        ? parseFloat(rectangleBorder.depth)
                        : rectangleBorder.depthUnit === 'inches'
                        ? parseFloat(rectangleBorder.depth / 12)
                        : console.error('Unknown rectangle border depth unit')

                let innerArea = RectBorderInnerLength * RectBorderInnerWidth
                // prettier-ignore
                let totalArea = (RectBorderInnerLength + (2 * RectBorderBorderWidth)) * (RectBorderInnerWidth + (2 * RectBorderBorderWidth))
                let area = totalArea - innerArea
                let volume = RectBorderDepth * area
                let RectBorderResult = (volume / 27).toFixed(3)

                setResult(RectBorderResult)
                break

            case 'circle':
                /* FORMULA:
                    Area (ft2) = Pi x (Diameter/2)2
                    Volume (ft3) = Depth x Area
                    Volume in Cubic Yards (yd3) = Volume (ft3) / 27
                */
                let circleDiameter =
                    circle.diameterUnit === 'inches'
                        ? parseFloat(circle.diameter / 12)
                        : circle.diameterUnit === 'feet'
                        ? parseFloat(circle.diameter)
                        : console.error('Unknown circle diameter unit')

                let circleDepth =
                    circle.depthUnit === 'inches'
                        ? parseFloat(circle.depth / 12)
                        : circle.depthUnit === 'feet'
                        ? parseFloat(circle.depth)
                        : console.error('Unknown circle depth unit')

                // Calculate circle
                let circleArea = Math.PI * Math.pow(circleDiameter / 2, 2)
                let circleVolume = circleDepth * circleArea
                let circleResult = (circleVolume / 27).toFixed(3)
                setResult(circleResult)
                break

            case 'circleBorder':
                /* FORMULA:
                    Outer Diameter = Inner Diameter + (2 x Border Width)
                    Outer Area (ft2) = Pi x (Outer Diameter/2)2
                    Inner Area (ft2) = Pi x (Inner Diameter/2)2
                    Area (ft2) = Outer Area - Inner Area
                    Volume (ft3) = Depth x Area
                    Volume in Cubic Yards (yd3) = Volume (ft3) / 27
                */
                let circleBorderInnerDiameter =
                    circleBorder.innerDiameterUnit === 'inches'
                        ? parseFloat(circleBorder.innerDiameter / 12)
                        : circleBorder.innerDiameterUnit === 'feet'
                        ? parseFloat(circleBorder.innerDiameter)
                        : console.error(
                              'Unknown circle border inner diameter unit'
                          )

                let circleBorderBorderWidth =
                    circleBorder.borderWidthUnit === 'inches'
                        ? parseFloat(circleBorder.borderWidth / 12)
                        : circleBorder.borderWidthUnit === 'feet'
                        ? parseFloat(circleBorder.borderWidth)
                        : console.error(
                              'Unknown circle border border width unit'
                          )

                let circleBorderDepth =
                    circleBorder.depthUnit === 'inches'
                        ? parseFloat(circleBorder.depth / 12)
                        : circleBorder.depthUnit === 'feet'
                        ? parseFloat(circleBorder.depth)
                        : console.error('Unknown circle border depth unit')

                // prettier-ignore
                let circleBorderOuterDiameter = circleBorderInnerDiameter + (2 * circleBorderBorderWidth)

                // Pi x (Outer Diameter/2)2
                // prettier-ignore
                let circleBorderOuterArea = Math.PI * Math.pow((circleBorderOuterDiameter / 2), 2)

                // Pi x (Inner Diameter/2)2
                // prettier-ignore
                let circleBorderInnerArea = Math.PI * Math.pow((circleBorderInnerDiameter / 2), 2)

                // Area (ft2) = Outer Area - Inner Area
                let circleBorderArea =
                    circleBorderOuterArea - circleBorderInnerArea

                // Volume (ft3) = Depth x Area
                let circleBorderVolume = circleBorderDepth * circleBorderArea

                // Result
                let circleBorderResult = (circleBorderVolume / 27).toFixed(3)

                setResult(circleBorderResult)
                break
        }
    }
    // #endregion

    // Reset forms on shape change
    useEffect(() => {
        // Reset form
        resetForm()
        resetFocus()
    }, [shape])

    return (
        <div>
            {shape && shape.toString() ? (
                <div>
                    {/* RECTANGLE FORM */}
                    {shape && shape.toString() === 'rectangle' && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                marginTop: '1em',
                            }}
                        >
                            {/* RECTANGLE - LENGTH */}
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '10px',
                                    textAlign: 'center',
                                }}
                            >
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="rectLength"
                                            value={rectangle.length}
                                            mode="decimal"
                                            minFractionDigits={2}
                                            className="p-inputtext-sm"
                                            onValueChange={(e) =>
                                                setRectangle((prevState) => ({
                                                    ...prevState,
                                                    length: e.value,
                                                }))
                                            }
                                        />
                                        <label htmlFor="rectLength">
                                            Length
                                        </label>
                                    </span>
                                </div>

                                {/* Rectangle Length - Unit */}
                                <div>
                                    <Dropdown
                                        value={rectangle.lengthUnit}
                                        onChange={(e) => {
                                            setRectangle((prevState) => ({
                                                ...prevState,
                                                lengthUnit: e.value,
                                            }))

                                            if (
                                                rectangle.lengthUnit === 'feet'
                                            ) {
                                                setRectangle((prevState) => ({
                                                    ...prevState,
                                                    length: parseFloat(
                                                        prevState.length * 12
                                                    ),
                                                }))
                                            } else {
                                                setRectangle((prevState) => ({
                                                    ...prevState,
                                                    length: parseFloat(
                                                        prevState.length / 12
                                                    ),
                                                }))
                                            }
                                        }}
                                        options={units}
                                        optionLabel="name"
                                        optionValue="value"
                                        placeholder="Unit"
                                        className="w-full md:w-7rem p-inputtext-sm"
                                        tabIndex={-1}
                                    />
                                </div>
                            </div>

                            {/* RECTANGLE - WIDTH */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="rectWidth"
                                            value={rectangle.width}
                                            mode="decimal"
                                            minFractionDigits={2}
                                            className="p-inputtext-sm"
                                            onValueChange={(e) =>
                                                setRectangle((prevState) => ({
                                                    ...prevState,
                                                    width: e.value,
                                                }))
                                            }
                                        />
                                        <label htmlFor="rectWidth">Width</label>
                                    </span>
                                </div>

                                {/* Rectangle Width - Unit */}
                                <div>
                                    <Dropdown
                                        value={rectangle.widthUnit}
                                        onChange={(e) => {
                                            setRectangle((prevState) => ({
                                                ...prevState,
                                                widthUnit: e.value,
                                            }))
                                            if (
                                                rectangle.widthUnit === 'feet'
                                            ) {
                                                setRectangle((prevState) => ({
                                                    ...prevState,
                                                    width: parseFloat(
                                                        prevState.width * 12
                                                    ),
                                                }))
                                            } else {
                                                setRectangle((prevState) => ({
                                                    ...prevState,
                                                    width: parseFloat(
                                                        prevState.width / 12
                                                    ),
                                                }))
                                            }
                                        }}
                                        options={units}
                                        optionLabel="name"
                                        optionValue="value"
                                        placeholder="Unit"
                                        className="w-full md:w-7rem p-inputtext-sm"
                                        tabIndex={-1}
                                    />
                                </div>
                            </div>

                            {/* RECTANGLE - DEPTH */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="rectDepth"
                                            value={rectangle.depth}
                                            mode="decimal"
                                            minFractionDigits={2}
                                            className="p-inputtext-sm"
                                            onValueChange={(e) =>
                                                setRectangle((prevState) => ({
                                                    ...prevState,
                                                    depth: e.value,
                                                }))
                                            }
                                        />
                                        <label htmlFor="rectDepth">Depth</label>
                                    </span>
                                </div>

                                {/* Rectangle Depth - Unit */}
                                <div>
                                    <Dropdown
                                        value={rectangle.depthUnit}
                                        onChange={(e) => {
                                            setRectangle((prevState) => ({
                                                ...prevState,
                                                depthUnit: e.value,
                                            }))

                                            if (
                                                rectangle.depthUnit === 'feet'
                                            ) {
                                                setRectangle((prevState) => ({
                                                    ...prevState,
                                                    depth: parseFloat(
                                                        prevState.depth * 12
                                                    ),
                                                }))
                                            } else {
                                                setRectangle((prevState) => ({
                                                    ...prevState,
                                                    depth: parseFloat(
                                                        prevState.depth / 12
                                                    ),
                                                }))
                                            }
                                        }}
                                        options={units}
                                        optionLabel="name"
                                        optionValue="value"
                                        placeholder="Unit"
                                        className="w-full md:w-7rem p-inputtext-sm"
                                        tabIndex={-1}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* RECTANGLE BORDER */}
                    {shape && shape.toString() === 'rectangleBorder' && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                marginTop: '1em',
                            }}
                        >
                            {/* RECTANGLE BORDER - INNER LENGTH */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="rectBorderInnerLength"
                                            value={rectangleBorder.innerLength}
                                            mode="decimal"
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setRectangleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        innerLength: e.value,
                                                    })
                                                )
                                            }
                                        />
                                        <label htmlFor="rectBorderInnerLength">
                                            Inner Length
                                        </label>
                                    </span>
                                </div>

                                {/* Rectangle Border Inner Length - Unit */}
                                <div>
                                    <Dropdown
                                        value={rectangleBorder.innerLengthUnit}
                                        onChange={(e) => {
                                            setRectangleBorder((prevState) => ({
                                                ...prevState,
                                                innerLengthUnit: e.value,
                                            }))

                                            if (
                                                rectangleBorder.innerLengthUnit ===
                                                'feet'
                                            ) {
                                                setRectangleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        innerLength: parseFloat(
                                                            prevState.innerLength *
                                                                12
                                                        ),
                                                    })
                                                )
                                            } else {
                                                setRectangleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        innerLength: parseFloat(
                                                            prevState.innerLength /
                                                                12
                                                        ),
                                                    })
                                                )
                                            }
                                        }}
                                        options={units}
                                        optionLabel="name"
                                        optionValue="value"
                                        placeholder="Unit"
                                        className="w-full md:w-7rem"
                                        tabIndex={-1}
                                    />
                                </div>
                            </div>

                            {/* RECTANGLE BORDER - INNER WIDTH */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="rectBorderInnerWidth"
                                            value={rectangleBorder.innerWidth}
                                            mode="decimal"
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setRectangleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        innerWidth: e.value,
                                                    })
                                                )
                                            }
                                        />
                                        <label htmlFor="rectBorderInnerWidth">
                                            Inner Width
                                        </label>
                                    </span>
                                </div>

                                {/* Rectangle Inner Width - Unit */}
                                <div>
                                    <Dropdown
                                        value={rectangleBorder.innerWidthUnit}
                                        onChange={(e) => {
                                            setRectangleBorder((prevState) => ({
                                                ...prevState,
                                                innerWidthUnit: e.value,
                                            }))

                                            if (
                                                rectangleBorder.innerWidthUnit ===
                                                'feet'
                                            ) {
                                                setRectangleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        innerWidth: parseFloat(
                                                            prevState.innerWidth *
                                                                12
                                                        ),
                                                    })
                                                )
                                            } else {
                                                setRectangleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        innerWidth: parseFloat(
                                                            prevState.innerWidth /
                                                                12
                                                        ),
                                                    })
                                                )
                                            }
                                        }}
                                        options={units}
                                        optionLabel="name"
                                        optionValue="value"
                                        placeholder="Unit"
                                        className="w-full md:w-7rem"
                                        tabIndex={-1}
                                    />
                                </div>
                            </div>

                            {/* RECTANGLE BORDER - BORDER WIDTH */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="rectBorderBorderWidth"
                                            value={rectangleBorder.borderWidth}
                                            mode="decimal"
                                            minFractionDigits={2}
                                            onValueChange={(e) => {
                                                setRectangleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        borderWidth: e.value,
                                                    })
                                                )
                                            }}
                                        />
                                        <label htmlFor="rectBorderBorderWidth">
                                            Border Width
                                        </label>
                                    </span>
                                </div>

                                {/* Rectangle Border Border Width - Unit */}
                                <div>
                                    <Dropdown
                                        value={rectangleBorder.borderWidthUnit}
                                        onChange={(e) => {
                                            setRectangleBorder((prevState) => ({
                                                ...prevState,
                                                borderWidthUnit: e.value,
                                            }))

                                            if (
                                                rectangleBorder.borderWidthUnit ===
                                                'feet'
                                            ) {
                                                setRectangleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        borderWidth: parseFloat(
                                                            prevState.borderWidth *
                                                                12
                                                        ),
                                                    })
                                                )
                                            } else {
                                                setRectangleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        borderWidth: parseFloat(
                                                            prevState.borderWidth /
                                                                12
                                                        ),
                                                    })
                                                )
                                            }
                                        }}
                                        options={units}
                                        optionLabel="name"
                                        optionValue="value"
                                        placeholder="Unit"
                                        className="w-full md:w-7rem"
                                        tabIndex={-1}
                                    />
                                </div>
                            </div>

                            {/* RECTANGLE BORDER - DEPTH */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="rectBorderDepth"
                                            value={rectangleBorder.depth}
                                            mode="decimal"
                                            minFractionDigits={2}
                                            onValueChange={(e) => {
                                                setRectangleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        depth: e.value,
                                                    })
                                                )
                                            }}
                                        />
                                        <label htmlFor="rectBorderDepth">
                                            Depth
                                        </label>
                                    </span>
                                </div>

                                {/* Rectangle Border Depth - Unit */}
                                <div>
                                    <Dropdown
                                        value={rectangleBorder.depthUnit}
                                        onChange={(e) => {
                                            // console.log(
                                            //     'Rectangle Border onChange'
                                            // )
                                            setRectangleBorder((prevState) => ({
                                                ...prevState,
                                                depthUnit: e.value,
                                            }))

                                            if (
                                                rectangleBorder.depthUnit ===
                                                'feet'
                                            ) {
                                                setRectangleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        depth: parseFloat(
                                                            prevState.depth * 12
                                                        ),
                                                    })
                                                )
                                            } else {
                                                setRectangleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        depth: parseFloat(
                                                            prevState.depth / 12
                                                        ),
                                                    })
                                                )
                                            }
                                        }}
                                        options={units}
                                        optionLabel="name"
                                        optionValue="value"
                                        placeholder="Unit"
                                        className="w-full md:w-7rem"
                                        tabIndex={-1}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CIRCLE */}
                    {shape && shape.toString() === 'circle' && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                marginTop: '1em',
                            }}
                        >
                            {/* CIRCLE - DIAMETER */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="circleDiameter"
                                            value={circle.diameter}
                                            mode="decimal"
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setCircle((prevState) => ({
                                                    ...prevState,
                                                    diameter: e.value,
                                                }))
                                            }
                                        />
                                        <label htmlFor="circleDiameter">
                                            Diameter
                                        </label>
                                    </span>
                                </div>

                                {/* Circle Diameter - Unit */}
                                <div>
                                    <Dropdown
                                        value={circle.diameterUnit}
                                        onChange={(e) => {
                                            setCircle((prevState) => ({
                                                ...prevState,
                                                diameterUnit: e.value,
                                            }))

                                            if (
                                                circle.diameterUnit === 'feet'
                                            ) {
                                                setCircle((prevState) => ({
                                                    ...prevState,
                                                    diameter: parseFloat(
                                                        prevState.diameter * 12
                                                    ),
                                                }))
                                            } else {
                                                setCircle((prevState) => ({
                                                    ...prevState,
                                                    diameter: parseFloat(
                                                        prevState.diameter / 12
                                                    ),
                                                }))
                                            }
                                        }}
                                        options={units}
                                        optionLabel="name"
                                        optionValue="value"
                                        placeholder="Unit"
                                        className="w-full md:w-7rem"
                                        tabIndex={-1}
                                    />
                                </div>
                            </div>

                            {/* CIRCLE - DEPTH */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="circleDepth"
                                            value={circle.depth}
                                            mode="decimal"
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setCircle((prevState) => ({
                                                    ...prevState,
                                                    depth: e.value,
                                                }))
                                            }
                                        />
                                        <label htmlFor="circleDepth">
                                            Depth
                                        </label>
                                    </span>
                                </div>

                                {/* Circle Depth - Unit */}
                                <div>
                                    <Dropdown
                                        value={circle.depthUnit}
                                        onChange={(e) => {
                                            setCircle((prevState) => ({
                                                ...prevState,
                                                depthUnit: e.value,
                                            }))

                                            if (circle.depthUnit === 'feet') {
                                                setCircle((prevState) => ({
                                                    ...prevState,
                                                    depth: parseFloat(
                                                        prevState.depth * 12
                                                    ),
                                                }))
                                            } else {
                                                setCircle((prevState) => ({
                                                    ...prevState,
                                                    depth: parseFloat(
                                                        prevState.depth / 12
                                                    ),
                                                }))
                                            }
                                        }}
                                        options={units}
                                        optionLabel="name"
                                        optionValue="value"
                                        placeholder="Unit"
                                        className="w-full md:w-7rem"
                                        tabIndex={-1}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CIRCLE BORDER */}
                    {shape && shape.toString() === 'circleBorder' && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                marginTop: '1em',
                            }}
                        >
                            {/* CIRCLE BORDER - INNER DIAMETER */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="circleBorderInnerDiameter"
                                            value={circleBorder.innerDiameter}
                                            mode="decimal"
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setCircleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        innerDiameter: e.value,
                                                    })
                                                )
                                            }
                                        />
                                        <label htmlFor="circleBorderInnerDiameter">
                                            Inner Diameter
                                        </label>
                                    </span>
                                </div>

                                {/* Circle Border Inner Diameter - Unit */}
                                <div>
                                    <Dropdown
                                        value={circleBorder.innerDiameterUnit}
                                        onChange={(e) => {
                                            setCircleBorder((prevState) => ({
                                                ...prevState,
                                                innerDiameterUnit: e.value,
                                            }))

                                            if (
                                                circleBorder.innerDiameterUnit ===
                                                'feet'
                                            ) {
                                                setCircleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        innerDiameter:
                                                            parseFloat(
                                                                prevState.innerDiameter *
                                                                    12
                                                            ),
                                                    })
                                                )
                                            } else {
                                                setCircleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        innerDiameter:
                                                            parseFloat(
                                                                prevState.innerDiameter /
                                                                    12
                                                            ),
                                                    })
                                                )
                                            }
                                        }}
                                        options={units}
                                        optionLabel="name"
                                        optionValue="value"
                                        placeholder="Unit"
                                        className="w-full md:w-7rem"
                                        tabIndex={-1}
                                    />
                                </div>
                            </div>

                            {/* CIRCLE BORDER - BORDER WIDTH */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="circeBorderBorderWidth"
                                            value={circleBorder.borderWidth}
                                            mode="decimal"
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setCircleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        borderWidth: e.value,
                                                    })
                                                )
                                            }
                                        />
                                        <label htmlFor="circeBorderBorderWidth">
                                            Border Width
                                        </label>
                                    </span>
                                </div>

                                {/* Circle Border Border Width - Unit */}
                                <div>
                                    <Dropdown
                                        value={circleBorder.borderWidthUnit}
                                        onChange={(e) => {
                                            setCircleBorder((prevState) => ({
                                                ...prevState,
                                                borderWidthUnit: e.value,
                                            }))

                                            if (
                                                circleBorder.borderWidthUnit ===
                                                'feet'
                                            ) {
                                                setCircleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        borderWidth: parseFloat(
                                                            prevState.borderWidth *
                                                                12
                                                        ),
                                                    })
                                                )
                                            } else {
                                                setCircleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        borderWidth: parseFloat(
                                                            prevState.borderWidth /
                                                                12
                                                        ),
                                                    })
                                                )
                                            }
                                        }}
                                        options={units}
                                        optionLabel="name"
                                        optionValue="value"
                                        placeholder="Unit"
                                        className="w-full md:w-7rem"
                                        tabIndex={-1}
                                    />
                                </div>
                            </div>

                            {/* CIRCLE BORDER - DEPTH */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="circleBorderDepth"
                                            value={circleBorder.depth}
                                            mode="decimal"
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setCircleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        depth: e.value,
                                                    })
                                                )
                                            }
                                        />
                                        <label htmlFor="circleBorderDepth">
                                            Depth
                                        </label>
                                    </span>
                                </div>

                                {/* Circle Border Depth - Unit */}
                                <div>
                                    <Dropdown
                                        value={circleBorder.depthUnit}
                                        onChange={(e) => {
                                            setCircleBorder((prevState) => ({
                                                ...prevState,
                                                depthUnit: e.value,
                                            }))

                                            if (
                                                circleBorder.depthUnit ===
                                                'feet'
                                            ) {
                                                setCircleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        depth: parseFloat(
                                                            prevState.depth * 12
                                                        ),
                                                    })
                                                )
                                            } else {
                                                setCircleBorder(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        depth: parseFloat(
                                                            prevState.depth / 12
                                                        ),
                                                    })
                                                )
                                            }
                                        }}
                                        options={units}
                                        optionLabel="name"
                                        optionValue="value"
                                        placeholder="Unit"
                                        className="w-full md:w-7rem"
                                        tabIndex={-1}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <>Choose shape</>
            )}

            <br />

            <Button
                label="Calculate"
                icon="pi pi-calculator"
                iconPos="left"
                onClick={onCalculate}
            />
            <Button
                label="Clear"
                icon="pi pi-trash"
                iconPos="left"
                onClick={resetForm}
                className="clearButton"
                style={{ marginLeft: '0.5em' }}
            />

            <br />

            {result && parseFloat(result) > 0 && (
                <div className={styles.resultWrapper}>
                    <strong>Result: </strong>
                    <span className={styles.result}>{result} cubic yards</span>
                </div>
            )}
        </div>
    )
}
