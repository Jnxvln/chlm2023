import styles from '../../../styles/pages/landing/Landing.module.scss'
import dayjs from 'dayjs'

function BulletinArticle({ article }) {
    return (
        <article className={styles['bulletin-article']}>
            <header className={styles['bulletin-article-header']}>
                <h3 className={styles['bulletin-article-title']}>
                    {article.title}
                </h3>
                <div className={styles['bulletin-article-posted']}>
                    {article.showDate && (
                        <span className={styles['bulletin-article-showDate']}>
                            {dayjs(article.posted).format('MM/DD/YY')}
                        </span>
                    )}

                    {article.showTime && (
                        <span>{dayjs(article.posted).format('HH:mma')}</span>
                    )}
                </div>
            </header>
            <div className={styles['bulletin-article-content']}>
                {article.content}
            </div>
        </article>
    )
}

export default BulletinArticle
