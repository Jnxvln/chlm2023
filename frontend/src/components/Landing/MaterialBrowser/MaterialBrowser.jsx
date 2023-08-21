import styles from './MaterialBrowser.module.scss'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Galleria } from 'primereact/galleria'
import { useQuery } from '@tanstack/react-query'
import { getActiveMaterials } from '../../../api/materials/materialsApi'
import MaterialBrowserItem from './MaterialBrowserItem/MaterialBrowserItem'

export default function MaterialBrowser() {
   const navigate = useNavigate()

   const [images, setImages] = useState(null)

   const materials = useQuery({
      queryKey: ['materials'],
      queryFn: getActiveMaterials,
      onSuccess: (data) => {
         console.log('[MaterialBrowser.jsx] Active Materials: ')
         console.log(data)
         let _images = []
         for (let i = 0; i < data.length; i++) {
            if (data[i].isFeatured) {
               _images.push(data[i].image)
            }
         }
         setImages(_images)
      },
   })

   const itemTemplate = (item) => {
      return <img src={item} alt="" className={styles.materialItemTemplate} />
   }

   const thumbnailTemplate = (item) => {
      return <img src={item} alt="" className={styles.materialItemTemplate} />
   }

   return (
      <section className={styles.sectionContainer}>
         {/* <div className={styles.backgroundContainer}>
            <div className={styles.backgroundOverlay}></div>
         </div> */}

         <article className={styles.article}>
            <div>
               <h1 className={styles.title}>Featured Materials</h1>
               <div className={styles.carouselContainer}>
                  <Galleria
                     value={images}
                     numVisible={5}
                     //  circular
                     showItemNavigators
                     showThumbnails={false}
                     item={itemTemplate}
                     thumbnail={thumbnailTemplate}
                  />
               </div>
            </div>

            <div className={styles.infoContainer}>
               {/* <h2 className={styles.categoryTitle}>Soil</h2> */}

               <div className={styles.materialsButtonContainer}>
                  <Button
                     type="button"
                     onClick={() => navigate('/materials')}
                     className="viewMatsBtn"
                  >
                     View All Materials
                  </Button>
               </div>
            </div>
         </article>
      </section>
   )
}
