import styles from '../styles/pages/landing/Landing.module.scss'
import BulletinBoard from '../components/landing/bulletin/BulletinBoard'
import LandingMaterials from '../components/landing/landingMaterials/LandingMaterials'

function Landing() {
    return (
        <div>
            <header className={styles.header}>
                <div className={styles['header-container']}>
                    <h1 className={styles['header-title']}>C&H</h1>
                    <h2 className={styles['header-subtitle']}>
                        Landscape Materials
                    </h2>
                </div>
                <address className={styles['header-address']}>
                    5725 W 7th St. Texarkana, TX 75501 | 903-334-7350
                </address>
                <nav></nav>
            </header>

            <section className={styles['bulletin-section']}>
                <BulletinBoard />
            </section>

            <section className={styles['materials-section']}>
                <LandingMaterials />
            </section>
        </div>
    )
}

export default Landing
