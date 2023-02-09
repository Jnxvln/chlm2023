import styles from './LandingHeader.module.scss'

export default function LandingHeader() {
    return (
        <header className={styles.header}>
            <div className={styles.overlay}></div>
            <div className={styles.container}>
                <h1 className={styles.title1}>C&H</h1>
                <h1 className={styles.title2}>Landscape Materials</h1>
            </div>

            <address className={styles.address}>
                5725 W 7th St.
                <br /> Texarkana, TX 75501 | 903-334-7350
            </address>
        </header>
    )
}
