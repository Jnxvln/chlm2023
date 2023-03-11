import styles from './FilterBar.module.scss'
import { TreeSelect } from 'primereact/treeselect'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { getActiveMaterials } from '../../../../api/materials/materialsApi'
import { getMaterialCategories } from '../../../../api/materialCategories/materialCategoriesApi'
import MaterialCard from '../../MaterialCard/MaterialCard'

export default function FilterBar() {
    const queryClient = useQueryClient()

    const CATEGORYMAP = {
        soil: 'c-soil',
        compost: 'c-compost',
        mulch: 'c-mulch',
        dyedmulch: 'sc-dyedMulch',
        naturalmulch: 'sc-naturalMulch',
        gravel: 'c-gravel',
        drivewaygravel: 'sc-drivewayGravel',
        stone: 'c-stone',
        flagstone: 'sc-flagStone',
        choppedstone: 'sc-choppedStone',
        fieldstone: 'sc-fieldstone',
        rock: 'c-rock',
        creekrock: 'sc-creekRock',
        coloradorock: 'sc-colorado',
        boulders: 'sc-boulders',
    }

    const initialNodes = [
        // SOILS
        {
            label: 'Soils',
            key: CATEGORYMAP.soil,
            data: CATEGORYMAP.soil,
            children: [
                {
                    label: 'Topsoil',
                    key: 'soil-topsoil',
                    data: 'soil-topsoil',
                },
                {
                    label: 'Special Blend',
                    key: 'soil-specialBlend',
                    data: 'soil-specialBlend',
                },
                {
                    label: "Craig's Mix",
                    key: 'soil-craigsMix',
                    data: 'soil-craigsMix',
                },
                {
                    label: 'Masonry Sand',
                    key: 'soil-masonrySand',
                    data: 'soil-masonrySand',
                },
            ],
        },
        // COMPOST
        {
            label: 'Compost',
            key: CATEGORYMAP.compost,
            data: CATEGORYMAP.compost,
            children: [
                {
                    label: 'Premium Compost',
                    key: 'compost-premiumCompost',
                    data: 'compost-premiumCompost',
                },
            ],
        },
        // MULCH
        {
            label: 'Mulch',
            key: CATEGORYMAP.mulch,
            data: CATEGORYMAP.mulch,
            children: [
                // Dyed Mulch
                {
                    label: 'Dyed Mulch',
                    key: CATEGORYMAP.dyedmulch,
                    data: CATEGORYMAP.dyedmulch,
                    children: [
                        {
                            label: 'Chocolate Mulch',
                            key: 'dyedMulch-chocolate',
                            data: 'dyedMulch-chocolate',
                        },
                        {
                            label: 'Red Mulch',
                            key: 'dyedMulch-red',
                            data: 'dyedMulch-red',
                        },
                        {
                            label: 'Black Mulch',
                            key: 'dyedMulch-black',
                            data: 'dyedMulch-black',
                        },
                    ],
                },
                // Natural Mulch
                {
                    label: 'Natural Mulch',
                    key: CATEGORYMAP.naturalmulch,
                    data: CATEGORYMAP.naturalmulch,
                    children: [
                        {
                            label: 'Cedar Mulch',
                            key: 'naturalMulch-cedar',
                            data: 'naturalMulch-cedar',
                        },
                        {
                            label: 'Hardwood Mulch (Dbl-Ground)',
                            key: 'naturalMulch-hardwood',
                            data: 'naturalMulch-hardwood',
                        },
                        {
                            label: 'IPEMA-Certified Playground Mulch',
                            key: 'naturalMulch-playground',
                            data: 'naturalMulch-playground',
                        },
                    ],
                },
            ],
        },
        // GRAVEL
        {
            label: 'Gravel',
            key: CATEGORYMAP.gravel,
            data: CATEGORYMAP.gravel,
            children: [
                {
                    label: 'Driveway Gravel (with Base)',
                    key: 'sc-drivewayGravel',
                    data: 'sc-drivewayGravel',
                    children: [
                        {
                            label: 'Blue SB2',
                            key: 'drivewayGravel-blueSB2',
                            data: 'drivewayGravel-blueSB2',
                        },
                        {
                            label: 'Arkansas Class 5',
                            key: 'drivewayGravel-arClass5',
                            data: 'drivewayGravel-arClass5',
                        },
                    ],
                },
                {
                    key: '3-1',
                    label: 'Washed Gravel',
                    data: 'washedgravel',
                    children: [
                        {
                            key: '3-1-0',
                            label: `Small Smooth Brown (Bin #1)`,
                            data: 'bin1',
                        },
                        {
                            key: '3-1-1',
                            label: `Medium Smooth Brown (Bin #2)`,
                            data: 'bin2',
                        },
                        {
                            key: '3-1-2',
                            label: `Medium Blue & White Gravel (Bin #5)`,
                            data: 'bin5',
                        },
                        {
                            key: '3-1-3',
                            label: `Landscape Cobbles (Bin #6)`,
                            data: 'bin6',
                        },
                        {
                            key: '3-1-4',
                            label: `Oversize White Gravel (Bin #9)`,
                            data: 'bin9',
                        },
                        {
                            key: '3-1-5',
                            label: `Crushed Gravel (Bin #10)`,
                            data: 'bin10',
                        },
                        {
                            key: '3-1-6',
                            label: `Pea Gravel (Bin #11)`,
                            data: 'bin11',
                        },
                    ],
                },
                {
                    key: '3-2',
                    label: 'Fine Base Gravel',
                    data: 'finebasegravel',
                    children: [
                        {
                            key: '3-2-0',
                            label: 'Crushed Decomposed Granite',
                            data: 'dcgranite',
                        },
                        {
                            key: '3-2-1',
                            label: 'Blue Fine Screenings',
                            data: 'bluefines',
                        },
                    ],
                },
            ],
        },
        // STONE
        {
            label: 'Stone',
            key: CATEGORYMAP.stone,
            data: CATEGORYMAP.stone,
            children: [
                // Flagstone
                {
                    label: 'Flagstone',
                    key: CATEGORYMAP.flagstone,
                    data: CATEGORYMAP.flagstone,
                },
                // Chopped Stone
                {
                    label: 'Chopped Stone',
                    key: CATEGORYMAP.choppedstone,
                    data: CATEGORYMAP.choppedstone,
                },
                // Field Stone
                {
                    label: 'Field Stone',
                    key: CATEGORYMAP.fieldstone,
                    data: CATEGORYMAP.fieldstone,
                    children: [
                        {
                            label: 'Boulders',
                            key: CATEGORYMAP.boulders,
                            data: CATEGORYMAP.boulders,
                            children: [
                                {
                                    label: 'Small Creek Boulders',
                                    key: 'boulders-smallCreek',
                                    data: 'boulders-smallCreek',
                                },
                                {
                                    label: 'Large Creek Boulders',
                                    key: 'boulders-largeCreek',
                                    data: 'boulders-largeCreek',
                                },
                                {
                                    label: 'Small Mossy Boulders',
                                    key: 'boulders-smallMossy',
                                    data: 'boulders-smallMossy',
                                },
                                {
                                    label: 'Medium Mossy Boulders',
                                    key: 'boulders-mediumMossy',
                                    data: 'boulders-mediumMossy',
                                },
                                {
                                    label: 'Large Mossy Boulders',
                                    key: 'boulders-largeMossy',
                                    data: 'boulders-largeMossy',
                                },
                            ],
                        },
                        {
                            label: 'Med. Cut Stone Steps',
                            key: 'fieldStone-cutStoneSteps',
                            data: 'fieldStone-cutStoneSteps',
                        },
                        {
                            label: 'Lrg. Cut Stone Steps',
                            key: 'fieldStone-lrgCutStoneSteps',
                            data: 'fieldStone-lrgCutStoneSteps',
                        },
                        {
                            label: 'Mossy Waterfall',
                            key: 'fieldStone-waterfall',
                            data: 'fieldStone-waterfall',
                        },
                        {
                            label: 'Mossy Brick',
                            key: 'fieldStone-mossyBrick',
                            data: 'fieldStone-mossyBrick',
                        },
                        {
                            label: 'Mossy Rounds',
                            key: 'fieldStone-mossyRounds',
                            data: 'fieldStone-mossyRounds',
                        },
                        {
                            label: 'Mossy Natural Steps (Grotto)',
                            key: 'fieldStone-naturalSteps',
                            data: 'fieldStone-naturalSteps',
                        },
                    ],
                },
            ],
        },
        // ROCK
        {
            label: 'Rock',
            key: CATEGORYMAP.rock,
            data: CATEGORYMAP.rock,
            children: [
                // Creek Rock
                {
                    label: 'Creek Rock',
                    key: CATEGORYMAP.creekrock,
                    data: CATEGORYMAP.creekrock,
                    children: [
                        {
                            label: 'Flat Creek',
                            key: 'creekRock-flat',
                            data: 'creekRock-flat',
                            children: [],
                        },
                        {
                            label: 'Round Creek',
                            key: 'creekRock-round',
                            data: 'creekRock-round',
                            children: [],
                        },
                        {
                            label: 'Creek Brick',
                            key: 'creekRock-brick',
                            data: 'creekRock-brick',
                        },
                    ],
                },
                // Colorado Rock
                {
                    label: 'Colorado Rock',
                    key: CATEGORYMAP.coloradorock,
                    data: CATEGORYMAP.coloradorock,
                    children: [
                        {
                            label: 'Rocky Mountain River Rock',
                            key: 'colorado-rockyMtnRiverRock',
                            data: 'colorado-rockyMtnRiverRock',
                        },
                        {
                            label: 'Colorado Skippers',
                            key: 'colorado-skippers',
                            data: 'colorado-skippers',
                        },
                        {
                            label: 'Medium Pancakes',
                            key: 'colorado-medPancakes',
                            data: 'colorado-medPancakes',
                        },
                        {
                            label: 'Large Pancakes',
                            key: 'colorado-lrgPancakes',
                            data: 'colorado-lrgPancakes',
                        },
                        {
                            label: 'Mexican Beach Pebbles',
                            key: 'colorado-beachPebbles',
                            data: 'colorado-beachPebbles',
                        },
                    ],
                },
            ],
        },
    ]

    const [nodes, setNodes] = useState(initialNodes)
    const [selectedNodeKey, setSelectedNodeKey] = useState(null)
    const [filteredMaterials, setFilteredMaterials] = useState([])

    // #region REACT-QUERY
    const materials = useQuery({
        queryKey: ['materials'],
        queryFn: () => getActiveMaterials(),
        onError: (err) => {
            console.log(err)
            toast.error(err.message, { autoClose: 8000 })
        },
    })

    const categories = useQuery({
        queryKey: ['categories'],
        queryFn: () => getMaterialCategories(),
        onError: (err) => {
            console.log(err)
            toast.error(err.message, { autoClose: 8000 })
        },
    })
    // #endregion

    // #region EVENT HANDLERS
    const onMenuChange = (e) => {
        console.log('[Materials FilterBar.jsx onMenuChange]: ')
        console.log(e)
        setSelectedNodeKey(e.value)
        filterMaterials(e.value)
    }

    const filterMaterials = (categoryName) => {
        // Match existing C&H materialcategory name with CATEGORYMAP keys
        const mapName = Object.entries(CATEGORYMAP).find(
            (e) => e[1] === categoryName
        )[0]
        console.log('mapName: ' + mapName)

        let categoryIds = []

        if (mapName === 'stone') {
            let cats = categories.data.filter(
                (cat) =>
                    cat.name.toLowerCase() === 'flagstone' ||
                    cat.name.toLowerCase() === 'chopped stone' ||
                    cat.name.toLowerCase() === 'field stone' ||
                    cat.name.toLowerCase() === 'boulders'
            )

            cats.forEach((element) => {
                categoryIds.push(element._id)
            })

            // console.log('CategoryIds: ')
            // console.log(categoryIds)

            setFilteredMaterials(
                materials.data.filter((mat) =>
                    categoryIds.includes(mat.category.toString())
                )
            )
        } else if (mapName === 'rock') {
            let cats = categories.data.filter(
                (cat) =>
                    cat.name.toLowerCase() === 'creek rock' ||
                    cat.name.toLowerCase() === 'colorado rock'
            )
            cats.forEach((element) => {
                categoryIds.push(element._id)
            })

            console.log('CategoryIds: ')
            console.log(categoryIds)

            setFilteredMaterials(
                materials.data.filter((mat) =>
                    categoryIds.includes(mat.category)
                )
            )
        } else if (mapName === 'dyedmulch') {
            setFilteredMaterials(
                materials.data.filter(
                    (mat) =>
                        mat.name.toLowerCase() === 'red mulch' ||
                        mat.name.toLowerCase() === 'black mulch' ||
                        mat.name.toLowerCase() === 'chocolate brown mulch'
                )
            )
        } else if (mapName === 'naturalmulch') {
            setFilteredMaterials(
                materials.data.filter(
                    (mat) =>
                        mat.name.toLowerCase() === 'cedar mulch' ||
                        mat.name.toLowerCase() ===
                            'hardwood dbl-ground mulch' ||
                        mat.name.toLowerCase() === 'pinebark mulch' ||
                        mat.name.toLowerCase() === 'playground mulch (ipema)'
                )
            )
        } else {
            const categoryId = categories.data.find(
                (cat) => cat.name.toLowerCase() === mapName.toLowerCase()
            )._id
            console.log('Category ID: ' + categoryId)
            setFilteredMaterials(
                materials.data.filter((mat) => mat.category === categoryId)
            )
        }
    }
    // #endregion

    useEffect(() => {
        if (filteredMaterials && filteredMaterials.length > 0) {
            console.log('=== FILTERED MATERIALS SET ===')
            console.log(filteredMaterials)
        }
    }, [filteredMaterials])

    return (
        <>
            <div className={styles.container}>
                <TreeSelect
                    value={selectedNodeKey}
                    onChange={(e) => onMenuChange(e)}
                    options={nodes}
                    placeholder="Search by Category"
                    className={styles.filterSearch}
                    filter
                />
            </div>

            <section className={styles.main}>
                {filteredMaterials &&
                    filteredMaterials.length > 0 &&
                    filteredMaterials.map((mat) => (
                        <MaterialCard key={mat._id} material={mat} />
                    ))}
            </section>
        </>
    )
}
