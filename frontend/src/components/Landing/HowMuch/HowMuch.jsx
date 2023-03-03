import styles from './HowMuch.module.scss'
import imgTapeMeasure from '../../../assets/images/tapemeasure.png'

export default function HowMuch() {
    return (
        <section className={styles.sectionContainer}>
            <h1 className={styles.title}>How much do I need?</h1>
            <div className={styles.linkContainer}>
                <a href="/calculator" className={styles.calculatorLink}>
                    <span>Try our online calculator</span>
                </a>
                {/* <div className={styles.imageContainer}>
                    <img src={imgTapeMeasure} alt="" className={styles.image} />
                </div> */}
            </div>
            <p className={styles.description}>
                For bulk materials only{' '}
                <span className={styles.descriptionBreak}>
                    (soils, mulches, and gravel)
                </span>
            </p>
            <div className={styles.disclaimer}>
                Disclaimer: Calculations are an approximation only
            </div>
        </section>
    )
}
