import styles from './Bulletin.module.scss'
import BulletinArticle from './BulletinArticle/BulletinArticle'

export default function Bulletin() {
    return (
        <section className={styles.sectionContainer}>
            <h1 className={styles.title}>Bulletin</h1>
            <BulletinArticle
                title="Thanksgiving Hours"
                published="11/17/2022 6:17am"
                content="This is a bulletin post that is supposed to relay some kind of information. It should mostly be used for company-wide or site-wide alerts, pertaining to impactions regarding services rendered; holiday hours; updates; product availability issues; etc."
            />

            <BulletinArticle
                title="Closed Saturdays Until Spring"
                published="10/27/2022 12:09pm"
                content="Newer bulletin posts should appear at the top of the list.
                This is also a bulletin post, it is just slightly older.
                This post also should have relevant information to company
                logistics, impactions, and other considerations used to
                relay important, vital information to the general public."
            />
        </section>
    )
}
