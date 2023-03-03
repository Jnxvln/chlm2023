import styles from './Delivery.module.scss'
import dumpTrailer from '../../../assets/images/landing_dumpTrailer.png'

export default function Delivery() {
    return (
        <section className={styles.sectionContainer}>
            <div className={styles.sectionContent}></div>
            <div className={styles.sectionLifted}>
                <h1 className={styles.title}>
                    Want It{' '}
                    <span className={styles.deliveredText}>Delivered?</span>
                </h1>
                <p className={styles.description}>
                    We offer delivery services on our{' '}
                    <em className={styles.emphasizeBulk}>bulk products</em>{' '}
                    which can be transported and dumped in and around the
                    Texarkana area.
                </p>
                <div className={styles.links}>
                    <a
                        href="/delivery"
                        className={`${styles.button} ${styles.linkLearnMore}`}
                    >
                        Learn More
                    </a>
                    <a
                        href="/materials"
                        className={`${styles.button} ${styles.linkViewMaterials}`}
                    >
                        View Materials
                    </a>
                </div>
                {/* dump trailer image */}
                {/* <div className={styles.dumpTrailerContainer}> */}
                <img
                    src={dumpTrailer}
                    alt="Dump trailer"
                    className={styles.dumpTrailer}
                />
                {/* </div> */}
            </div>
        </section>
    )
}
