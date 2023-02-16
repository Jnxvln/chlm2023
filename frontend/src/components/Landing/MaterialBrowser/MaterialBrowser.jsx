import styles from './MaterialBrowser.module.scss'
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import MaterialBrowserItem from './MaterialBrowserItem/MaterialBrowserItem'

export default function MaterialBrowser() {
    const navigate = useNavigate()

    return (
        <section className={styles.sectionContainer}>
            <div className={styles.backgroundContainer}>
                <div className={styles.backgroundOverlay}></div>
            </div>

            <article className={styles.article}>
                <div>
                    <h1 className={styles.title}>Browse Our Materials</h1>
                    <div className={styles.carouselContainer}>
                        {/* Image Carousel */}
                    </div>
                    <nav className={styles.nav}>
                        <ul className={styles.navList}>
                            <li className={styles.navListItem}>Gravel</li>
                            <li className={styles.navListItem}>Soil</li>
                            <li className={styles.navListItem}>Compost</li>
                            <li className={styles.navListItem}>Mulch</li>
                            <li className={styles.navListItem}>Flagstone</li>
                            <li className={styles.navListItem}>Creek Rock</li>
                        </ul>
                    </nav>
                </div>

                <div className={styles.infoContainer}>
                    <div className={styles.materialsButtonContainer}>
                        <Button
                            type="button"
                            onClick={() => navigate('/materials')}
                        >
                            View All Materials
                        </Button>
                    </div>

                    <h2 className={styles.categoryTitle}>Soil</h2>

                    <div className={styles.materialBrowserItemContainer}>
                        <MaterialBrowserItem
                            imgSrc="https://via.placeholder.com/200"
                            name="Unscreened Topsoil"
                            description="We carry a local, unscreened (unfiltered)
                            sandy loam topsoil, great for use in
                            planting, gardening, filling holes, and much
                            more. Its general-purpose qualities make it
                            a mainstay in a large variety of landscaping
                            projects."
                        />

                        <MaterialBrowserItem
                            imgSrc="https://via.placeholder.com/200"
                            name="Premium Organic Compost"
                            description="Our premium organic compost is rich in
                            nutrients made mostly from hardwood sawdust
                            and chicken litter. It is excellent for
                            blending into your own soil or our topsoil,
                            for use in planting and gardening. You can
                            also add it to your lawn for enrichment."
                        />

                        <MaterialBrowserItem
                            imgSrc="https://via.placeholder.com/200"
                            name="70/30 Mix (Special Blend)"
                            description="70/30 is our in-house blend of 70% Premium
                            Compost with 30% Masonry Sand, where the
                            compost provides a great source of nutrients
                            and the sand helps with drainage, together
                            creating an excellent garden soil blend. Tip: Blend in with topsoil or your own soil
                            if it is draining too quickly."
                        />

                        <MaterialBrowserItem
                            imgSrc="https://via.placeholder.com/200"
                            name="70/30 Mix (Special Blend)"
                            description="70/30 is our in-house blend of 70% Premium
                            Compost with 30% Masonry Sand, where the
                            compost provides a great source of nutrients
                            and the sand helps with drainage, together
                            creating an excellent garden soil blend. Tip: Blend in with topsoil or your own soil
                            if it is draining too quickly."
                        />
                    </div>
                    <div className={styles.materialsButtonContainer}>
                        <Button
                            type="button"
                            onClick={() => navigate('/materials')}
                        >
                            View All Materials
                        </Button>
                    </div>
                </div>
            </article>
        </section>
    )
}
