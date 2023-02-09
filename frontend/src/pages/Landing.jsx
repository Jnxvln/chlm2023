import Header from '../components/Landing/Header/Header'
import Footer from '../components/layout/Footer'
import Bulletin from '../components/Landing/Bulletin/Bulletin'
import MaterialBrowser from '../components/Landing/MaterialBrowser/MaterialBrowser'
import HowMuch from '../components/Landing/HowMuch/HowMuch'
import Delivery from '../components/Landing/Delivery/Delivery'
import EagleCarports from '../components/Landing/EagleCarports/EagleCarports'
import Help from '../components/Landing/Help/Help'

export default function Landing() {
    return (
        <section>
            {/* HEADER */}
            <Header />

            {/* BULLETIN BOARD */}
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
