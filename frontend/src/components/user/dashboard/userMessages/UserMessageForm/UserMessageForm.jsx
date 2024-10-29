import { useState, useEffect } from 'react'
import styles from './UserMessageForm.module.scss'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { toast } from 'react-toastify'

import { fetchUser, getUsers } from '../../../../../api/users/usersApi'
import { createUserMessage } from '../../../../../api/userMessages/userMessagesApi'
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import { InputText } from 'primereact/inputtext'

export default function UserMessageForm() {
   const queryClient = new QueryClient()

   const [visible, setVisible] = useState(false)
   const [form, setForm] = useState({
      recipient: '',
      title: '',
      message: '',
   })

   const user = useQuery(['user'], fetchUser)
   const users = useQuery({
      queryKey: ['users'],
      enabled: !!user?.data?.token,
      queryFn: () => getUsers(user?.data?.token),
   })

   const mutationCreateUserMessage = useMutation({
      mutationKey: ['usermessages'],
      mutationFn: () =>
         createUserMessage(
            {
               senderId: user?.data?._id,
               title: form.title,
               recipientId: form.recipient,
               message: form.message,
            },
            user?.data?.token
         ),
      onSuccess: (data) => {
         // console.log('[mutationCreateUserMessage] onSuccess data: ')
         // console.log(data)
         if (data) {
            toast.success('Message sent!', { autoClose: 1000, toastId: 'user-messages-message-sent-success' })
         }
         queryClient.invalidateQueries(['usermessages'])
      },
      onError: (err) => {
         console.error(err)
         if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data.message
         ) {
            toast.error(err.response.data.message, { autoClose: 5000, toastId: 'user-messages-failed-send' })
         } else {
            toast.error(err.message, { toastId: 'user-messages-failed-send-other' })
         }
      },
   })

   // #region ACTION HANDLERS =====================================================================

   const onNewMessage = () => {
      // console.log('[UserMessageForm.jsx onSendMessage] New message...')
      setVisible(true)
   }

   const onCancel = () => {
      // console.log('[UserMessageForm.jsx onSendMessage] Cancelling message...')
      setVisible(false)
   }

   const onSendMessage = () => {
      // console.log('[UserMessageForm.jsx onSendMessage] Sending message...')
      // console.log(
      //    '[UserMesageForm.jsx onSendMessage] Attempting to send message...'
      // )
      mutationCreateUserMessage.mutate()
      setVisible(false)
   }

   const onChange = (e) => {
      setForm((prevState) => ({
         ...prevState,
         [e.target.name]: e.target.value,
      }))
   }

   // #endregion

   // #region TEMPLATES ========================================================================
   const footer = (
      <footer>
         <Button onClick={onCancel} style={{ backgroundColor: '#6D6D6D' }}>
            Cancel
         </Button>
         <Button
            icon="pi pi-save"
            iconPos="left"
            label="Send"
            onClick={onSendMessage}
         />
      </footer>
   )

   const optionTemplate = (rowData) => {
      return (
         <>
            {rowData.firstName} {rowData.lastName}
         </>
      )
   }

   const recipientTemplate = (rowData) => {
      return (
         <>
            {rowData.firstName} {rowData.lastName}
         </>
      )
   }
   // #endregion

   return (
      <div className={styles.userMessageFormWrapper}>
         <Button label="New Message" icon="pi pi-plus" onClick={onNewMessage} />

         <Dialog
            header="Send Message"
            visible={visible}
            style={{ width: '30vw' }}
            footer={footer}
            onHide={onCancel}
         >
            <div className="p-0 m-0">
               <form>
                  <span className="p-float-label">
                     <Dropdown
                        inputid="recipient"
                        name="recipient"
                        value={form.recipient}
                        onChange={onChange}
                        options={
                           users && users.data
                              ? users.data.filter(
                                   (usr) => usr._id !== user?.data?._id
                                )
                              : []
                        }
                        optionLabel={optionTemplate}
                        itemTemplate={recipientTemplate}
                        optionValue="_id"
                        style={{ width: '100%' }}
                     />
                     <label htmlFor="recipient">Recipient</label>
                  </span>

                  <br />

                  <span className="p-float-label">
                     <InputText
                        inputid="title"
                        name="title"
                        value={form.title}
                        onChange={onChange}
                        style={{ width: '100%' }}
                     />
                     <label htmlFor="title">Title</label>
                  </span>

                  <br />

                  <span className="p-float-label">
                     <InputTextarea
                        inputid="message"
                        name="message"
                        value={form.message}
                        onChange={onChange}
                        style={{ width: '100%' }}
                        rows={5}
                     />
                     <label htmlFor="message">Message</label>
                  </span>
               </form>
            </div>
         </Dialog>
      </div>
   )
}
