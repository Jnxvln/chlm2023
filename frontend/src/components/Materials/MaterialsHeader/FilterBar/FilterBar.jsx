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
        soil: 'soil',
        compost: 'compost',
        mulch: 'mulch',
        dyedmulch: 'dyedmulch',
        naturalmulch: 'naturalmulch',
        gravel: 'gravel',
        drivewaygravel: 'drivewaygravel',
        washedgravel: 'washedgravel',
        finebasegravel: 'finebasegravel',
        stone: 'stone',
        flagstone: 'flagstone',
        choppedstone: 'choppedstone',
        fieldstone: 'fieldstone',
        rock: 'rock',
        creekrock: 'creekrock',
        coloradorock: 'colorado',
        boulders: 'boulders',
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
                    key: 'material-unscreened topsoil soil',
                    data: 'material-unscreened topsoil soil',
                    children: null,
                },
                {
                    label: 'Special Blend (70/30 mix)',
                    key: 'material-special blend soil',
                    data: 'material-special blend soil',
                    children: null,
                },
                {
                    label: "Craig's Mix",
                    key: "material-craig's mix soil",
                    data: "material-craig's mix soil",
                    children: null,
                },
                {
                    label: 'Masonry Sand',
                    key: 'material-masonry sand soil',
                    data: 'material-masonry sand soil',
                    children: null,
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
                    key: 'material-premium compost',
                    data: 'material-premium compost',
                },
            ],
        },
        // MULCH
        {
            label: 'Mulch',
            key: 'mulch',
            data: 'mulch',
            children: [
                // Dyed Mulch
                {
                    label: 'Dyed Mulch',
                    key: CATEGORYMAP.dyedmulch,
                    data: CATEGORYMAP.dyedmulch,
                    children: [
                        {
                            label: 'Chocolate Mulch',
                            key: 'material-chocolate mulch',
                            data: 'material-chocolate mulch',
                            children: null,
                        },
                        {
                            label: 'Red Mulch',
                            key: 'material-red mulch',
                            data: 'material-red mulch',
                            children: null,
                        },
                        {
                            label: 'Black Mulch',
                            key: 'material-black mulch',
                            data: 'material-black mulch',
                            children: null,
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
                            key: 'material-cedar mulch',
                            data: 'material-cedar mulch',
                            children: null,
                        },
                        {
                            label: 'Hardwood Mulch (Dbl-Ground)',
                            key: 'material-hardwood mulch',
                            data: 'material-hardwood mulch',
                            children: null,
                        },
                        {
                            label: 'IPEMA-Certified Playground Mulch',
                            key: 'material-playground mulch',
                            data: 'material-playground mulch',
                            children: null,
                        },
                    ],
                },
            ],
        },
        // GRAVEL
        {
            label: 'Gravel',
            key: 'gravel',
            data: 'gravel',
            children: [
                // Driveway Gravel (with Base)
                {
                    label: 'Driveway Gravel (with Base)',
                    key: 'drivewaygravel',
                    data: 'drivewaygravel',
                    children: [
                        {
                            label: 'Blue SB2',
                            key: 'bluesb2',
                            data: 'bluesb2',
                            children: null,
                        },
                        {
                            label: 'Arkansas Class 5',
                            key: 'arclass5',
                            data: 'arclass5',
                            children: null,
                        },
                    ],
                },
                // Washed Gravel
                {
                    label: 'Washed Gravel',
                    key: 'washedgravel',
                    data: 'washedgravel',
                    children: [
                        {
                            label: `Small Smooth Brown (Bin #1)`,
                            key: 'bin1',
                            data: 'bin1',
                            children: null,
                        },
                        {
                            label: `Medium Smooth Brown (Bin #2)`,
                            key: 'bin2',
                            data: 'bin2',
                            children: null,
                        },
                        {
                            label: `Medium Blue & White Gravel (Bin #5)`,
                            key: 'bin5',
                            data: 'bin5',
                            children: null,
                        },
                        {
                            label: `Landscape Cobbles (Bin #6)`,
                            key: 'bin6',
                            data: 'bin6',
                            children: null,
                        },
                        {
                            label: `Oversize White Gravel (Bin #9)`,
                            key: 'bin9',
                            data: 'bin9',
                            children: null,
                        },
                        {
                            label: `Crushed Gravel (Bin #10)`,
                            key: 'bin10',
                            data: 'bin10',
                            children: null,
                        },
                        {
                            label: `Pea Gravel (Bin #11)`,
                            key: 'bin11',
                            data: 'bin11',
                            children: null,
                        },
                    ],
                },
                // Fine Base Gravel
                {
                    label: 'Fine Base Gravel',
                    key: 'finebasegravel',
                    data: 'finebasegravel',
                    children: [
                        {
                            label: 'Crushed Decomposed Granite',
                            key: 'crushedgranite',
                            data: 'dcgranite',
                            children: null,
                        },
                        {
                            label: 'Blue Fine Screenings',
                            key: 'bluefines',
                            data: 'bluefines',
                            children: null,
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
                    children: [
                        {
                            label: 'Cherry Blend',
                            key: 'material-cherry blend flagstone',
                            data: 'material-cherry blend flagstone',
                            children: null,
                        },
                        {
                            label: 'Cheyenne Brown',
                            key: 'material-cheyenne brown flagstone',
                            data: 'material-cheyenne brown flagstone',
                            children: null,
                        },
                        {
                            label: 'Cheyenne Blue',
                            key: 'material-cheyenne blue flagstone',
                            data: 'material-cheyenne blue flagstone',
                            children: null,
                        },
                        {
                            label: 'Silvermist',
                            key: 'material-silvermist flagstone',
                            data: 'material-silvermist flagstone',
                            children: null,
                        },
                        {
                            label: 'Dark Buckskin',
                            key: 'material-dark buckskin flagstone',
                            data: 'material-dark buckskin flagstone',
                            children: null,
                        },
                        {
                            label: 'Chestnut',
                            key: 'material-chestnut flagstone',
                            data: 'material-chestnut flagstone',
                            children: null,
                        },
                        {
                            label: 'Copper Ridge',
                            key: 'material-copper ridge flagstone',
                            data: 'material-copper ridge flagstone',
                            children: null,
                        },
                    ],
                },
                // Chopped Stone
                {
                    label: 'Chopped Stone',
                    key: CATEGORYMAP.choppedstone,
                    data: CATEGORYMAP.choppedstone,
                    children: [
                        {
                            label: 'Chopped Limestone',
                            key: 'material-chopped limestone',
                            data: 'material-chopped limestone',
                            children: null,
                        },
                        {
                            label: 'Chopped Cheyenne Blue',
                            key: 'material-chopped cheyenne blue',
                            data: 'material-chopped cheyenne blue',
                            children: null,
                        },
                        {
                            label: 'Chopped Silvermist',
                            key: 'material-chopped silvermist',
                            data: 'material-chopped silvermist',
                            children: null,
                        },
                        {
                            label: 'Chopped Cherry Blend',
                            key: 'material-chopped cherry blend',
                            data: 'material-chopped cherry blend',
                            children: null,
                        },
                        {
                            label: 'Chopped Chestnut',
                            key: 'material-chopped chestnut',
                            data: 'material-chopped chestnut',
                            children: null,
                        },
                    ],
                },
                // Fieldstone
                {
                    label: 'Fieldstone',
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
                                    key: 'material-small creek boulders',
                                    data: 'material-small creek boulders',
                                    children: null,
                                },
                                {
                                    label: 'Medium Creek Boulders',
                                    key: 'material-medium creek boulders',
                                    data: 'material-medium creek boulders',
                                    children: null,
                                },
                                {
                                    label: 'Small Mossy Boulders',
                                    key: 'material-small mossy boulders',
                                    data: 'material-small mossy boulders',
                                    children: null,
                                },
                                {
                                    label: 'Medium Mossy Boulders',
                                    key: 'material-medium mossy boulders',
                                    data: 'material-medium mossy boulders',
                                    children: null,
                                },
                                {
                                    label: 'Large Mossy Boulders',
                                    key: 'material-large mossy boulders',
                                    data: 'material-large mossy boulders',
                                    children: null,
                                },
                            ],
                        },
                        {
                            label: 'Med. Cut Stone Steps',
                            key: 'material-medium cut stone steps',
                            data: 'material-medium cut stone steps',
                            children: null,
                        },
                        {
                            label: 'Lrg. Cut Stone Steps',
                            key: 'material-large cut stone steps',
                            data: 'material-large cut stone steps',
                            children: null,
                        },
                        {
                            label: 'Mossy Waterfall',
                            key: 'material-mossy waterfall',
                            data: 'material-mossy waterfall',
                            children: null,
                        },
                        {
                            label: 'Mossy Brick',
                            key: 'material-mossy brick',
                            data: 'material-mossy brick',
                            children: null,
                        },
                        {
                            label: 'Mossy Natural Steps (Grotto)',
                            key: 'material-mossy natural steps grotto',
                            data: 'material-mossy natural steps grotto',
                            children: null,
                        },
                        // {
                        //     label: 'Mossy Rounds',
                        //     key: 'material-mossy rounds',
                        //     data: 'material-mossy rounds',
                        //     children: null,
                        // },
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
                            label: 'Small Flat Creek',
                            key: 'material-small flat creek rock brown',
                            data: 'material-small flat creek rock brown',
                            children: null,
                        },
                        {
                            label: 'Medium Flat Creek',
                            key: 'material-medium flat creek rock',
                            data: 'material-medium flat creek rock',
                            children: null,
                        },
                        {
                            label: 'Large Flat Creek',
                            key: 'material-large flat creek rock',
                            data: 'material-large flat creek rock',
                            children: null,
                        },
                        {
                            label: 'Small Round Creek',
                            key: 'material-small round creek rock',
                            data: 'material-small round creek rock',
                            children: null,
                        },
                        {
                            label: 'Medium Round Creek',
                            key: 'material-medium round creek rock',
                            data: 'material-medium round creek rock',
                            children: null,
                        },
                        {
                            label: 'Creek Brick',
                            key: 'material-creek brick',
                            data: 'material-creek brick',
                            children: null,
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
                            key: 'material-colorado rocky mountain mtn river rock',
                            data: 'material-colorado rocky mountain mtn river rock',
                            children: null,
                        },
                        {
                            label: 'Colorado Skippers',
                            key: 'material-colorado skippers',
                            data: 'material-colorado skippers',
                            children: null,
                        },
                        {
                            label: 'Small Colorado Pancakes',
                            key: 'material-colorado small pancakes',
                            data: 'material-colorado small pancakes',
                            children: null,
                        },
                        {
                            label: 'Medium Pancakes',
                            key: 'material-colorado medium pancakes',
                            data: 'material-colorado medium pancakes',
                            children: null,
                        },
                        {
                            label: 'Large Pancakes',
                            key: 'material-colorado large pancakes',
                            data: 'material-colorado large pancakes',
                            children: null,
                        },
                        {
                            label: 'Mexican Beach Pebbles',
                            key: 'material-colorado mexican beach pebbles',
                            data: 'material-colorado mexican beach pebbles',
                            children: null,
                        },
                    ],
                },
            ],
        },
    ]

    const [nodes, setNodes] = useState(initialNodes)
    const [selectedNodeKey, setSelectedNodeKey] = useState(null)
    const [navCategories, setNavCategories] = useState(null)
    const [filteredMaterials, setFilteredMaterials] = useState([])

    // #region REACT-QUERY
    const materials = useQuery({
        queryKey: ['materials'],
        queryFn: () => getActiveMaterials(),
        onSuccess: (materials) => {
            console.log('Materials: ')
            console.log(materials)
        },
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

    // #region SUB API (FILTER MATERIALS) ============================================================================
    const filterByKeywords = (keywords) => {
        let mats = materials.data.filter(
            (mat) =>
                mat.keywords &&
                keywords.every((el) => mat.keywords.includes(el))
        )

        if (keywords.includes('gravel')) {
            mats.sort((a, b) => parseInt(a.binNumber) - parseInt(b.binNumber))
            setFilteredMaterials(mats)
        } else {
            // // Sort by category
            // let sortByCat = mats.sort((a, b) =>
            //     a.category.localeCompare(b.category)
            // )
            // // Then by name
            // let sortByName = sortByCat.sort((a, b) =>
            //     a.name.localeCompare(b.name)
            // )
            let sorted = mats.sort((a, b) =>
                a.category.localeCompare(b.category)
            )
            setFilteredMaterials(sorted)
        }
    }
    // #endregion ====================================================================================================

    // #endregion

    // #region EVENT HANDLERS
    const onMenuChange = (e) => {
        console.log('[Materials FilterBar.jsx onMenuChange]: ')
        console.log(e)

        setSelectedNodeKey(e.value)

        // If e.value is an INDIVIDUAL MATERIAL
        if (e.value.split('-')[0] === 'material') {
            // Extract the keywords then filter
            let keywords = e.value.split('-')[1].split(' ')
            console.log('Keywords to search: ')
            console.log(keywords)
            filterByKeywords(keywords)
        } else {
            // Otherwise, use manual filtering
            switch (e.value) {
                // #region SOIL
                case 'soil':
                    filterByKeywords(['soil'])
                    break
                // #endregion
                // #region COMPOST

                case 'compost':
                    filterByKeywords(['compost'])
                    break
                // #endregion
                // #region GRAVEL
                case 'gravel':
                    filterByKeywords(['gravel'])
                    break
                case 'drivewaygravel':
                    filterByKeywords(['gravel', 'driveway'])
                    break
                case 'washedgravel':
                    filterByKeywords(['gravel', 'washed'])
                    break
                case 'finebasegravel':
                    filterByKeywords(['gravel', 'base', 'fine'])
                    break
                // #endregion
                // #region MULCH
                case 'mulch':
                    filterByKeywords(['mulch'])
                    break
                case 'dyedmulch':
                    filterByKeywords(['mulch', 'dyed'])
                    break
                case 'naturalmulch':
                    filterByKeywords(['mulch', 'natural'])
                    break
                // #endregion
                // #region STONE
                case 'stone':
                    filterByKeywords(['stone'])
                    break
                case 'boulders':
                    filterByKeywords(['stone', 'boulders'])
                    break
                case 'flagstone':
                    filterByKeywords(['flagstone'])
                    break
                case 'choppedstone':
                    filterByKeywords(['chopped', 'stone'])
                    break
                case 'fieldstone':
                    filterByKeywords(['fieldstone'])
                    break
                // #endregion
                // #region ROCK
                case 'rock':
                    filterByKeywords(['rock'])
                    break
                case 'creekrock':
                    filterByKeywords(['creek', 'rock'])
                    break
                case 'colorado':
                    filterByKeywords(['colorado'])
                    break
                // #endregion
            }
        }
    }
    // #endregion

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

            <div className={styles.info}>
                <p style={{ textAlign: 'center' }}>
                    Use the menu above to search for the material you're looking
                    for. You can click on category names as well as material
                    names.
                </p>
            </div>

            <div className={`${styles.info} ${styles.disclaimer}`}>
                <p>
                    While browsing, please keep in mind each picture shown
                    represents the material at a single point in time. Every
                    truckload we receive will vary in size, texture, color, and
                    composition. We <u>always</u> suggest stopping by to look
                    before purchasing.
                </p>
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
