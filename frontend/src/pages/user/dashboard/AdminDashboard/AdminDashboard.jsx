import styles from './AdminDashboard.module.scss'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
// PrimeReact Components
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
// Data
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { fetchUser } from '../../../../api/users/usersApi'
import {
    getStoreSettings,
    createStoreSettings,
    updateStoreSettings,
} from '../../../../api/storeSettings/storeSettingsApi'

export default function AdminDashboard() {
    // #region VARS ==========================================================
    const queryClient = useQueryClient()
    const [menuItemSelected, setMenuItemSelected] = useState(null)
    const [hoursForm, setHoursForm] = useState({
        monFriHours: '',
        saturdayHours: '',
        sundayHours: '',
    })
    const [hoursEmpty, setHoursEmpty] = useState([])

    // State data vars
    const user = useQuery(['user'], fetchUser)

    const storeSettings = useQuery({
        queryKey: ['storesettings'],
        queryFn: () => getStoreSettings(user.data.token),
        enabled: !!user?.data?._id,
        onSuccess: (storeSettings) => {
            setHoursForm((prevState) => ({
                ...prevState,
                monFriHours: storeSettings.operatingHours.monFri.hours,
                saturdayHours: storeSettings.operatingHours.saturday.hours,
                sundayHours: storeSettings.operatingHours.sunday.hours,
            }))
        },
        onError: (err) => {
            console.log(err)
            const msg = 'Error fetching store settings'
            toast.error(msg, { autoClose: 5000 })
        },
    })

    const updateStoreSettingsMutation = useMutation({
        mutationKey: ['storesettings'],
        mutationFn: () => {
            // Aggregate data
            let aggData = {
                _id: storeSettings.data._id,
                // siteMessages: [],
                operatingHours: {
                    monFri: {
                        hours: hoursForm.monFriHours,
                    },
                    saturday: {
                        hours: hoursForm.saturdayHours,
                    },
                    sunday: {
                        hours: hoursForm.sundayHours,
                    },
                },
                storeOpen: {
                    status: true,
                },
            }

            return updateStoreSettings(aggData, user?.data?.token)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['storesettings'])
            toast.success('Settings updated!', { autoClose: 2000 })
        },
        onError: (err) => {
            console.log(err)
            const msg = 'Error updating store settings'
            toast.error(msg, { autoClose: 5000 })
        },
    })
    // #endregion

    // #region TEMPLATES
    const dateStartTemplate = (rowData) => {
        return <div>{dayjs(rowData.dateStart).format('MM/DD/YY')}</div>
    }

    const dateEndTemplate = (rowData) => {
        return <div>{dayjs(rowData.dateEnd).format('MM/DD/YY')}</div>
    }
    // #endregion

    // #region EVENT HANDLERS ================================================

    const removeActiveMenuSelections = () => {
        const els = document.querySelectorAll('.activeAdminMenuItem')
        for (let i = 0; i < els.length; i++) {
            els[i].classList.remove('activeAdminMenuItem')
        }
    }

    const onMenuItemSelected = (e, settingName) => {
        const _target = e.target
        removeActiveMenuSelections()
        _target.classList.add('activeAdminMenuItem')
        setMenuItemSelected(settingName)
    }

    const onHoursChange = (e) => {
        setHoursForm((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmitHours = (e) => {
        e.preventDefault()

        // Reset the empties
        setHoursEmpty([])

        if (hoursForm.monFriHours === '') {
            setHoursEmpty((prevState) => [...prevState, 'Mon - Fri'])
        }
        if (hoursForm.saturdayHours === '') {
            setHoursEmpty((prevState) => [...prevState, 'Saturday'])
        }
        if (hoursForm.sundayHours === '') {
            setHoursEmpty((prevState) => [...prevState, 'Sunday'])
        }

        console.log('[AdminDashboard onSubmitHours] attempting to save...')

        updateStoreSettingsMutation.mutate()
    }
    // #endregion

    useEffect(() => {
        if (menuItemSelected) {
            switch (menuItemSelected) {
                case 'messages':
                    // Handle active menuitem class
                    document
                        .getElementById('menuitem_Messages')
                        .classList.add('activeMenuItem')
                    document
                        .getElementById('menuitem_Hours')
                        .classList.remove('activeMenuItem')
                    document
                        .getElementById('menuitem_Profile')
                        .classList.remove('activeMenuItem')

                    // Handle active admin panel
                    document.getElementById('panelSiteMessages').style.display =
                        'block'
                    document.getElementById(
                        'panelOperatingHours'
                    ).style.display = 'none'
                    document.getElementById('panelUserProfile').style.display =
                        'none'
                    break
                case 'hours':
                    // Handle active menuitem class
                    document
                        .getElementById('menuitem_Messages')
                        .classList.remove('activeMenuItem')
                    document
                        .getElementById('menuitem_Hours')
                        .classList.add('activeMenuItem')
                    document
                        .getElementById('menuitem_Profile')
                        .classList.remove('activeMenuItem')

                    // Handle active admin panel
                    document.getElementById('panelSiteMessages').style.display =
                        'none'
                    document.getElementById(
                        'panelOperatingHours'
                    ).style.display = 'block'
                    document.getElementById('panelUserProfile').style.display =
                        'none'
                    break
                case 'profile':
                    // Handle active menuitem class
                    document
                        .getElementById('menuitem_Messages')
                        .classList.remove('activeMenuItem')
                    document
                        .getElementById('menuitem_Hours')
                        .classList.remove('activeMenuItem')
                    document
                        .getElementById('menuitem_Profile')
                        .classList.add('activeMenuItem')

                    // Handle active admin panel
                    document.getElementById('panelSiteMessages').style.display =
                        'none'
                    document.getElementById(
                        'panelOperatingHours'
                    ).style.display = 'none'
                    document.getElementById('panelUserProfile').style.display =
                        'block'
                    break
            }
        }
    }, [menuItemSelected])

    useEffect(() => {
        if (storeSettings && storeSettings.data) {
            console.log(
                '[AdminDashboard useEffect load store settings] storeSettings: '
            )
            console.log(storeSettings.data)
        }
    }, [storeSettings.data])

    return (
        <div>
            <div className={styles.adminPanelWrapper}>
                {/* ADMIN CONTROLS PANEL */}
                <div className={styles.adminPanel}>
                    {/* STORE SETTINGS */}
                    <div className={styles.settingsSubtitle}>
                        Store Settings
                    </div>
                    <div className={styles.storeSettingsWrapper}>
                        <div
                            id="menuitem_Messages"
                            className={styles.settingName}
                            onClick={(e) => onMenuItemSelected(e, 'messages')}
                        >
                            Site Messages
                        </div>
                        <div
                            id="menuitem_Hours"
                            className={styles.settingName}
                            onClick={(e) => onMenuItemSelected(e, 'hours')}
                        >
                            Operating Hours
                        </div>
                        <div className={styles.storeOpenClosedWrapper}>
                            <div
                                className={`${styles.settingName} ${styles.lastSettingName} ${styles.settingNoHover}`}
                            >
                                Store Open/Closed
                            </div>
                            <div>(----)</div>
                        </div>
                        <div>
                            <input type="textarea" rows="5" cols="10" />
                        </div>
                    </div>

                    {/* USER SETTINGS */}
                    <div className={styles.settingsSubtitle}>
                        Store Settings
                    </div>
                    <div className={styles.userSettingsWrapper}>
                        <div
                            id="menuitem_Profile"
                            className={styles.settingName}
                            onClick={(e) => onMenuItemSelected(e, 'profile')}
                        >
                            User Profile
                        </div>
                        <div className={styles.autoCapInputWrapper}>
                            <div
                                className={`${styles.settingName} ${styles.settingNoHover}`}
                            >
                                Auto-Cap Input
                            </div>
                            <div>(----)</div>
                        </div>
                    </div>
                </div>

                {/* ADMIN CONTENT PANEL */}
                <div className={styles.adminContentPanel}>
                    {/* Site Messages Section */}
                    <section
                        id="panelSiteMessages"
                        className={`${styles.panelSiteMessages}`}
                    >
                        <h3>Site Messages</h3>

                        <DataTable
                            value={storeSettings?.data?.siteMessages}
                            loading={storeSettings.loading}
                        >
                            <Column header="Message" field="message" />
                            <Column
                                header="Date Start"
                                field="dateStart"
                                body={dateStartTemplate}
                            />
                            <Column
                                header="Date End"
                                field="dateEnd"
                                body={dateEndTemplate}
                            />
                            <Column header="Page" field="page" />
                            <Column header="Created" field="createdBy" />
                            <Column header="Updated" field="updatedBy" />
                            <Column header="Active" field="isActive" />
                        </DataTable>
                    </section>

                    {/* Operating Hours Section */}
                    <section
                        id="panelOperatingHours"
                        className={`${styles.panelOperatingHours}`}
                    >
                        <h3>Operating Hours</h3>
                        {hoursEmpty && hoursEmpty.length > 0 && (
                            <div className={styles.warningEmptyHours}>
                                <Message
                                    severity="warn"
                                    text={() => {
                                        {
                                            return (
                                                hoursEmpty &&
                                                hoursEmpty.map((el, index) => (
                                                    <div key={index}>
                                                        <strong>{el}</strong> is
                                                        empty
                                                    </div>
                                                ))
                                            )
                                        }
                                    }}
                                />
                            </div>
                        )}

                        <form onSubmit={onSubmitHours}>
                            {/* Mon - Fri Hours */}
                            <div className="field">
                                <span className="p-float-label">
                                    <InputText
                                        id="monFriHours"
                                        name="monFriHours"
                                        value={hoursForm.monFriHours}
                                        onChange={onHoursChange}
                                    />
                                    <label htmlFor="monFriHours">
                                        Mon - Fri
                                    </label>
                                </span>
                            </div>

                            {/* Saturday Hours */}
                            <div className="field">
                                <span className="p-float-label">
                                    <InputText
                                        id="saturdayHours"
                                        name="saturdayHours"
                                        value={hoursForm.saturdayHours}
                                        onChange={onHoursChange}
                                    />
                                    <label htmlFor="saturdayHours">
                                        Saturday
                                    </label>
                                </span>
                            </div>

                            {/* Sunday Hours */}
                            <div className="field">
                                <span className="p-float-label">
                                    <InputText
                                        id="sundayHours"
                                        name="sundayHours"
                                        value={hoursForm.sundayHours}
                                        onChange={onHoursChange}
                                    />
                                    <label htmlFor="sundayHours">Sunday</label>
                                </span>
                            </div>

                            {/* Submit Button */}
                            <div className="field">
                                <Button type="submit">Save</Button>
                            </div>
                        </form>
                    </section>

                    {/* User Profile Section */}
                    <section
                        id="panelUserProfile"
                        className={`${styles.panelUserProfile}`}
                    >
                        <h3>User Profile</h3>
                    </section>
                </div>
            </div>
        </div>
    )
}
