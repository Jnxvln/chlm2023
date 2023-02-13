import styles from './MaterialBrowserItem.module.scss'

export default function MaterialBrowserItem({ imgSrc, name, description }) {
    return (
        <article>
            <div className={styles.materialItemContainer}>
                <img
                    src={imgSrc}
                    alt={name}
                    className={styles.materialItemImage}
                />
                <div>
                    <h3 className={styles.materialName}>{name}</h3>
                    <p className={styles.materialDescription}>{description}</p>
                </div>
            </div>
        </article>
    )
}
