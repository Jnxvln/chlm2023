import styles from '../../../styles/pages/landing/Landing.module.scss'
import BulletinArticleList from './BulletinArticleList'

function BulletinBoard() {
    return (
        <section className={styles['bulletin-board']}>
            <header className={styles['bulletin-header']}>
                <h1 className={styles['bulletin-title']}>Bulletin Board</h1>
            </header>
            <BulletinArticleList />
        </section>
    )
}

export default BulletinBoard
