import styles from './BulletinArticle.module.scss'
export default function BulletinArticle({ title, dateStart, message }) {
    return (
        <article className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            <h3 className={styles.dateStart}>Posted: {dateStart}</h3>
            <p className={styles.message}>{message}</p>
        </article>
    )
}
