import styles from './Bulletin.module.scss'
import BulletinArticle from './BulletinArticle/BulletinArticle'
import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import { getStoreSettings } from '../../../api/storeSettings/storeSettingsApi'
import dayjs from 'dayjs'

export default function Bulletin() {
    const settings = useQuery({
        queryKey: ['storesettings'],
        queryFn: () => getStoreSettings(),
        onSuccess: (_settings) => {
            console.log('[Bulletin.jsx settings]: ')
            console.log(_settings)
        },
        onError: (err) => {
            console.log(err)
            const msg = err.message
            toast.error(msg, { autoClose: 5000 })
        },
    })

    return (
        <section className={styles.sectionContainer}>
            <h1 className={styles.title}>Bulletin</h1>

            <br />

            {settings &&
                settings.data &&
                settings.data.siteMessages &&
                settings.data.siteMessages.length > 0 &&
                settings.data.siteMessages.map((msg) => {
                    if (msg.isActive && msg.page === '/') {
                        return (
                            <BulletinArticle
                                key={msg._id}
                                title={msg.title}
                                dateStart={dayjs(msg.dateStart).format(
                                    'MM/DD/YY'
                                )}
                                message={msg.message}
                            />
                        )
                    }
                })}

            {settings &&
                settings.data &&
                settings.data.siteMessages &&
                settings.data.siteMessages.length > 0 &&
                settings.data.siteMessages.every((msg) => !msg.isActive) && (
                    <div style={{ fontStyle: 'italic', textAlign: 'center' }}>
                        No messages at this time
                    </div>
                )}
        </section>
    )
}
