import styles from '../../../styles/pages/landing/Landing.module.scss'
import dayjs from 'dayjs'
import BulletinArticle from './BulletinArticle'
import Spinner from '../../layout/Spinner'
// Store data
import { getBulletinArticles } from '../../../api/bulletinArticles/bulletinArticlesApi'
import { useQuery, useQueryClient } from '@tanstack/react-query'

function BulletinArticleList() {
    const articles = useQuery({
        queryKey: ['bulletinArticles'],
        queryFn: () => getBulletinArticles(),
        onSuccess: (articles) => {
            console.log('[BulletinArticlesList] Articles fetched: ')
            console.log(articles)
        },
        onError: (err) => {
            console.log(err)
        },
    })

    return (
        <div>
            {articles.isFetching ? (
                <div style={{ textAlign: 'center' }}>
                    <Spinner />
                </div>
            ) : articles.data && articles.data.length > 0 ? (
                articles.data
                    .sort((a, b) => new Date(b.posted) - new Date(a.posted))
                    .map((article) => (
                        <BulletinArticle key={article._id} article={article} />
                    ))
            ) : (
                <div style={{ textAlign: 'center' }}>No articles found</div>
            )}
        </div>
    )
}

export default BulletinArticleList
