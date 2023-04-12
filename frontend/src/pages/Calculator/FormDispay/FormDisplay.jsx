import styles from './FormDisplay.module.scss'
import { useState, useEffect } from 'react'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { Image } from 'primereact/image'
import { toast } from 'react-toastify'
import skidsteerImage from '../../../assets/images/skidsteer.png'

export default function FormDisplay({ shape, onFormUpdated }) {
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

    // #region INITIAL STATE ================================================================================
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

    const initAnnulus = {
        outerDiameter: 0,
        innerDiameter: 0,
        depth: 0,
        outerDiameterUnit: units[0].value,
        innerDiameterUnit: units[0].value,
        depthUnit: units[1].value,
    }

    const initTriangle = {
        sideA: 0,
        sideB: 0,
        sideC: 0,
        depth: 0,
        sideAUnit: units[0].value,
        sideBUnit: units[0].value,
        sideCUnit: units[0].value,
        depthUnit: units[1].value,
    }

    const initTrapezoid = {
        sideA: 0,
        sideB: 0,
        height: 0,
        depth: 0,
        sideAUnit: units[0].value,
        sideBUnit: units[0].value,
        heightUnit: units[0].value,
        depthUnit: units[1].value,
    }
    // #endregion

    // #region STATE ========================================================================================
    const [result, setResult] = useState(undefined)
    const [rectangle, setRectangle] = useState(initRectangle)
    const [rectangleBorder, setRectangleBorder] = useState(initRectangleBorder)
    const [circle, setCircle] = useState(initCircle)
    const [circleBorder, setCircleBorder] = useState(initCircleBorder)
    const [annulus, setAnnulus] = useState(initAnnulus)
    const [triangle, setTriangle] = useState(initTriangle)
    const [trapezoid, setTrapezoid] = useState(initTrapezoid)
    const [shapeSelected, setShapeSelected] = useState(undefined)
    const [error, setError] = useState(undefined)
    const [dimensionErrors, setDimensionErrors] = useState([])
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

            case 'annulus':
                let annulusElm = document.querySelector(
                    '#annulusOuterDiameter input'
                )
                setAnnulus((prevState) => ({
                    ...prevState,
                    outerDiameter: null,
                }))
                annulusElm.focus()
                break

            case 'triangle':
                let triangleElm = document.querySelector('#triangleSideA input')
                setTriangle((prevState) => ({
                    ...prevState,
                    sideA: null,
                }))
                triangleElm.focus()
                break

            case 'trapezoid':
                let trapezoidElm = document.querySelector(
                    '#trapezoidSideA input'
                )
                setTrapezoid((prevState) => ({
                    ...prevState,
                    sideA: null,
                }))
                trapezoidElm.focus()
                break
        }
    }

    const resetErrorFields = () => {
        if (document) {
            // Rectangle
            if (document.getElementById('rectLength')) {
                document
                    .getElementById('rectLength')
                    .classList.remove('p-invalid')
                document
                    .getElementById('rectWidth')
                    .classList.remove('p-invalid')
                document
                    .getElementById('rectDepth')
                    .classList.remove('p-invalid')
            }

            // Rectangle Border
            if (document.getElementById('rectBorderInnerLength')) {
                document
                    .getElementById('rectBorderInnerLength')
                    .classList.remove('p-invalid')
                document
                    .getElementById('rectBorderInnerWidth')
                    .classList.remove('p-invalid')
                document
                    .getElementById('rectBorderBorderWidth')
                    .classList.remove('p-invalid')
                document
                    .getElementById('rectBorderDepth')
                    .classList.remove('p-invalid')
            }

            // Circle
            if (document.getElementById('circleDiameter')) {
                document
                    .getElementById('circleDiameter')
                    .classList.remove('p-invalid')
                document
                    .getElementById('circleDepth')
                    .classList.remove('p-invalid')
            }

            // Circle Border
            if (document.getElementById('circleBorderInnerDiameter')) {
                document
                    .getElementById('circleBorderInnerDiameter')
                    .classList.remove('p-invalid')
                document
                    .getElementById('circleBorderBorderWidth')
                    .classList.remove('p-invalid')
                document
                    .getElementById('circleBorderDepth')
                    .classList.remove('p-invalid')
            }

            // Annulus
            if (document.getElementById('annulusOuterDiameter')) {
                document
                    .getElementById('annulusOuterDiameter')
                    .classList.remove('p-invalid')
                document
                    .getElementById('annulusInnerDiameter')
                    .classList.remove('p-invalid')
                document
                    .getElementById('annulusDepth')
                    .classList.remove('p-invalid')
            }

            // Triangle
            if (document.getElementById('triangleSideA')) {
                document
                    .getElementById('triangleSideA')
                    .classList.remove('p-invalid')
                document
                    .getElementById('triangleSideB')
                    .classList.remove('p-invalid')
                document
                    .getElementById('triangleSideC')
                    .classList.remove('p-invalid')
                document
                    .getElementById('triangleDepth')
                    .classList.remove('p-invalid')
            }

            // Trapezoid
            if (document.getElementById('trapezoidSideA')) {
                document
                    .getElementById('trapezoidSideA')
                    .classList.remove('p-invalid')
                document
                    .getElementById('trapezoidSideB')
                    .classList.remove('p-invalid')
                document
                    .getElementById('trapezoidDepth')
                    .classList.remove('p-invalid')
            }
        }
    }

    const resetForm = () => {
        // console.log('[FormDisplay resetForm()]: Resetting state...')

        setRectangle(initRectangle)
        setRectangleBorder(initRectangleBorder)
        setCircle(initCircle)
        setCircleBorder(initCircleBorder)
        setAnnulus(initAnnulus)
        setTriangle(initTriangle)
        setTrapezoid(initTrapezoid)
        setResult(undefined)
        setError(undefined)
        setDimensionErrors([])
        resetErrorFields()
        resetFocus()
    }

    const checkResult = (result) => {
        if (dimensionErrors.length <= 0) {
            return isNaN(parseFloat(result)) || parseFloat(result) <= 0
                ? setError('Result invalid or too small, check inputs')
                : setError(undefined)
        }
    }

    const onCalculate = () => {
        setDimensionErrors([])
        setError(undefined)

        switch (shape) {
            case 'rectangle':
                // Check form
                if (!rectangle.length || rectangle.length < 0) {
                    document
                        .getElementById('rectLength')
                        .classList.add('p-invalid')

                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Length must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('rectLength')
                        .classList.remove('p-invalid')
                }

                if (!rectangle.width || rectangle.width < 0) {
                    document
                        .getElementById('rectWidth')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Width must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('rectWidth')
                        .classList.remove('p-invalid')
                }

                if (!rectangle.depth || rectangle.depth < 0) {
                    document
                        .getElementById('rectDepth')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Depth must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('rectDepth')
                        .classList.remove('p-invalid')
                }

                // Formula: (L' * W' * D") / 324
                let rectangleLength =
                    rectangle.lengthUnit === 'inches'
                        ? parseFloat(rectangle.length / 12)
                        : parseFloat(rectangle.length)
                let rectangleWidth =
                    rectangle.widthUnit === 'inches'
                        ? parseFloat(rectangle.width / 12)
                        : parseFloat(rectangle.width)
                let rectangleDepth =
                    rectangle.depthUnit === 'feet'
                        ? parseFloat(rectangle.depth * 12)
                        : parseFloat(rectangle.depth)

                // prettier-ignore
                let RectSubResult = ((rectangleLength * rectangleWidth * rectangleDepth) / 324)
                let RectResult = RectSubResult.toFixed(2)

                checkResult(RectResult)
                setResult(RectResult)
                break

            case 'rectangleBorder':
                // Check form
                if (
                    !rectangleBorder.innerLength ||
                    rectangleBorder.innerLength <= 0
                ) {
                    document
                        .getElementById('rectBorderInnerLength')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Inner length must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('rectBorderInnerLength')
                        .classList.remove('p-invalid')
                }

                if (
                    !rectangleBorder.innerWidth ||
                    rectangleBorder.innerWidth <= 0
                ) {
                    document
                        .getElementById('rectBorderInnerWidth')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Inner width must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('rectBorderInnerWidth')
                        .classList.remove('p-invalid')
                }

                if (
                    !rectangleBorder.borderWidth ||
                    rectangleBorder.borderWidth <= 0
                ) {
                    document
                        .getElementById('rectBorderBorderWidth')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Border width must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('rectBorderBorderWidth')
                        .classList.remove('p-invalid')
                }

                if (!rectangleBorder.depth || rectangleBorder.depth <= 0) {
                    document
                        .getElementById('rectBorderDepth')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Depth must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('rectBorderDepth')
                        .classList.remove('p-invalid')
                }

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

                /*
                    Inner Area (ft2) = Length x Width
                    Total Area (ft2) = (Length + (2 x Border Width)) x (Width + (2 x Border Width))
                    Area (ft2) = Total Area - Inner Area
                    Volume (ft3) = Depth x Area
                    Volume in Cubic Yards (yd3) = Volume (ft3) / 27
                */

                let innerArea = RectBorderInnerLength * RectBorderInnerWidth
                // prettier-ignore
                let totalArea = (RectBorderInnerLength + (2 * RectBorderBorderWidth)) * (RectBorderInnerWidth + (2 * RectBorderBorderWidth))
                let area = totalArea - innerArea
                let volume = RectBorderDepth * area
                let RectBorderResult = (volume / 27).toFixed(2)

                checkResult(RectBorderResult)
                setResult(RectBorderResult)
                break

            case 'circle':
                // Check form
                if (!circle.diameter || circle.diameter <= 0) {
                    document
                        .getElementById('circleDiameter')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Diameter must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('circleDiameter')
                        .classList.remove('p-invalid')
                }

                if (!circle.depth || circle.depth <= 0) {
                    document
                        .getElementById('circleDepth')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Depth must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('circleDepth')
                        .classList.remove('p-invalid')
                }

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

                /* FORMULA:
                    Area (ft2) = Pi x (Diameter/2)2
                    Volume (ft3) = Depth x Area
                    Volume in Cubic Yards (yd3) = Volume (ft3) / 27
                */

                // Calculate circle
                let circleArea = Math.PI * Math.pow(circleDiameter / 2, 2)
                let circleVolume = circleDepth * circleArea
                let circleResult = (circleVolume / 27).toFixed(2)

                checkResult(circleResult)
                setResult(circleResult)
                break

            case 'circleBorder':
                // Check form
                if (
                    !circleBorder.innerDiameter ||
                    circleBorder.innerDiameter <= 0
                ) {
                    document
                        .getElementById('circleBorderInnerDiameter')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Inner diameter must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('circleBorderInnerDiameter')
                        .classList.remove('p-invalid')
                }

                if (
                    !circleBorder.borderWidth ||
                    circleBorder.borderWidth <= 0
                ) {
                    document
                        .getElementById('circleBorderBorderWidth')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Border width must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('circleBorderBorderWidth')
                        .classList.remove('p-invalid')
                }

                if (!circleBorder.depth || circleBorder.depth <= 0) {
                    document
                        .getElementById('circleBorderDepth')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Depth must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('circleBorderDepth')
                        .classList.remove('p-invalid')
                }

                // Calculate
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

                /* FORMULA:
                    Outer Diameter = Inner Diameter + (2 x Border Width)
                    Outer Area (ft2) = Pi x (Outer Diameter/2)2
                    Inner Area (ft2) = Pi x (Inner Diameter/2)2
                    Area (ft2) = Outer Area - Inner Area
                    Volume (ft3) = Depth x Area
                    Volume in Cubic Yards (yd3) = Volume (ft3) / 27
                */

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
                let circleBorderResult = (circleBorderVolume / 27).toFixed(2)

                checkResult(circleBorderResult)
                setResult(circleBorderResult)
                break

            case 'annulus':
                // Check form
                if (!annulus.outerDiameter || annulus.outerDiameter <= 0) {
                    document
                        .getElementById('annulusOuterDiameter')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Outer diameter must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('annulusOuterDiameter')
                        .classList.remove('p-invalid')
                }

                if (!annulus.innerDiameter || annulus.innerDiameter <= 0) {
                    document
                        .getElementById('annulusInnerDiameter')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Inner diameter must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('annulusInnerDiameter')
                        .classList.remove('p-invalid')
                }

                if (!annulus.depth || annulus.depth <= 0) {
                    document
                        .getElementById('annulusDepth')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Inner diameter must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('annulusDepth')
                        .classList.remove('p-invalid')
                }

                let annulusOuterDiameter =
                    annulus.outerDiameterUnit === 'inches'
                        ? parseFloat(annulus.outerDiameter / 12)
                        : annulus.outerDiameterUnit === 'feet'
                        ? parseFloat(annulus.outerDiameter)
                        : console.error('Unknown annulus outer diameter unit')

                let annulusInnerDiameter =
                    annulus.innerDiameterUnit === 'inches'
                        ? parseFloat(annulus.innerDiameter / 12)
                        : annulus.innerDiameterUnit === 'feet'
                        ? parseFloat(annulus.innerDiameter)
                        : console.error('Unknown annulus inner diameter unit')

                let annulusDepth =
                    annulus.depthUnit === 'inches'
                        ? parseFloat(annulus.depth / 12)
                        : annulus.depthUnit === 'feet'
                        ? parseFloat(annulus.depth)
                        : console.error('Unknown annulus depth unit')

                /*
                    Outer Area (ft2) = Pi x (Outer Diameter/2)2
                    Inner Area (ft2) = Pi x (Inner Diameter/2)2
                    Area (ft2) = Outer Area - Inner Area
                    Volume (ft3) = Depth x Area
                    Volume in Cubic Yards (yd3) = Volume (ft3) / 27
                */

                // Calculate
                // prettier-ignore
                let annulusOuterArea = Math.PI * Math.pow((annulusOuterDiameter/2), 2)
                // prettier-ignore
                let annulusInnerArea = Math.PI * Math.pow((annulusInnerDiameter/2), 2)
                let annulusArea = annulusOuterArea - annulusInnerArea
                let annulusVolume = annulusDepth * annulusArea
                let annulusResult = (annulusVolume / 27).toFixed(2)

                // console.log('Annulus Result: ')
                // console.log(annulusResult)

                if (annulusOuterDiameter < annulusInnerDiameter) {
                    return setError(
                        'Outer diameter cannot be smaller than inner diameter'
                    )
                } else {
                    checkResult(annulusResult)
                }

                checkResult(annulusResult)
                setResult(annulusResult)
                break

            case 'triangle':
                // Check form
                if (!triangle.sideA || triangle.sideA <= 0) {
                    document
                        .getElementById('triangleSideA')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Side A must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('triangleSideA')
                        .classList.remove('p-invalid')
                }

                if (!triangle.sideB || triangle.sideB <= 0) {
                    document
                        .getElementById('triangleSideB')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Side B must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('triangleSideB')
                        .classList.remove('p-invalid')
                }

                if (!triangle.sideC || triangle.sideC <= 0) {
                    document
                        .getElementById('triangleSideC')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Side C must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('triangleSideC')
                        .classList.remove('p-invalid')
                }

                if (!triangle.depth || triangle.depth <= 0) {
                    document
                        .getElementById('triangleDepth')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Depth must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('triangleDepth')
                        .classList.remove('p-invalid')
                }

                let triangleSideA =
                    triangle.sideAUnit === 'inches'
                        ? parseFloat(triangle.sideA / 12)
                        : triangle.sideAUnit === 'feet'
                        ? parseFloat(triangle.sideA)
                        : console.error('Unknown triangle side A unit')

                let triangleSideB =
                    triangle.sideBUnit === 'inches'
                        ? parseFloat(triangle.sideB / 12)
                        : triangle.sideBUnit === 'feet'
                        ? parseFloat(triangle.sideB)
                        : console.error('Unknown triangle side B unit')

                let triangleSideC =
                    triangle.sideCUnit === 'inches'
                        ? parseFloat(triangle.sideC / 12)
                        : triangle.sideCUnit === 'feet'
                        ? parseFloat(triangle.sideC)
                        : console.error('Unknown triangle side C unit')

                let triangleDepth =
                    triangle.depthUnit === 'inches'
                        ? parseFloat(triangle.depth / 12)
                        : triangle.depthUnit === 'feet'
                        ? parseFloat(triangle.depth)
                        : console.error('Unknown triangle depth unit')

                /*
                    Area (ft2) = (1/4) x square root[ (a+b+c) x (b+c-a) x (c+a-b) x (a+b-c) ]
                    Volume (ft3) = Depth x Area
                    Volume in Cubic Yards (yd3) = Volume (ft3) / 27
                */

                // prettier-ignore
                const triangleArea = 0.25 * Math.sqrt((triangleSideA + triangleSideB + triangleSideC) * (triangleSideB + triangleSideC - triangleSideA) * (triangleSideC + triangleSideA - triangleSideB) * (triangleSideA + triangleSideB - triangleSideC))
                const triangleVolume = triangleDepth * triangleArea
                const triangleResult = (triangleVolume / 27).toFixed(2)

                // if (isNaN(triangleResult) || triangleResult <= 0) {
                //     return setError('Invalid dimensions')
                // }
                checkResult(triangleResult)

                setResult(triangleResult)
                break

            case 'trapezoid':
                // Check form
                if (!trapezoid.sideA || trapezoid.sideA <= 0) {
                    document
                        .getElementById('trapezoidSideA')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Side A must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('trapezoidSideA')
                        .classList.remove('p-invalid')
                }

                if (!trapezoid.sideB || trapezoid.sideB <= 0) {
                    document
                        .getElementById('trapezoidSideB')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Side B must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('trapezoidSideB')
                        .classList.remove('p-invalid')
                }

                if (!trapezoid.height || trapezoid.height <= 0) {
                    document
                        .getElementById('trapezoidHeight')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Height must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('trapezoidHeight')
                        .classList.remove('p-invalid')
                }

                if (!trapezoid.depth || trapezoid.depth <= 0) {
                    document
                        .getElementById('trapezoidDepth')
                        .classList.add('p-invalid')
                    setDimensionErrors((prevState) => [
                        ...prevState,
                        'Depth must be greater than 0',
                    ])
                } else {
                    document
                        .getElementById('trapezoidDepth')
                        .classList.remove('p-invalid')
                }

                let trapezoidSideA =
                    trapezoid.sideAUnit === 'inches'
                        ? parseFloat(trapezoid.sideA / 12)
                        : trapezoid.sideAUnit === 'feet'
                        ? parseFloat(trapezoid.sideA)
                        : console.error('Unknown trapezoid side A unit')

                let trapezoidSideB =
                    trapezoid.sideBUnit === 'inches'
                        ? parseFloat(trapezoid.sideB / 12)
                        : trapezoid.sideBUnit === 'feet'
                        ? parseFloat(trapezoid.sideB)
                        : console.error('Unknown trapezoid side B unit')

                let trapezoidHeight =
                    trapezoid.heightUnit === 'inches'
                        ? parseFloat(trapezoid.height / 12)
                        : trapezoid.heightUnit === 'feet'
                        ? parseFloat(trapezoid.height)
                        : console.error('Unknown trapezoid height unit')

                let trapezoidDepth =
                    trapezoid.depthUnit === 'inches'
                        ? parseFloat(trapezoid.depth / 12)
                        : trapezoid.depthUnit === 'feet'
                        ? parseFloat(trapezoid.depth)
                        : console.error('Unknown trapezoid depth unit')

                /*
                    Area (ft2) = ((a + b) / 2 )h
                    Volume (ft3) = Depth x Area
                    Volume in Cubic Yards (yd3) = Volume (ft3) / 27
                */

                // prettier-ignore
                const trapezoidArea = ((trapezoidSideA + trapezoidSideB) / 2 ) * trapezoidHeight
                const trapezoidVolume = trapezoidDepth * trapezoidArea
                const trapezoidResult = (trapezoidVolume / 27).toFixed(2)

                checkResult(trapezoidResult)
                setResult(trapezoidResult)
                break
        }
    }

    const figureBuckets = (result) => {
        console.log('result: ' + result)
        let pResult = parseFloat(result)
        if (pResult >= 0 && pResult <= 0.15) {
            return 'Less than 1/4 yd (but 1/4 yd is the smallest we load)'
        } else if (pResult >= 0.16 && pResult <= 0.3) {
            return 'About 1/4 yd or less (1/4 yd is the smallest we load)'
        } else if (pResult >= 0.31 && pResult <= 0.6) {
            return 'About 1/2 yd (1 bucket)'
        } else if (pResult >= 0.61 && pResult <= 0.8) {
            return 'About 3/4 yd (1 and a half buckets)'
        } else if (pResult >= 0.81 && pResult <= 1) {
            return 'About 1 yd (2 buckets)'
        } else {
            let buckets = Math.ceil(pResult / 0.5)
            return `About ${buckets} buckets (${buckets * 0.5} yds)`
        }
    }

    const shallowEqual = (object1, object2) => {
        const keys1 = Object.keys(object1)
        const keys2 = Object.keys(object2)
        if (keys1.length !== keys2.length) {
            return false
        }
        for (let key of keys1) {
            if (object1[key] !== object2[key]) {
                return false
            }
        }
        return true
    }

    // #endregion

    // Reset forms on shape change
    useEffect(() => {
        // Reset form
        resetForm()
        resetFocus()
        setError(undefined)
    }, [shape])

    // #region UseEffect Shape Changes ======================================================================

    // Rectangle changed
    useEffect(() => {
        setShapeSelected('rectangle')
        if (!shallowEqual(rectangle, initRectangle)) {
            onFormUpdated(rectangle)
        }
    }, [rectangle])

    // Rectangle Border changed
    useEffect(() => {
        setShapeSelected('rectangleBorder')
        if (!shallowEqual(rectangleBorder, initRectangleBorder)) {
            onFormUpdated(rectangleBorder)
        }
    }, [rectangleBorder])

    // Circle changed
    useEffect(() => {
        setShapeSelected('circle')
        if (!shallowEqual(circle, initCircle)) {
            onFormUpdated(circle)
        }
    }, [circle])

    // Circle Border changed
    useEffect(() => {
        setShapeSelected('circleBorder')
        if (!shallowEqual(circleBorder, initCircleBorder)) {
            onFormUpdated(circleBorder)
        }
    }, [circleBorder])

    // Annulus changed
    useEffect(() => {
        setShapeSelected('annulus')
        if (!shallowEqual(annulus, initAnnulus)) {
            onFormUpdated(annulus)
        }
    }, [annulus])

    // Triangle changed
    useEffect(() => {
        setShapeSelected('triangle')
        if (!shallowEqual(triangle, initTriangle)) {
            onFormUpdated(triangle)
        }
    }, [triangle])

    // Trapezoid changed
    useEffect(() => {
        setShapeSelected('trapezoid')
        if (!shallowEqual(trapezoid, initTrapezoid)) {
            onFormUpdated(trapezoid)
        }
    }, [trapezoid])

    // #endregion

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
                                            min={0}
                                            minFractionDigits={2}
                                            maxFractionDigits={5}
                                            className="p-inputtext-sm"
                                            onValueChange={(e) => {
                                                setRectangle((prevState) => ({
                                                    ...prevState,
                                                    length: e.value,
                                                }))
                                            }}
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
                                            min={0}
                                            minFractionDigits={2}
                                            maxFractionDigits={5}
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
                                            min={0}
                                            minFractionDigits={2}
                                            maxFractionDigits={5}
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
                                            min={0}
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
                                            min={0}
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
                                            min={0}
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
                                            min={0}
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
                                            min={0}
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
                                            min={0}
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
                                            min={0}
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
                                            id="circleBorderBorderWidth"
                                            value={circleBorder.borderWidth}
                                            mode="decimal"
                                            min={0}
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
                                        <label htmlFor="circleBorderBorderWidth">
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
                                            min={0}
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

                    {/* ANNULUS */}
                    {shape && shape.toString() === 'annulus' && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                marginTop: '1em',
                            }}
                        >
                            {/* ANNULUS - OUTER DIAMETER */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="annulusOuterDiameter"
                                            value={annulus.outerDiameter}
                                            mode="decimal"
                                            min={0}
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setAnnulus((prevState) => ({
                                                    ...prevState,
                                                    outerDiameter: e.value,
                                                }))
                                            }
                                        />
                                        <label htmlFor="annulusOuterDiameter">
                                            Outer Diameter
                                        </label>
                                    </span>
                                </div>

                                {/* Annulus Outer Diameter - Unit */}
                                <div>
                                    <Dropdown
                                        value={annulus.outerDiameterUnit}
                                        onChange={(e) => {
                                            setAnnulus((prevState) => ({
                                                ...prevState,
                                                outerDiameterUnit: e.value,
                                            }))

                                            if (
                                                annulus.outerDiameterUnit ===
                                                'feet'
                                            ) {
                                                setAnnulus((prevState) => ({
                                                    ...prevState,
                                                    outerDiameter: parseFloat(
                                                        prevState.outerDiameter *
                                                            12
                                                    ),
                                                }))
                                            } else {
                                                setAnnulus((prevState) => ({
                                                    ...prevState,
                                                    outerDiameter: parseFloat(
                                                        prevState.outerDiameter /
                                                            12
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

                            {/* ANNULUS - INNER DIAMETER */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="annulusInnerDiameter"
                                            value={annulus.innerDiameter}
                                            mode="decimal"
                                            min={0}
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setAnnulus((prevState) => ({
                                                    ...prevState,
                                                    innerDiameter: e.value,
                                                }))
                                            }
                                        />
                                        <label htmlFor="annulusInnerDiameter">
                                            Inner Diameter
                                        </label>
                                    </span>
                                </div>

                                {/* Annulus Inner Diameter - Unit */}
                                <div>
                                    <Dropdown
                                        value={annulus.innerDiameterUnit}
                                        onChange={(e) => {
                                            setAnnulus((prevState) => ({
                                                ...prevState,
                                                innerDiameterUnit: e.value,
                                            }))

                                            if (
                                                annulus.innerDiameterUnit ===
                                                'feet'
                                            ) {
                                                setAnnulus((prevState) => ({
                                                    ...prevState,
                                                    innerDiameter: parseFloat(
                                                        prevState.innerDiameter *
                                                            12
                                                    ),
                                                }))
                                            } else {
                                                setAnnulus((prevState) => ({
                                                    ...prevState,
                                                    innerDiameter: parseFloat(
                                                        prevState.innerDiameter /
                                                            12
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

                            {/* ANNULUS - DEPTH */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="annulusDepth"
                                            value={annulus.depth}
                                            mode="decimal"
                                            min={0}
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setAnnulus((prevState) => ({
                                                    ...prevState,
                                                    depth: e.value,
                                                }))
                                            }
                                        />
                                        <label htmlFor="annulusDepth">
                                            Depth
                                        </label>
                                    </span>
                                </div>

                                {/* Annulus Depth - Unit */}
                                <div>
                                    <Dropdown
                                        value={annulus.depthUnit}
                                        onChange={(e) => {
                                            setAnnulus((prevState) => ({
                                                ...prevState,
                                                depthUnit: e.value,
                                            }))

                                            if (annulus.depthUnit === 'feet') {
                                                setAnnulus((prevState) => ({
                                                    ...prevState,
                                                    depth: parseFloat(
                                                        prevState.depth * 12
                                                    ),
                                                }))
                                            } else {
                                                setAnnulus((prevState) => ({
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

                    {/* TRIANGLE */}
                    {shape && shape.toString() === 'triangle' && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                marginTop: '1em',
                            }}
                        >
                            {/* TRIANGLE - SIDE A */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="triangleSideA"
                                            value={triangle.sideA}
                                            mode="decimal"
                                            min={0}
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setTriangle((prevState) => ({
                                                    ...prevState,
                                                    sideA: e.value,
                                                }))
                                            }
                                        />
                                        <label htmlFor="triangleSideA">
                                            Side A
                                        </label>
                                    </span>
                                </div>

                                {/* Triangle Side A - Unit */}
                                <div>
                                    <Dropdown
                                        value={triangle.sideAUnit}
                                        onChange={(e) => {
                                            setTriangle((prevState) => ({
                                                ...prevState,
                                                sideAUnit: e.value,
                                            }))

                                            if (triangle.sideAUnit === 'feet') {
                                                setTriangle((prevState) => ({
                                                    ...prevState,
                                                    sideA: parseFloat(
                                                        prevState.sideA * 12
                                                    ),
                                                }))
                                            } else {
                                                setTriangle((prevState) => ({
                                                    ...prevState,
                                                    sideA: parseFloat(
                                                        prevState.sideA / 12
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

                            {/* TRIANGLE - SIDE B */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="triangleSideB"
                                            value={triangle.sideB}
                                            mode="decimal"
                                            min={0}
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setTriangle((prevState) => ({
                                                    ...prevState,
                                                    sideB: e.value,
                                                }))
                                            }
                                        />
                                        <label htmlFor="triangleSideB">
                                            Side B
                                        </label>
                                    </span>
                                </div>

                                {/* Triangle Side B - Unit */}
                                <div>
                                    <Dropdown
                                        value={triangle.sideBUnit}
                                        onChange={(e) => {
                                            setTriangle((prevState) => ({
                                                ...prevState,
                                                sideBUnit: e.value,
                                            }))

                                            if (triangle.sideBUnit === 'feet') {
                                                setTriangle((prevState) => ({
                                                    ...prevState,
                                                    sideB: parseFloat(
                                                        prevState.sideB * 12
                                                    ),
                                                }))
                                            } else {
                                                setTriangle((prevState) => ({
                                                    ...prevState,
                                                    sideB: parseFloat(
                                                        prevState.sideB / 12
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

                            {/* TRIANGLE - SIDE C */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="triangleSideC"
                                            value={triangle.sideC}
                                            mode="decimal"
                                            min={0}
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setTriangle((prevState) => ({
                                                    ...prevState,
                                                    sideC: e.value,
                                                }))
                                            }
                                        />
                                        <label htmlFor="triangleSideC">
                                            Side C
                                        </label>
                                    </span>
                                </div>

                                {/* Triangle Side C - Unit */}
                                <div>
                                    <Dropdown
                                        value={triangle.sideCUnit}
                                        onChange={(e) => {
                                            setTriangle((prevState) => ({
                                                ...prevState,
                                                sideCUnit: e.value,
                                            }))

                                            if (triangle.sideCUnit === 'feet') {
                                                setTriangle((prevState) => ({
                                                    ...prevState,
                                                    sideC: parseFloat(
                                                        prevState.sideC * 12
                                                    ),
                                                }))
                                            } else {
                                                setTriangle((prevState) => ({
                                                    ...prevState,
                                                    sideC: parseFloat(
                                                        prevState.sideC / 12
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

                            {/* TRIANGLE - DEPTH */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="triangleDepth"
                                            value={triangle.depth}
                                            mode="decimal"
                                            min={0}
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setTriangle((prevState) => ({
                                                    ...prevState,
                                                    depth: e.value,
                                                }))
                                            }
                                        />
                                        <label htmlFor="triangleDepth">
                                            Depth
                                        </label>
                                    </span>
                                </div>

                                {/* Triangle Depth - Unit */}
                                <div>
                                    <Dropdown
                                        value={triangle.depthUnit}
                                        onChange={(e) => {
                                            setTriangle((prevState) => ({
                                                ...prevState,
                                                depthUnit: e.value,
                                            }))

                                            if (triangle.depthUnit === 'feet') {
                                                setTriangle((prevState) => ({
                                                    ...prevState,
                                                    depth: parseFloat(
                                                        prevState.depth * 12
                                                    ),
                                                }))
                                            } else {
                                                setTriangle((prevState) => ({
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

                    {/* TRAPEZOID */}
                    {shape && shape.toString() === 'trapezoid' && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                marginTop: '1em',
                            }}
                        >
                            {/* TRAPEZOID - SIDE A */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="trapezoidSideA"
                                            value={trapezoid.sideA}
                                            mode="decimal"
                                            min={0}
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setTrapezoid((prevState) => ({
                                                    ...prevState,
                                                    sideA: e.value,
                                                }))
                                            }
                                        />
                                        <label htmlFor="trapezoidSideA">
                                            Side A
                                        </label>
                                    </span>
                                </div>

                                {/* Trapezoid Side A - Unit */}
                                <div>
                                    <Dropdown
                                        value={trapezoid.sideAUnit}
                                        onChange={(e) => {
                                            setTrapezoid((prevState) => ({
                                                ...prevState,
                                                sideAUnit: e.value,
                                            }))

                                            if (
                                                trapezoid.sideAUnit === 'feet'
                                            ) {
                                                setTrapezoid((prevState) => ({
                                                    ...prevState,
                                                    sideA: parseFloat(
                                                        prevState.sideA * 12
                                                    ),
                                                }))
                                            } else {
                                                setTrapezoid((prevState) => ({
                                                    ...prevState,
                                                    sideA: parseFloat(
                                                        prevState.sideA / 12
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

                            {/* TRAPEZOID - SIDE B */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="trapezoidSideB"
                                            value={trapezoid.sideB}
                                            mode="decimal"
                                            min={0}
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setTrapezoid((prevState) => ({
                                                    ...prevState,
                                                    sideB: e.value,
                                                }))
                                            }
                                        />
                                        <label htmlFor="trapezoidSideB">
                                            Side B
                                        </label>
                                    </span>
                                </div>

                                {/* Trapezoid Side B - Unit */}
                                <div>
                                    <Dropdown
                                        value={trapezoid.sideBUnit}
                                        onChange={(e) => {
                                            setTrapezoid((prevState) => ({
                                                ...prevState,
                                                sideBUnit: e.value,
                                            }))

                                            if (
                                                trapezoid.sideBUnit === 'feet'
                                            ) {
                                                setTrapezoid((prevState) => ({
                                                    ...prevState,
                                                    sideB: parseFloat(
                                                        prevState.sideB * 12
                                                    ),
                                                }))
                                            } else {
                                                setTrapezoid((prevState) => ({
                                                    ...prevState,
                                                    sideB: parseFloat(
                                                        prevState.sideB / 12
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

                            {/* TRAPEZOID - HEIGHT */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="trapezoidHeight"
                                            value={trapezoid.height}
                                            mode="decimal"
                                            min={0}
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setTrapezoid((prevState) => ({
                                                    ...prevState,
                                                    height: e.value,
                                                }))
                                            }
                                        />
                                        <label htmlFor="trapezoidHeight">
                                            Height
                                        </label>
                                    </span>
                                </div>

                                {/* Trapezoid Height - Unit */}
                                <div>
                                    <Dropdown
                                        value={trapezoid.heightUnit}
                                        onChange={(e) => {
                                            setTrapezoid((prevState) => ({
                                                ...prevState,
                                                heightUnit: e.value,
                                            }))

                                            if (
                                                trapezoid.heightUnit === 'feet'
                                            ) {
                                                setTrapezoid((prevState) => ({
                                                    ...prevState,
                                                    height: parseFloat(
                                                        prevState.height * 12
                                                    ),
                                                }))
                                            } else {
                                                setTrapezoid((prevState) => ({
                                                    ...prevState,
                                                    height: parseFloat(
                                                        prevState.height / 12
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

                            {/* TRAPEZOID - DEPTH */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="trapezoidDepth"
                                            value={trapezoid.depth}
                                            mode="decimal"
                                            min={0}
                                            minFractionDigits={2}
                                            onValueChange={(e) =>
                                                setTrapezoid((prevState) => ({
                                                    ...prevState,
                                                    depth: e.value,
                                                }))
                                            }
                                        />
                                        <label htmlFor="trapezoidDepth">
                                            Depth
                                        </label>
                                    </span>
                                </div>

                                {/* Trapezoid Depth - Unit */}
                                <div>
                                    <Dropdown
                                        value={trapezoid.depthUnit}
                                        onChange={(e) => {
                                            setTrapezoid((prevState) => ({
                                                ...prevState,
                                                depthUnit: e.value,
                                            }))

                                            if (
                                                trapezoid.depthUnit === 'feet'
                                            ) {
                                                setTrapezoid((prevState) => ({
                                                    ...prevState,
                                                    depth: parseFloat(
                                                        prevState.depth * 12
                                                    ),
                                                }))
                                            } else {
                                                setTrapezoid((prevState) => ({
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
                </div>
            ) : (
                <div style={{ fontStyle: 'italic' }}>Choose a shape above</div>
            )}

            <br />

            {shape && (
                <div>
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
                </div>
            )}

            <br />
            <br />

            {result && parseFloat(result) > 0 && (
                <div className={styles.resultWrapper}>
                    <strong>Result: </strong>
                    <span className={styles.result}>
                        about {result} cubic yards
                    </span>
                </div>
            )}

            <div style={{ marginTop: '1em' }}>
                {dimensionErrors.map((err) => (
                    <div style={{ marginBottom: '0.5em' }}>
                        <Message key={err} severity="error" text={err} />
                    </div>
                ))}
            </div>

            {dimensionErrors.length <= 0 && error && (
                <div style={{ marginTop: '1em' }}>
                    <Message severity="error" text={error} />
                </div>
            )}

            <div>
                {result && parseFloat(result) > 0 && (
                    <div
                        style={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: '#CD6E4D',
                            position: 'relative',
                            top: '-10px',
                        }}
                    >
                        {figureBuckets(result)}
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '1em' }}>
                    <div style={{ fontWeight: 'bold' }}>We load with</div>
                    <div>
                        <Image
                            src={skidsteerImage}
                            width={300}
                            height={200}
                            alt="Skidsteer half yard bucket"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
