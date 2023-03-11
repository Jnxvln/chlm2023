import styles from './MaterialsHeader.module.scss'

export default function MaterialsHeader() {
    return (
        <header className={styles.header}>
            <div className={styles.gradient}></div>
            <h1 className={styles.title}>Landscape Materials</h1>
        </header>
    )
}
