import { NavLink } from 'react-router-dom'
import styles from './Help.module.scss'

export default function Help() {
    return (
        <section className={styles.sectionContainer}>
            <h1 className={styles.title}>Help</h1>
            <p className={styles.description}>
                Our help page should be your first stop if you have questions.
                For anything else, just give us a call!
            </p>

            {/* Help Links */}
            <div className={styles.imageLinkContainer}>
                <NavLink to="#">
                    <img
                        src="https://place-hold.it/160"
                        className={styles.imageLink}
                        alt=""
                    />
                </NavLink>

                <NavLink to="#">
                    <img
                        src="https://place-hold.it/160"
                        className={styles.imageLink}
                        alt=""
                    />
                </NavLink>

                <NavLink to="#">
                    <img
                        src="https://place-hold.it/160"
                        className={styles.imageLink}
                        alt=""
                    />
                </NavLink>

                <NavLink to="#">
                    <img
                        src="https://place-hold.it/160"
                        className={styles.imageLink}
                        alt=""
                    />
                </NavLink>
            </div>

            <div className={styles.helpLinkContainer}>
                <NavLink to="#" className={styles.helpLink}>
                    Visit Help Page
                </NavLink>
            </div>
        </section>
    )
}
