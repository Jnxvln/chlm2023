import styles from './BulletinArticle.module.scss'
export default function BulletinArticle({ title, published, content }) {
    return (
        <article className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            <h3 className={styles.published}>Posted: {published}</h3>
            <p className={styles.content}>{content}</p>
        </article>
    )
}
