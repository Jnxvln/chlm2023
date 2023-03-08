import styles from './EagleCarports.module.scss'
import { useState } from 'react'
import EagleLogo from '../../../assets/images/eagle_logo.png'
import ImageCarportStandard from '../../../assets/images/carports/carport_standard.jpg'
import ImageCarportTriple from '../../../assets/images/carports/carport_triple.jpg'
import ImageCarportCommercial from '../../../assets/images/carports/carport_commercial.jpg'
import ImageCarportGarage from '../../../assets/images/carports/carport_garage.jpg'
import ImageCarportRVCover from '../../../assets/images/carports/carport_rvcover.jpg'
import ImageCarportComboUnit from '../../../assets/images/carports/carport_combounit.jpg'
import ImageCarportHorseBarn from '../../../assets/images/carports/carport_horsebarn.jpg'
import ImageCarportSingleSlopeRoof from '../../../assets/images/carports/carport_singlesloperoof.jpg'
import ImageCarportLoafingShed from '../../../assets/images/carports/carport_loafingshed.jpg'

export default function EagleCarports() {
    const STANDARD = 'standard'
    const TRIPLE = 'triple'
    const COMMERCIAL = 'commercial'
    const GARAGE = 'garage'
    const RVCOVER = 'rvcover'
    const COMBOUNIT = 'combounit'
    const HORSEBARN = 'horsebarn'
    const SINGLESLOPEROOF = 'singlesloperoof'
    const LOAFINGSHED = 'loafingshed'

    const initialCarports = [
        {
            id: STANDARD,
            name: "Standard (12'w to 24'w)",
            image: ImageCarportStandard,
            description:
                "Eagle's flagship carport, the standard carport ranges from 12' wide to 24' wide, with a default of 6' legs and include the following: 14-gauge galvanized steel framing, 29-gauge metal roofing with 20 year Beckers paint system, framing spaced 5' on center. Includes both peak and leg braces for additional strength and stability. Concrete anchors or rebar anchors are included in the base price. For ground installation, add Earth Auger Anchor Package (sold separately). Eagle Carports, Inc. is not responsible for stopping, or repairing leaks under base rails, nor provides any site work.",
        },
        {
            id: TRIPLE,
            name: "Triple Wide (26'w to 30'w)",
            image: ImageCarportTriple,
            description:
                "For extra-wide capacity protection, Eagle's triple-wide carports come default with 6' leg height and include the following: 14-gauge galvanized steel framing, 29-gauge metal roofing with 20 year Beckers paint system, framing spaced 5' on center. Includes both peak and leg braces for additional strength and stability. Concrete anchors or rebar anchors are included in the base price. Earth auger anchor package included. Eagle Carports, Inc. is not responsible for stopping, or repairing leaks under base rails, nor provides any site work.",
        },
        {
            id: COMMERCIAL,
            name: "Commercial (32'w to 40'w)",
            image: ImageCarportCommercial,
            description:
                "Need extra-wide buildings? Commercial grade features come default with 8' legs and include the following: 14-gauge galvanized steel truss system with industry leading tubular knee bracing, 29-gauge metal roofing with 20 year Beckers paint system, framing spaced 5' on center, concrete anchors or earth auger anchors are included in the base price. Eagle Carports, Inc. is not responsible for stopping, or repairing leaks under base rails, nor provides any site work.",
        },
        {
            id: GARAGE,
            name: 'Garage',
            image: ImageCarportGarage,
            description:
                'Enclosed garage-style metal buildings come standard with 9\' legs and include the following: 36"x80" walk-in door, two 24"x36" windows, listed garage doors, 14-gauge galvanized steel framing, 29-gauge metal roofing with 20 year Beckers paint system, framing spaced 5\' on center and includes both roof and leg bracing for additional strength and stability. Concrete anchors and rebar anchors are included in base prices for units. For ground installations on units 12\'-24\' wide: add ground anchor package. Please note, Eagle Carports, Inc. does not provide site work.',
        },
        {
            id: RVCOVER,
            name: 'RV Cover',
            image: ImageCarportRVCover,
            description:
                "Protecting tall assets such as RV's can be a real challange, but Eagle has metal structures designed specifically for this case. The RV covers come standard with 15' legs and include the following: 14-gauge galvanized steel framing, 29-gauge metal roofing with 20 year Beckers paint system, framing spaced 5' on center, double base rail, double legs, includes both peak and leg brancing for additional strength and stability. Concrete anchors or rebar anchors, and earth auger anchors are included in the base price. Please note, Eagle Carports, inc. does not provide site work.",
        },
        {
            id: COMBOUNIT,
            name: 'Combo Unit',
            image: ImageCarportComboUnit,
            description:
                "Combo units feature both an open carport concept and a well-designed storage space solution that offers 10' of storage space. The 10' storage size can be increased in size, but will decrease the length of the carport area. Combo units come standard with 9' legs and include the following: two 24\"x36\" windows, one 36\"x80\" walk-in door, one 8'x8' garage door, 14-gauge galvanized steel framing, 29-gauge metal roofing with 20 year Beckers paint system, framing spaced 5' on center and includes both roof and leg bracing for additional strength and stability. Concrete anchors and rebar anchors are included in the base price. Ground installations on units 12'-24' wide add earth auger anchor package. Please note, Eagle Carports, inc. does not provide site work.",
        },
        {
            id: HORSEBARN,
            name: 'Horse Barn',
            image: ImageCarportHorseBarn,
            description:
                "Standard horse barn structures include the following: 14-gauge galvanized steel framing, 29-gauge metal roofing with 20 year Beckers paint system, framing spaced 5' on center. Horse barn packages include both peak and leg bracing for additional strength and stability. Packages also include gable ends on both front and back of the barn, on both center section and lean-to's. Concrete anchors or rebar anchors, and earth auger anchors are included in the base price. Eagle Carports, Inc. is not responsible for stopping, or repairing leaks under base rails, nor provides any site work.",
        },
        {
            id: SINGLESLOPEROOF,
            name: 'Single Slope Roof',
            image: ImageCarportSingleSlopeRoof,
            description:
                "Standard single-slope roof structures' standard leg height varies by size and include the following: 14-gauge galvanized steel framing, 29-gauge metal roofing with 20 year Beckers paint system, framing spaced 5' on center. Single-slope packages include both peak and leg bracing for additional strength and stability. Concrete anchors and rebar anchors are included in the base price. For ground installations on units 12'-24' wide add earth auger anchor package. Note: frame build varies by width and leg height. Dual-tube rafter used for 18'-24' wide units. Eagle Carports, Inc. is not responsible for stopping, or repairing leaks under base rails, nor provides any site work.",
        },
        {
            id: LOAFINGSHED,
            name: 'Loafing Shed',
            image: ImageCarportLoafingShed,
            description:
                "Eagle's standard loafing sheds' standard leg height varies by size and include the following: 14-gauge galvanized steel framing, 29-gauage metal roofing with 20 year Beckers paint system, framing spaced 5' on center. Loafing shed packages include leg bracing for additional strength and stability. Packages also include concrete anchors or rebar anchors, and earth auger anchors in the base price. Please note, Eagle Carports, inc. does not provide site work.",
        },
    ]

    const [carports, setCarports] = useState(initialCarports)
    const [activeCarport, setActiveCarport] = useState(initialCarports[0])

    const toggleActiveCarportStyle = (target) => {
        const elems = document.querySelectorAll('.carport').forEach((item) => {
            item.style.backgroundColor = 'transparent'
        })
        target.style.backgroundColor = '#C8DCE9'
    }

    const onCarportChange = (e, id) => {
        setActiveCarport(carports.find((c) => c.id === id))

        toggleActiveCarportStyle(e.target)
        console.log('Active Carport: ')
        console.log(activeCarport)
    }

    return (
        <section className={styles.sectionContainer}>
            <header className={styles.header}>
                <img src={EagleLogo} className={styles.logo} alt="Eagle logo" />
                <h1 className={styles.title}>Eagle Carports</h1>
            </header>

            {/* CONTENT SECTION */}
            <div className={styles.contentContainer}>
                {/* INFO SECTION */}
                <section className={styles.infoSection}>
                    {/* NAV */}
                    <div className={styles.navContainer}>
                        <h3 className={styles.navTitle}>Structure Styles</h3>
                        <nav className={styles.nav}>
                            {carports &&
                                carports.map((carport) => (
                                    <div
                                        key={carport.id}
                                        className={`${styles.navItem} carport`}
                                        onClick={(e) =>
                                            onCarportChange(e, carport.id)
                                        }
                                    >
                                        {carport.name}
                                    </div>
                                ))}
                        </nav>
                    </div>

                    {/* DESCRIPTION & CARPORT IMAGE */}
                    <div className={styles.infoContainer}>
                        {activeCarport && (
                            // Info Image
                            <div className={styles.infoImageWrapper}>
                                <img
                                    src={activeCarport.image}
                                    alt={activeCarport.name}
                                    className={styles.infoImage}
                                />
                            </div>
                        )}

                        {/* INFO CONTENT */}
                        <div className={styles.infoContentContainer}>
                            {activeCarport && (
                                <h2 className={styles.infoContentTitle}>
                                    {activeCarport.name}
                                </h2>
                            )}

                            <p className={styles.infoContentDescription}>
                                {activeCarport && activeCarport.description}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
            <div className={styles.quote}>
                <p>Visit our office to receive a quote!</p>
            </div>
        </section>
    )
}
