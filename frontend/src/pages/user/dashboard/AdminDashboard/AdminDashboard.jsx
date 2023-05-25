import styles from './AdminDashboard.module.scss'
import { useState, useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
// PrimeReact Components
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputSwitch } from 'primereact/inputswitch'
import { InputTextarea } from 'primereact/inputtextarea'
import { ConfirmPopup } from 'primereact/confirmpopup' // To use <ConfirmPopup> tag
import { confirmPopup } from 'primereact/confirmpopup' // To use confirmPopup method
import { Calendar } from 'primereact/calendar'
import { Dialog } from 'primereact/dialog'
import { Checkbox } from 'primereact/checkbox'
// Data
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { fetchUser, getUsers, updateUser } from '../../../../api/users/usersApi'
import {
    getStoreSettings,
    updateStoreSettings,
} from '../../../../api/storeSettings/storeSettingsApi'

export default function AdminDashboard() {
    // #region VARS ==========================================================
    const queryClient = useQueryClient()
    const [siteMessageDialogVisible, setSiteMessageDialogVisible] =
        useState(false)
    const [userDialogVisible, setUserDialogVisible] = useState(null)
    const [menuItemSelected, setMenuItemSelected] = useState(null)
    const [hoursForm, setHoursForm] = useState({
        monFriHours: '',
        saturdayHours: '',
        sundayHours: '',
    })
    const [storeOpen, setStoreOpen] = useState(true)
    const [storeClosedReason, setStoreClosedReason] = useState('')
    const [allowUpdate, setAllowUpdate] = useState(false)
    const [allowUpdateUser, setAllowUpdateUser] = useState(false)

    const [hoursEmpty, setHoursEmpty] = useState([])
    const [settingsTemplate, setSettingsTemplate] = useState({
        siteMessages: [],
        operatingHours: {
            monFri: {
                hours: '',
            },
            saturday: {
                hours: '',
            },
            sunday: {
                hours: '',
            },
        },
        storeOpen: {
            status: true,
        },
        storeClosedReason: '',
    })
    const [siteMessageSelected, setSiteMessageSelected] = useState(null)
    // Input vars
    const [inputSiteMessagePage, setInputSiteMessagePage] = useState('')
    const [inputSiteMessageMessage, setInputSiteMessageMessage] = useState('')
    const [inputSiteMessageDateStart, setInputSiteMessageDateStart] =
        useState('')
    const [inputSiteMessageDateEnd, setInputSiteMessageDateEnd] = useState('')
    const [inputSiteMessageIsActive, setInputSiteMessageIsActive] =
        useState(true)
    const [inputUserFirstName, setInputUserFirstName] = useState('')
    const [inputUserLastName, setInputUserLastName] = useState('')
    const [inputUserEmail, setInputUserEmail] = useState('')
    const [userUpdateInfo, setUserUpdateInfo] = useState(null)
    // const [inputSiteMessage]

    // State data vars
    const user = useQuery(['user'], fetchUser)

    const users = useQuery({
        queryKey: ['users'],
        enabled: !!user?.data?.token,
        queryFn: () => getUsers(user.data.token),
        onError: (err) => {
            const msg = 'Error fetching users for Admin Dashboard'
            console.log(msg)
            console.error(err)
            toast.error(msg, { autoClose: 5000 })
        },
    })

    const storeSettings = useQuery({
        queryKey: ['storesettings'],
        queryFn: () => getStoreSettings(user.data.token),
        enabled: !!user?.data?._id,
        onSuccess: (_settings) => {
            setHoursForm((prevState) => ({
                ...prevState,
                monFriHours: _settings?.operatingHours?.monFri?.hours,
                saturdayHours: _settings?.operatingHours?.saturday?.hours,
                sundayHours: _settings?.operatingHours?.sunday?.hours,
            }))

            setSettingsTemplate(_settings)
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
            return updateStoreSettings(settingsTemplate, user?.data?.token)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['storesettings'])
            toast.success('Settings updated!', { autoClose: 1000 })
            setAllowUpdate(false)
        },
        onError: (err) => {
            console.log(err)
            const msg = 'Error updating store settings'
            toast.error(msg, { autoClose: 5000 })
        },
    })

    const updateUserMutation = useMutation({
        mutationKey: ['user'],
        mutationFn: () => updateUser(userUpdateInfo, user?.data?.token),
        onSuccess: (data) => {
            queryClient.invalidateQueries(['user'])
            toast.success('User updated!', { autoClose: 1000 })
            setAllowUpdateUser(false)
        },
        onError: (err) => {
            console.log(err)
            const msg = 'Cannot update user profile'
            toast.error(msg, { autoClose: 5000 })
        },
    })
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

        // console.log('[AdminDashboard onSubmitHours] attempting to save...')
        setAllowUpdate(true)
        setSettingsTemplate((prevState) => ({
            ...prevState,
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
        }))
    }

    const onDeleteSiteMessage = (rowData) => {
        let msgsToKeep = settingsTemplate.siteMessages.filter(
            (msg) => msg._id !== rowData._id
        )

        setAllowUpdate(true)
        setSettingsTemplate((prevState) => ({
            ...prevState,
            siteMessages: msgsToKeep,
        }))
    }

    const onSaveReasonClosed = (e) => {
        if (
            !settingsTemplate.storeClosedReason ||
            settingsTemplate.storeClosedReason.length <= 0
        ) {
            return alert("A reason isn't provided")
        }
        setAllowUpdate(true)
        setSettingsTemplate((prevState) => ({
            ...prevState,
            storeOpen: settingsTemplate.storeOpen,
            storeClosedReason: settingsTemplate.storeClosedReason,
        }))
    }

    const onToggleStoreOpen = (e) => {
        // console.log('[AdminDashboard onToggleStoreOpen] event: ')
        // console.log(e)
        setAllowUpdate(true)
        setSettingsTemplate((prevState) => ({
            ...prevState,
            storeOpen: e.target.value,
            storeClosedReason,
        }))
    }

    const onChangeStoreClosedReason = (e) => {
        setAllowUpdate(false)
        setSettingsTemplate((prevState) => ({
            ...prevState,
            storeClosedReason: e.target.value,
        }))
    }

    const onConfirmDeleteSiteMessage = (event, rowData) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => onDeleteSiteMessage(rowData),
            reject: () => {},
        })
    }

    const onSaveSiteMessageDialog = () => {
        // Update siteMessageSelected, then update settingsTemplate siteMessages, then save
        let newMessage = {
            ...siteMessageSelected,
            page: inputSiteMessagePage,
            message: inputSiteMessageMessage,
            dateStart: inputSiteMessageDateStart,
            dateEnd: inputSiteMessageDateEnd,
            isActive: inputSiteMessageIsActive,
        }

        let index = settingsTemplate.siteMessages.findIndex(
            (el) => el._id === newMessage._id
        )

        // console.log('INDEX: ')
        // console.log(index)

        // Message doesn't exist, create a new one
        if (index < 0) {
            settingsTemplate.siteMessages.push(newMessage)
        } else {
            // Update message
            settingsTemplate.siteMessages[index] = newMessage
        }

        // Trigger allowed update
        setAllowUpdate(true)
        setSettingsTemplate((prevState) => ({
            ...prevState,
        }))

        setSiteMessageDialogVisible(false)
    }

    const onSaveUserDialog = () => {
        // setAllowUpdate(true)

        setAllowUpdateUser(true)
        setUserUpdateInfo((prevState) => ({
            ...user.data,
            firstName: inputUserFirstName,
            lastName: inputUserLastName,
            email: inputUserEmail,
        }))

        setUserDialogVisible(false)
    }
    // #endregion

    // #region TEMPLATES =====================================================
    const siteMessageDialogFooter = (
        <div>
            <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={() => {
                    setInputSiteMessagePage('')
                    setInputSiteMessageMessage('')
                    setInputSiteMessageDateStart(null)
                    setInputSiteMessageDateEnd(null)
                    setSiteMessageDialogVisible(false)
                }}
                className="p-button-text"
            />
            <Button
                label="Save"
                icon="pi pi-check"
                onClick={onSaveSiteMessageDialog}
            />
        </div>
    )

    const userDialogFooter = (
        <div>
            <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={() => {
                    setInputUserFirstName('')
                    setInputUserLastName('')
                    setInputUserEmail('')
                    setUserDialogVisible(false)
                }}
                className="p-button-text"
            />
            <Button
                label="Save"
                icon="pi pi-check"
                onClick={onSaveUserDialog}
                autoFocus
            />
        </div>
    )

    const dateStartTemplate = (rowData) => {
        return <div>{dayjs(rowData.dateStart).format('MM/DD/YY')}</div>
    }

    const dateEndTemplate = (rowData) => {
        return <div>{dayjs(rowData.dateEnd).format('MM/DD/YY')}</div>
    }

    const createdByTemplate = (rowData) => {
        let _user = users?.data?.find((usr) => usr._id === rowData.createdBy)

        if (!_user) return

        return (
            <>
                {_user.firstName} {_user.lastName}
            </>
        )
    }

    const updatedByTemplate = (rowData) => {
        let _user = users?.data?.find((usr) => usr._id === rowData.updatedBy)

        if (!_user) return

        return (
            <>
                {_user.firstName} {_user.lastName}
            </>
        )
    }

    const isActiveTemplate = (rowData) => {
        return (
            <>
                {rowData.isActive ? (
                    <>
                        <i
                            className="pi pi-check"
                            style={{ fontWeight: 'bold', color: 'green' }}
                        />
                    </>
                ) : (
                    <></>
                )}
            </>
        )
    }

    const messagesActionTemplate = (rowData) => {
        return (
            <>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        icon="pi pi-pencil"
                        onClick={() => {
                            setSiteMessageSelected(rowData)
                            setSiteMessageDialogVisible(true)
                        }}
                    />
                    <Button
                        type="button"
                        icon="pi pi-times"
                        className="p-button-danger"
                        onClick={(e) => onConfirmDeleteSiteMessage(e, rowData)}
                    />
                </div>
            </>
        )
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
        if (allowUpdate && settingsTemplate) {
            updateStoreSettingsMutation.mutate()
        }
    }, [settingsTemplate, allowUpdate])

    useEffect(() => {
        if (storeOpen && storeClosedReason && storeClosedReason.length > 0) {
            // console.log('Clearing reason')
            setStoreClosedReason('')
        }
    }, [storeOpen])

    // Set siteMessageSelected for dialogs
    useEffect(() => {
        if (siteMessageSelected) {
            setInputSiteMessagePage(siteMessageSelected.page)
            setInputSiteMessageDateStart(
                new Date(siteMessageSelected.dateStart)
            )
            setInputSiteMessageDateEnd(new Date(siteMessageSelected.dateEnd))
            setInputSiteMessageMessage(siteMessageSelected.message)
            setInputSiteMessageIsActive(siteMessageSelected.isActive)
        }
    }, [siteMessageSelected])

    useEffect(() => {
        if (user && user.data) {
            setInputUserFirstName(user.data.firstName)
            setInputUserLastName(user.data.lastName)
            setInputUserEmail(user.data.email)
        }
    }, [user.data])

    useEffect(() => {
        if (userUpdateInfo && allowUpdateUser) {
            console.log(
                '[AdminDashboard useEffect update user info] userUpdateInfo: '
            )
            console.log(userUpdateInfo)

            console.log(
                '[AdminDashboard useEffect update user info] Updating...'
            )
            updateUserMutation.mutate()
        }
    }, [userUpdateInfo])
    return (
        <div>
            <ConfirmPopup />

            {/* Site Message */}
            <Dialog
                header="Site Message"
                visible={siteMessageDialogVisible}
                style={{ width: '20vw' }}
                onHide={() => setSiteMessageDialogVisible(false)}
                footer={siteMessageDialogFooter}
            >
                <div>
                    <br />
                    {/* Page */}
                    <div className="field">
                        <span className="p-float-label">
                            <InputText
                                id="dialogInput_SiteMessage_Page"
                                value={inputSiteMessagePage}
                                placeholder="Page"
                                onChange={(e) =>
                                    setInputSiteMessagePage(e.target.value)
                                }
                                style={{ width: '100%' }}
                                autoFocus
                            />
                            <label htmlFor="dialogInput_SiteMessage_Page">
                                Page
                            </label>
                        </span>
                    </div>

                    {/* Date Start */}
                    <div className="field">
                        <span className="p-float-label">
                            <Calendar
                                id="dialogInput_SiteMessage_DateStart"
                                value={inputSiteMessageDateStart}
                                placeholder="Date Start"
                                onChange={(e) =>
                                    setInputSiteMessageDateStart(e.target.value)
                                }
                                style={{ width: '100%' }}
                            />
                            <label htmlFor="dialogInput_SiteMessage_DateStart">
                                Date Start
                            </label>
                        </span>
                    </div>

                    {/* Date End */}
                    <div className="field">
                        <span className="p-float-label">
                            <Calendar
                                id="dialogInput_SiteMessage_DateEnd"
                                value={inputSiteMessageDateEnd}
                                placeholder="Date End"
                                onChange={(e) =>
                                    setInputSiteMessageDateEnd(e.target.value)
                                }
                                style={{ width: '100%' }}
                            />
                            <label htmlFor="dialogInput_SiteMessage_DateEnd">
                                Date End
                            </label>
                        </span>
                    </div>

                    {/* Message */}
                    <div className="field">
                        <span className="p-float-label">
                            <InputTextarea
                                id="dialogInput_SiteMessage_Message"
                                value={inputSiteMessageMessage}
                                placeholder="Message"
                                onChange={(e) =>
                                    setInputSiteMessageMessage(e.target.value)
                                }
                                rows={5}
                                style={{ width: '100%' }}
                            />
                            <label htmlFor="dialogInput_SiteMessage_Message">
                                Message
                            </label>
                        </span>
                    </div>

                    {/* Is Active */}
                    <div className="flex align-items-center">
                        <Checkbox
                            inputId="inputSiteMessage"
                            onChange={(e) =>
                                setInputSiteMessageIsActive(e.checked)
                            }
                            checked={inputSiteMessageIsActive}
                        />
                        <label htmlFor="inputSiteMessage" className="ml-2">
                            Currently Active
                        </label>
                    </div>
                </div>
            </Dialog>

            {/* Update User */}
            <Dialog
                header="Update User"
                visible={userDialogVisible}
                style={{ width: '20vw' }}
                onHide={() => setUserDialogVisible(false)}
                footer={userDialogFooter}
            >
                <div>
                    <br />
                    {/* First Name */}
                    <div className="field">
                        <span className="p-float-label">
                            <InputText
                                type="text"
                                id="dialogInput_User_FirstName"
                                value={inputUserFirstName}
                                placeholder="First Name"
                                onChange={(e) =>
                                    setInputUserFirstName(e.target.value)
                                }
                                style={{ width: '100%' }}
                                autoFocus
                            />
                            <label htmlFor="dialogInput_User_FirstName">
                                First Name:
                            </label>
                        </span>
                    </div>

                    {/* Last Name */}
                    <div className="field">
                        <span className="p-float-label">
                            <InputText
                                type="text"
                                id="dialogInput_User_LastName"
                                value={inputUserLastName}
                                placeholder="Last Name"
                                onChange={(e) =>
                                    setInputUserLastName(e.target.value)
                                }
                                style={{ width: '100%' }}
                            />
                            <label htmlFor="dialogInput_User_LastName">
                                Last Name:
                            </label>
                        </span>
                    </div>

                    {/* E-mail */}
                    <div className="field">
                        <span className="p-float-label">
                            <InputText
                                type="email"
                                id="dialogInput_User_Email"
                                value={inputUserEmail}
                                placeholder="E-mail"
                                onChange={(e) =>
                                    setInputUserEmail(e.target.value)
                                }
                                style={{ width: '100%' }}
                            />
                            <label htmlFor="dialogInput_User_Email">
                                E-mail:
                            </label>
                        </span>
                    </div>
                </div>
            </Dialog>

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
                                Store Open
                            </div>
                            <div id="adminDashboardStoreOpenSwitch">
                                <InputSwitch
                                    checked={settingsTemplate.storeOpen}
                                    onChange={(e) => onToggleStoreOpen(e)}
                                />
                            </div>
                        </div>
                        {!settingsTemplate.storeOpen && (
                            <div className="flex flex-column gap-2">
                                <InputTextarea
                                    value={settingsTemplate.storeClosedReason}
                                    onChange={(e) =>
                                        onChangeStoreClosedReason(e)
                                    }
                                    placeholder="Reason for closing (this is public)"
                                    rows={3}
                                    cols={30}
                                />
                                <Button
                                    type="button"
                                    className={styles.reasonClosedSaveButton}
                                    icon="pi pi-check"
                                    iconPos="left"
                                    label="Save"
                                    disabled={
                                        settingsTemplate.storeClosedReason
                                            .length <= 0
                                    }
                                    onClick={onSaveReasonClosed}
                                />
                            </div>
                        )}
                    </div>

                    {/* USER SETTINGS */}
                    <div className={styles.settingsSubtitle}>User Settings</div>
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

                        <div>
                            <Button
                                icon="pi pi-plus"
                                iconPos="left"
                                label="New"
                                onClick={() => {
                                    setInputSiteMessagePage('')
                                    setInputSiteMessageMessage('')
                                    setInputSiteMessageIsActive(true)
                                    setInputSiteMessageDateStart(null)
                                    setInputSiteMessageDateEnd(null)
                                    setSiteMessageDialogVisible(true)
                                }}
                            />
                        </div>

                        <br />

                        <DataTable
                            value={storeSettings?.data?.siteMessages}
                            loading={storeSettings.loading}
                        >
                            <Column header="Page" field="page" />
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
                            <Column
                                header="Created"
                                field="createdBy"
                                body={createdByTemplate}
                            />
                            <Column
                                header="Updated"
                                field="updatedBy"
                                body={updatedByTemplate}
                            />
                            <Column
                                header="Active"
                                field="isActive"
                                body={isActiveTemplate}
                            />
                            <Column
                                header="Actions"
                                body={messagesActionTemplate}
                            />
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

                        {/* DISPLAY USER DATA */}
                        {user && user.data && (
                            <div>
                                <div>
                                    <table
                                        style={{ border: '1px solid black' }}
                                    >
                                        <tbody>
                                            <tr>
                                                <td
                                                    style={{
                                                        padding: '1em',
                                                    }}
                                                >
                                                    <strong>Name: </strong>
                                                </td>
                                                <td style={{ padding: '1em' }}>
                                                    {user.data.firstName}{' '}
                                                    {user.data.lastName}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '1em' }}>
                                                    <strong>E-mail:</strong>{' '}
                                                </td>
                                                <td style={{ padding: '1em' }}>
                                                    {user.data.email}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '1em' }}>
                                                    <strong>Role:</strong>{' '}
                                                </td>
                                                <td style={{ padding: '1em' }}>
                                                    {user.data.role}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* EDIT BUTTON */}
                                <div className="mt-2">
                                    <Button
                                        type="button"
                                        icon="pi pi-pencil"
                                        iconPos="left"
                                        label="Edit"
                                        onClick={() => {
                                            // Set user data
                                            if (user && user.data) {
                                                setInputUserFirstName(
                                                    user.data.firstName
                                                )
                                                setInputUserLastName(
                                                    user.data.lastName
                                                )
                                                setInputUserEmail(
                                                    user.data.email
                                                )
                                            }
                                            setUserDialogVisible(true)
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}
