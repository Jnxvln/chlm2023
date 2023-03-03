import styles from './Footer.module.scss'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <h3 className={styles.logo}>C&H</h3>
            <address className={styles.address}>
                5725 W 7th St. Texarkana, TX 75501
                <br />
                Office Phone: 903-334-7350
            </address>
            <small className={styles.copyright}>
                &copy; Copyright 2010-2023 C&H Landscape Materials
                <span className={styles.footerBreak}>
                    <br />
                </span>
                <span className={styles.footerSpan}> | </span>All Rights
                Reserved
            </small>
        </footer>
    )
}
