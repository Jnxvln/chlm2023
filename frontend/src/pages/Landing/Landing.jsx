import LandingHeader from '../../components/Landing/LandingHeader/LandingHeader'
import Footer from '../../components/layout/Footer/Footer'
import Bulletin from '../../components/Landing/Bulletin/Bulletin'
import MaterialBrowser from '../../components/Landing/MaterialBrowser/MaterialBrowser'
import HowMuch from '../../components/Landing/HowMuch/HowMuch'
import Delivery from '../../components/Landing/Delivery/Delivery'
import EagleCarports from '../../components/Landing/EagleCarports/EagleCarports'
import Help from '../../components/Landing/Help/Help'
import styles from './Landing.module.scss'
import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import { getStoreSettings } from '../../api/storeSettings/storeSettingsApi'

export default function Landing() {
    const settings = useQuery({
        queryKey: ['storesettings'],
        queryFn: () => getStoreSettings(),
        onError: (err) => {
            console.log(err)
            const msg = err.message
            toast.error(msg, { autoClose: 5000 })
        },
    })

    return (
        <section>
            {/* HEADER */}
            <LandingHeader />

            {/* Store Closed Message */}
            {settings && settings.data && !settings.data.storeOpen && (
                <div
                    style={{
                        backgroundColor: '#ECE9E7',
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '2em 0',
                    }}
                >
                    <div className={styles.storeClosedContainer}>
                        <div className={styles.storeClosedWrapper}>
                            <div>
                                <i
                                    className="pi pi-exclamation-circle"
                                    style={{ color: 'white', fontSize: '3rem' }}
                                />
                            </div>
                            <div>
                                {settings &&
                                    settings.data &&
                                    !settings.data.storeOpen && (
                                        <div
                                            className={
                                                styles.storeClosedMessage
                                            }
                                        >
                                            {settings.data.storeClosedReason}
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Bulletin />

            {/* BROWSE MATERIALS */}
            <MaterialBrowser />

            {/* HOW MUCH DO I NEED */}
            <HowMuch />

            {/* DELIVERY SECTION */}
            <Delivery />

            {/* EAGLE CARPORTS */}
            <EagleCarports />

            {/* HELP SECTION */}
            <Help />

            {/* Footer */}
            <Footer />
        </section>
    )
}
