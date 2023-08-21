import styles from './Help.module.scss'
import { useState, useEffect } from 'react'
import { AutoComplete } from 'primereact/autocomplete'
import { Link } from 'react-router-dom'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { toast } from 'react-toastify'
import BulkPile from '../../assets/images/help/bulk-pile.png'
import Forklift from '../../assets/images/help/forklift.png'
import PalletStone from '../../assets/images/help/pallet-stone.png'
import SkidSteer from '../../assets/images/help/skidsteer.png'
import DecorDivider from '../../components/DecorDivider'
import { useQuery } from '@tanstack/react-query'
import { getActiveFaqs } from '../../api/faqs/faqsApi'
import { getStoreSettings } from '../../api/storeSettings/storeSettingsApi'

export default function Help() {
   // #region VARS =============================================================
   const [scrollY, setScrollY] = useState(0)

   // const mainContainer = document.getElementById('main-container')

   const [coverageFlagstone] = useState([
      {
         id: 1,
         thickness: `2" - 2.5"`,
         coverage: `70 - 80 sqft/ton`,
      },
      {
         id: 2,
         thickness: `1" - 1.5"`,
         coverage: `110 - 125 sqft/ton`,
      },
      {
         id: 3,
         thickness: `1/2" - 3/4"`,
         coverage: `130 - 150 sqft/ton`,
      },
   ])

   const [coverageChoppedStone] = useState([
      {
         id: 1,
         size: `4"x4"`,
         placement: 'with mortar',
         squareFeet: `40 sqft/ton`,
         linearFeet: `100+ ft/ton`,
      },
      {
         id: 2,
         size: `4"x4"`,
         placement: 'dry stack',
         squareFeet: `35 sqft/ton`,
         linearFeet: ``,
      },
      {
         id: 3,
         size: `4"x6"`,
         placement: 'with mortar',
         squareFeet: `35 sqft/ton`,
         linearFeet: `60+ ft/ton`,
      },
      {
         id: 4,
         size: `4"x6"`,
         placement: 'dry stack',
         squareFeet: `30 sqft/ton`,
         linearFeet: ``,
      },
      {
         id: 5,
         size: `4"x8"`,
         placement: 'with mortar',
         squareFeet: `30 sqft/ton`,
         linearFeet: `35+ fr/ton`,
      },
      {
         id: 6,
         size: `4"x8"`,
         placement: 'dry stack',
         squareFeet: `25 sqft/ton`,
         linearFeet: ``,
      },
   ])

   const [coverageRiverRock] = useState([
      {
         id: 1,
         thickness: `2" - 3"`,
         coverage: `35 - 40 sqft/ton`,
      },
      {
         id: 2,
         thickness: `4" - 8"`,
         coverage: '110 - 125 sqft/ton',
      },
   ])

   const [coverageWaterfall] = useState([
      {
         id: 1,
         thickness: `1" - 3"`,
         coverage: '75 sqft/ton',
      },
      {
         id: 2,
         thickness: `4" - 8"`,
         coverage: '35-40 sqft/ton',
      },
   ])

   // const [search, setSearch] = useState('')

   const [selectedFaq, setSelectedFaq] = useState(null)

   const [filteredFaqs, setFilteredFaqs] = useState([])

   // REACT QUERY VARS

   const activeFaqs = useQuery({
      queryKey: ['faq'],
      queryFn: () => getActiveFaqs(),
      onSuccess: (faqs) => {
         console.log('[Help.jsx activeFaqs] value: ')
         console.log(faqs)
      },
      onError: (err) => {
         console.log('Error fetching FAQs: ')
         console.log(err)
         toast.error(err.message, { autoClose: 5000 })
      },
   })

   const settings = useQuery({
      queryKey: ['storesettings'],
      queryFn: () => getStoreSettings(),
      onError: (err) => {
         console.log(err)
         const msg = err.message
         toast.error(msg, { autoClose: 5000 })
      },
   })

   // #endregion

   // #region EVENT HANDLERS ====================================================
   const onToTop = (e) => {
      window.scrollTo(0, 0)
   }

   const searchFaqs = (event) => {
      let _filteredFaqs

      // console.log('event query: ')
      // console.log(event.query)

      if (!event.query.trim().length) {
         _filteredFaqs = [...activeFaqs.data]
      } else {
         _filteredFaqs = activeFaqs.data.filter((question) => {
            if (
               settings &&
               settings.data &&
               !settings.data.advertiseDeliveries
            ) {
               return (
                  question.question
                     .toLowerCase()
                     .includes(event.query.toLowerCase()) &&
                  !question.categories.includes('delivery')
               )
            } else {
               return question.question
                  .toLowerCase()
                  .includes(event.query.toLowerCase())
            }
         })

         //  if (settings && settings.data && !settings.data.advertiseDeliveries) {
         //     console.log(
         //        '[Help.jsx searchFaqs()] Not advertising deliveries, filtering out...'
         //     )

         //     const faqsNoDlv = activeFaqs.data.filter((question) => {
         //         return questionquestion.question
         //            .toLowerCase()
         //            .includes(event.query.toLowerCase())
         //      })

         //     console.log('NOT ADV DLV FAQs: ')
         //     console.log(faqsNoDlv)
         //     return faqsNoDlv
         //  }
      }

      // console.log('Filtered faqs: ')
      // console.log(_filteredFaqs)

      setFilteredFaqs(_filteredFaqs)
   }

   // Track scroll Y position
   window.addEventListener('scroll', () => setScrollY(window.scrollY))

   // #endregion

   useEffect(() => {
      if (selectedFaq) {
         console.log('Selected FAQ: ')
         console.log(selectedFaq)
      }
   }, [selectedFaq])

   return (
      <section className={styles.mainSection} id="main-container">
         <div className={styles.upButtonWrapper}>
            <Button
               label="Top"
               icon="pi pi-arrow-up"
               iconPos="left"
               onClick={onToTop}
               className={`${styles.upArrowButton} ${
                  scrollY <= 50 && styles.upArrowButtonInvisible
               }`}
            />
         </div>

         {/* Page Header */}
         <header className={styles.header}>
            <div className={styles.headerOverlay}></div>
            <div className={styles.headerBackgroundImage}></div>
            <h1 className={styles.title}>Help</h1>
         </header>

         {/* Question Bar */}
         <div className={styles.questionBar}>
            <div className={styles.helpSearchWrapper}>
               <AutoComplete
                  value={selectedFaq}
                  suggestions={filteredFaqs}
                  completeMethod={searchFaqs}
                  field="question"
                  onChange={(e) => setSelectedFaq(e.value)}
                  placeholder="Search our Q&A"
                  id="helpSearch"
                  className={styles.helpSearch}
                  dropdown
               />
               <Button
                  icon="pi pi-trash"
                  size="large"
                  className={styles.clearSearchButton}
                  onClick={() => setSelectedFaq(null)}
               />
            </div>
         </div>

         {/* Response Area */}
         <div className={styles.responseArea}>
            {selectedFaq && (
               <div>
                  <div className={styles.displayQuestion}>
                     {selectedFaq.question}
                  </div>
                  <br />
                  <div className={styles.displayAnswer}>
                     {selectedFaq.answer}
                  </div>

                  <br />

                  {/* URLs */}
                  <strong>Related Links: </strong>
                  <div className={styles.relatedLinks}>
                     {selectedFaq &&
                        selectedFaq.urls &&
                        selectedFaq.urls.length > 0 &&
                        selectedFaq.urls.map((link, index) => (
                           <div key={index} className={styles.helpRelatedLink}>
                              <a
                                 href={link.url}
                                 target={link.isExternal ? '_blank' : ''}
                                 rel={link.isExternal ? 'noopener' : ''}
                              >
                                 {link.text}
                              </a>
                           </div>
                        ))}
                  </div>
               </div>
            )}
         </div>

         {/* GENERAL INFORMATION SECTION*/}
         <a id="general"></a>
         <section className={styles.generalInformationSection}>
            <header className={styles.generalInfoHeader}>
               <div className={styles.generalInfoBackground}></div>
               <div className={styles.generalInfoOverlay}></div>
               <div className={styles.generalInfoTitle}>
                  <h2>General Information</h2>
               </div>
            </header>
            <div className={styles.callForPricing}>Call For Pricing</div>

            <h1 className={styles.sectionTitle}>TYPES OF MATERIALS</h1>

            {/* [FLEX PARENT] Material Types Graphics */}
            <div className="flex justify-content-evenly flex-wrap">
               {/* Bulk Graphic */}
               <div className={styles.materialTypeBulk}>
                  <div className={styles.bulkImageWrapper}>
                     <img
                        src={BulkPile}
                        alt="Pile of loose gravel"
                        className={styles.bulkImage}
                     />
                  </div>
                  <h3 className={styles.materialTypeTitle}>Bulk (Loose)</h3>
                  <div className="flex justify-content-evenly">
                     <div>
                        <div className={styles.materialTypeName}>Topsoil</div>
                        <div className={styles.materialTypeName}>Compost</div>
                        <div className={styles.materialTypeName}>
                           Craig's Mix
                        </div>
                     </div>
                     <div>
                        <div className={styles.materialTypeName}>Sand</div>
                        <div className={styles.materialTypeName}>Mulch</div>
                        <div className={styles.materialTypeName}>Gravel</div>
                     </div>
                  </div>

                  {/* Loads with */}
                  <div className={styles.loaderWrapper}>
                     <div className={styles.loadedWithText}>Loaded with</div>
                     <div className={styles.loaderImageWrapper}>
                        <img
                           src={SkidSteer}
                           alt="Skid-Steer"
                           className={styles.loaderImage}
                        />
                     </div>
                     <div className={styles.loaderName}>Skid-Steer</div>
                  </div>
               </div>

               {/* Pallet Graphic */}
               <div className={styles.materialTypePallets}>
                  <div className={styles.bulkImageWrapper}>
                     <img
                        src={PalletStone}
                        alt="Pallet image"
                        className={styles.palletImage}
                     />
                  </div>
                  <h3 className={styles.materialTypeTitle}>Pallets</h3>
                  <div className="flex justify-content-between">
                     <div>
                        <div className={styles.materialTypeName}>Flagstone</div>
                        <div className={styles.materialTypeName}>
                           Chopped Stone
                        </div>
                        <div className={styles.materialTypeName}>
                           Creek Rock
                        </div>
                     </div>
                     <div>
                        <div className={styles.materialTypeName}>Boulders</div>
                        <div className={styles.materialTypeName}>
                           Field Stone
                        </div>
                     </div>
                  </div>

                  {/* Loads with */}
                  <div className={styles.loaderWrapper}>
                     <div className={styles.loadedWithText}>Loaded with</div>
                     <div className={styles.loaderImageWrapper}>
                        <img
                           src={Forklift}
                           alt="Forklift"
                           className={styles.forkliftImage}
                        />
                     </div>
                     <div className={styles.loaderName}>Forklift</div>
                  </div>
               </div>
            </div>
         </section>

         {/* APPROXIMATE WEIGHTS SECTION */}
         <a id="weights"></a>
         <section className={styles.weightsSection}>
            <header>
               <h1
                  className={`${styles.sectionTitle} ${styles.weightSectionTitle}`}
               >
                  APPROXIMATE WEIGHTS
               </h1>
               <div className={styles.heavierWhenWet}>
                  Many materials are heavier when wet
               </div>
            </header>

            <br />
            <br />

            {/* Flex parent */}
            <div className={styles.weightsParent}>
               {/* BULK */}
               <div className={styles.weightsBulkSection}>
                  <h3
                     className={styles.materialTypeTitle}
                     style={{ textAlign: 'left' }}
                  >
                     Bulk (Loose)
                  </h3>

                  {/* 2,800 lbs */}
                  <div className={styles.bulkWeightsList}>
                     <div>Topsoil</div>
                     <div>Sand</div>
                     <div>Blue Fines</div>
                     <div>Crushed Granite</div>
                     <div>
                        Blue SB2{' '}
                        <span style={{ fontWeight: 'normal' }}>(Driveway)</span>
                     </div>
                     <div>
                        AR Class 7{' '}
                        <span style={{ fontWeight: 'normal' }}>(Driveway)</span>
                     </div>
                     <div className={styles.weightsTotal}>
                        2,800 lbs per yard
                     </div>
                     <div className={styles.lbsPerScoop}>
                        (1,400 lbs per scoop)
                     </div>
                  </div>

                  <DecorDivider />

                  {/* 2,600 lbs - Washed Gravel */}
                  <div className={styles.bulkWeightsList}>
                     <div>Washed Gravel</div>
                     <div className={styles.weightsTotal}>
                        2,600 lbs per yard
                     </div>
                     <div className={styles.lbsPerScoop}>
                        (1,300 lbs per scoop)
                     </div>
                  </div>

                  <DecorDivider />

                  {/* 2,600 lbs - Premium Compost */}
                  <div className={styles.bulkWeightsList}>
                     <div>Premium Compost</div>
                     <div className={styles.weightsTotal}>
                        1,300 lbs per yard
                     </div>
                     <div className={styles.lbsPerScoop}>
                        (650 lbs per scoop)
                     </div>
                  </div>

                  <DecorDivider />

                  {/* 1,750 lbs - Mixes */}
                  <div className={styles.bulkWeightsList}>
                     <div>Special Blend (70/30 Mix)</div>
                     <div>Craig's Mix</div>
                     <div className={styles.weightsTotal}>
                        1,750 lbs per yard
                     </div>
                     <div className={styles.lbsPerScoop}>
                        (875 lbs per scoop)
                     </div>
                  </div>

                  <DecorDivider />

                  {/* 700 lbs - Mulch */}
                  <div className={styles.bulkWeightsList}>
                     <div>Mulch</div>
                     <div className={styles.weightsTotal}>700 lbs per yard</div>
                     <div className={styles.lbsPerScoop}>
                        (350 lbs per scoop)
                     </div>
                  </div>
               </div>

               {/* PALLETS */}
               <div className={styles.weightsPalletSection}>
                  <h3
                     className={styles.materialTypeTitle}
                     style={{ textAlign: 'left' }}
                  >
                     Pallets
                  </h3>
                  <div>
                     <strong>2,500lbs - 4,200lbs per pallet</strong>
                  </div>
                  <p className={styles.weightsParagraph}>
                     Pallet weights vary greatly; thinner flagstone, like 1” and
                     1”minus tend to weigh less, around 2,500lbs - 3,500lbs.
                  </p>
                  <p className={styles.weightsParagraph}>
                     1.5” and 2” flagstone, and most creek rock and fieldstone
                     pallets tend to run 3,500lbs - 4,000lbs. Chopped stone can
                     be even heavier, usually 3,700lbs - 4,300lbs.
                  </p>
               </div>
            </div>
         </section>

         {/* APPROXIMATE COVERAGE SECTION */}
         <a id="coverage"></a>
         <section className={styles.coverageSection}>
            <header>
               <h1 className={`${styles.sectionTitle}`}>
                  APPROXIMATE COVERAGES
               </h1>
            </header>

            {/* STONE (PALLETS) =================================================== */}
            <div className={styles.stoneSection}>
               <h2 className={styles.coverageSectionTitle}>
                  STONE COVERAGE (Pallets)
               </h2>
               <div className={styles.coverageDivider}></div>

               <div className={styles.coverageSubTitle}>
                  FLAGSTONE <span className={styles.perTon}>(PER TON)</span>
               </div>

               <DataTable
                  value={coverageFlagstone}
                  size="small"
                  scrollable
                  scrollHeight="400px"
                  showGridlines
                  stripedRows
               >
                  <Column field="thickness" header="Thickness" />
                  <Column field="coverage" header="Coverage" />
               </DataTable>

               <br />

               <div className={styles.coverageSubTitle}>
                  CHOPPED STONE <span className={styles.perTon}>(PER TON)</span>
               </div>

               <DataTable
                  value={coverageChoppedStone}
                  size="small"
                  scrollable
                  showGridlines
                  stripedRows
               >
                  <Column field="size" header="Size" />
                  <Column field="placement" header="Placement" />
                  <Column field="squareFeet" header="Square Feet" />
                  <Column field="linearFeet" header="Linear Feet" />
               </DataTable>

               <br />
               <br />

               {/* ROCK ============================================================== */}

               <h2 className={styles.coverageSectionTitle}>
                  ROCK COVERAGE (Pallets)
               </h2>
               <div className={styles.coverageDivider}></div>

               <br />

               <div className={styles.coverageSubTitle}>
                  RIVER ROCK <span className={styles.perTon}>(PER TON)</span>
               </div>

               {/* River Rock */}
               <DataTable
                  value={coverageRiverRock}
                  size="small"
                  scrollable
                  showGridlines
                  stripedRows
               >
                  <Column field="thickness" header="Thickness" />
                  <Column field="coverage" header="Coverage" />
               </DataTable>

               <br />

               <div className={styles.coverageSubTitle}>
                  WATERFALL ROCK{' '}
                  <span className={styles.perTon}>(PER TON)</span>
               </div>

               {/* Waterfall Rock */}
               <DataTable
                  value={coverageWaterfall}
                  size="small"
                  scrollable
                  showGridlines
                  stripedRows
               >
                  <Column field="thickness" header="Thickness" />
                  <Column field="coverage" header="Coverage" />
               </DataTable>

               <br />

               <div className={styles.coverageSubTitle}>
                  SMALL FLAT CREEK ROCK{' '}
                  <span className={styles.perTon}>(PER TON)</span>
               </div>

               <p>About 100 - 110 sqft/ton</p>

               <br />

               {/* BULK MATERIALS */}
               <h2 className={styles.coverageSectionTitle}>
                  BULK MATERIALS COVERAGE
               </h2>
               <div className={styles.coverageDivider}></div>

               <br />

               <div className={styles.coverageSubTitle}>
                  1” - 1.5” ROCK, SOIL, SAND, COMPOST, & MULCH{' '}
                  <span className={styles.perTon}>(PER TON)</span>
               </div>

               <p>
                  1 cubic yard roughly covers a 10' x 16' area at 2" deep (about
                  the size of a parking space)
               </p>

               <div className={styles.bulkRectangleWrapper}>
                  <svg
                     version="1.1"
                     width="300"
                     height="200"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <text x="40%" y="10%" fill="#B78B19" fontWeight="bold">
                        16 ft
                     </text>

                     <text x="0" y="50%" fill="#B78B19" fontWeight="bold">
                        10 ft
                     </text>

                     <rect
                        width="230"
                        height="150"
                        x={45}
                        y={25}
                        fill="#4685A9"
                     />
                  </svg>
                  <div className={styles.smallText}>
                     1 cu yd = approx. 10’ x 16’ at 2” deep
                  </div>

                  {/* <a href="/calculator">Try Bulk Material Calculator</a> */}
                  <br />
                  <div className={styles.calculatorLinkWrapper}>
                     <Link to="/calculator" className={styles.calculatorLink}>
                        Try Bulk Material Calculator
                     </Link>
                  </div>

                  <br />

                  <div className={styles.coverageSubTitle}>
                     COVERAGE FORMULA
                  </div>
                  <p>
                     For <strong>square</strong> and <strong>rectangle</strong>{' '}
                     shaped projects, you can use the following formula to
                     approximate how much you need:
                  </p>

                  {/* Coverage Formula */}
                  <div>
                     <svg
                        version="1.1"
                        width="300"
                        height="100"
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.coverageFormulaSVG}
                     >
                        <text x={15} y={20}>
                           Length' x Width' x Depth"
                        </text>
                        <line
                           width={100}
                           x1={5}
                           x2={225}
                           y1={30}
                           y2={30}
                           stroke="black"
                        />
                        <text x={100} y={50}>
                           324
                        </text>

                        <text x={15} y={90} fontSize={18}>
                           =
                        </text>

                        <text x={40} y={90} fontSize={16}>
                           cubic yards (approx.)
                        </text>
                     </svg>

                     <div className={styles.bulkFormulaDisclaimer}>
                        NOTE: Length and Width must be in <strong>feet</strong>.
                        Depth must be in <strong>inches.</strong>
                     </div>

                     <div className={styles.messageTryCalculator}>
                        For other shapes, or if you don’t want to figure
                        manually,{' '}
                        <Link
                           to="/calculator"
                           className={styles.messageTryCalculatorLink}
                        >
                           try our online cubic yards calculator.
                        </Link>
                     </div>
                  </div>

                  <div className={styles.coverageSubTitle}>FOR LARGER ROCK</div>
                  <div>
                     The best we can do is use the same formula (or the
                     calculator) and add an additional 1/2yd - 1yd. Basically,
                     the larger the material, the lesser the square-foot
                     coverage.
                  </div>
               </div>
            </div>
         </section>

         {/* LOADING INFO */}
         <a id="loading"></a>
         <section className={styles.loadingInfoSection}>
            <header>
               <h1 className={`${styles.sectionTitle}`}>LOADING INFO</h1>
            </header>

            <div className={styles.loadingInfoSubsection}>
               <div className={styles.loadingSectionSubtitle}>
                  PICKUP TRUCKS
               </div>

               {/* 1/2 TON TRUCKS */}
               <div className={styles.coverageSubTitle}>1/2-Ton Pickups</div>

               <div>
                  We can usually load a 1/2 yard of our heavy materials
                  (topsoil, sand, and gravels) into the bed, or usually 1 yard
                  of the lighter materials (compost and mulch.) Low-pressure
                  tires carry less and are potentially dangerous.
               </div>

               {/* 3/4 - 1 TON TRUCKS */}
               <div className={styles.coverageSubTitle}>
                  3/4-Ton and 1-Ton Trucks
               </div>

               <div>
                  We can usually load 1 yard of our heavy materials (topsoil,
                  sand, and gravels) into the bed, or 1.5 to 2 yards of the
                  lighter materials (compost and mulch.) Low-pressure tires
                  carry less and are potentially dangerous.
               </div>

               <br />
               <br />

               {/* TRAILERS     */}
               <div className={styles.loadingSectionSubtitle}>TRAILERS</div>

               <div>
                  The amount we'll load may depend on several factors: the
                  number of axles your trailer has, the length of your trailer,
                  the condition of your tires, and whether or not you bring a
                  tarp or have sides you can put on your trailer (to contain
                  loose materials.) Low-pressure tires carry less and could be
                  potentially dangerous.
               </div>

               <div className={styles.coverageSubTitle}>AXELS & WEIGHT</div>

               <div>
                  Typical trailer axles are rated to carry about 3,500 lbs per
                  axle (7,000 lbs total for trailers with two axles, also called
                  dual axle or tandem axle.)
               </div>
               <br />
               <div>
                  Check the weights section above to find out how heavy the
                  material is that you want to load onto your trailer.
               </div>

               <div className={styles.coverageSubTitle}>TARPS & SIDES</div>

               <div>
                  Please bring a tarp with straps OR put sides on your trailer
                  when you buy our bulk materials. This will help ensure you
                  don’t lose product while driving down the road, potentially
                  causing harm to other drivers!
               </div>

               <br />

               <div>
                  <strong>
                     <u>
                        We are not responsible for any material lost while
                        driving.
                     </u>{' '}
                     You also put others at risk on the road when you have
                     gravel or other material flying off the trailer. Please
                     tarp your load or put sides on your trailer before loading.
                  </strong>
               </div>
            </div>
         </section>
      </section>
   )
}
