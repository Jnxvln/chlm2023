import styles from './Contact.module.scss'
import WarningLogo from '../../assets/images/contact/Warning.png'

export default function Contact() {
    return (
        <section>
            <header className={styles.header}>
                <div className={styles.headerBkg}></div>
                <div className={styles.bkgOverlay}></div>
                <h1 className={styles.title}>Contact Us</h1>
            </header>

            {/* ADDRESS & PHONE */}
            <div className={styles.contactInfo}>
                <div className={styles.contactWrapper}>
                    <address className={styles.address}>
                        5725 W 7th St
                        <br />
                        Texarkana, TX 75501
                    </address>
                    <div className={styles.phone}>903-334-7350</div>
                </div>
            </div>

            {/* WEATHER DISCLAIMER */}
            <div className={styles.weatherDisclaimerSection}>
                <div className={styles.weatherDisclaimerWrapper}>
                    <div>
                        <img src={WarningLogo} alt="Warning" />
                    </div>
                    <div className={styles.weatherTextGroup}>
                        <div className={styles.weatherPermitting}>
                            All business hours depend on the weather
                        </div>
                        <div className={styles.closureNotice}>
                            We post closure notices on the homepage
                        </div>
                    </div>
                </div>
            </div>

            {/* HOURS OF OPERATION */}
            <div className={styles.hoursWrapper}>
                <h2 className={styles.hoursTitle}>
                    Current Hours of Operation
                </h2>
                <div className={styles.hoursList}>
                    <div>
                        <strong>Mon - Fri:</strong> 8:00am - 5:00pm
                    </div>
                    <div>
                        <strong>Saturday:</strong> 8:00am - 12:00pm{' '}
                        <span className={styles.winterOnly}>
                            (only March-November)
                        </span>
                    </div>
                    <div>
                        <strong>Sunday: </strong> Closed
                    </div>
                </div>
            </div>

            <div className={styles.mapWrapper}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.3227561677822!2d-94.12406959695764!3d33.41482879193943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x863440e2a84ed4a1%3A0xbc62af402ff3d75a!2s5725%20W%207th%20St%2C%20Texarkana%2C%20TX%2075501!5e0!3m2!1sen!2sus!4v1683571223151!5m2!1sen!2sus"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className={styles.map}
                ></iframe>
            </div>
        </section>
    )
}
