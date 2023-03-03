import styles from './EagleCarports.module.scss'
import EagleLogo from '../../../assets/images/eagle_logo.png'
import LeftArrow from '../../../assets/images/arrow-left.svg'
import EagleSelectedImage from '../../../assets/images/eagle_selectedImage.png'

export default function EagleCarports() {
    return (
        <section className={styles.sectionContainer}>
            <header className={styles.titleContainer}>
                <img src={EagleLogo} className={styles.logo} alt="Eagle logo" />
                <h1 className={styles.title}>Eagle Carports</h1>
            </header>

            <section className={styles.bottomSection}>
                {/* Carport carousel */}
                <div className={styles.carportCarouselContainerWrapper}>
                    <div className={styles.carportCarouselContainer}>
                        <div className={styles.tempCarouselNav}>
                            <img
                                src={LeftArrow}
                                alt="Left Arrow"
                                className={styles.arrowLeft}
                            />
                            <img
                                src={LeftArrow}
                                alt="Right Arrow"
                                className={styles.arrowRight}
                            />
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className={styles.info}>
                    {/* Nav */}
                    <div className={styles.eagleNavContainer}>
                        <h3 className={styles.eagleNavTitle}>
                            Structure Styles
                        </h3>
                        <nav className={styles.eagleNav}>
                            <div className={styles.eagleNavList}>
                                <div className={styles.eagleNavListItem}>
                                    Standard (12'w - 24'w)
                                </div>
                                <div className={styles.eagleNavListItem}>
                                    Triple Wide (26'w - 30'w)
                                </div>
                                <div className={styles.eagleNavListItem}>
                                    Commercial (32'w - 40'w)
                                </div>
                                <div className={styles.eagleNavListItem}>
                                    RV Cover
                                </div>
                                <div className={styles.eagleNavListItem}>
                                    Combo Unit
                                </div>
                                <div className={styles.eagleNavListItem}>
                                    Horse Barn
                                </div>
                                <div className={styles.eagleNavListItem}>
                                    Single Slope Roof
                                </div>
                                <div className={styles.eagleNavListItem}>
                                    Loafing Shed
                                </div>
                            </div>
                        </nav>
                    </div>

                    {/* Unit picture and info */}
                    <article className={styles.eagleDescriptionContainer}>
                        <img
                            src={EagleSelectedImage}
                            alt="Combo Unit"
                            className={styles.eagleDescriptionImage}
                        />
                        <div
                            className={styles.eagleDescriptionContentContainer}
                        >
                            <h2 className={styles.eagleDescriptionTitle}>
                                Combo Unit
                            </h2>
                            <p className={styles.eagleDescriptionContent}>
                                Combo units are fully-customizable and designed
                                to provide both protection and storage space,
                                making it the perfect solution for a more
                                functional metal building.
                            </p>
                        </div>
                    </article>
                </div>

                <div className={styles.quote}>
                    <p>Visit our office to receive a quote!</p>
                </div>
            </section>
        </section>
    )
}
