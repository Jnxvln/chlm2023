import styles from './UserMessages.module.scss'

import { Button } from 'primereact/button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { TabView, TabPanel } from 'primereact/tabview'
import { Accordion, AccordionTab } from 'primereact/accordion'

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { fetchUser, getUsers } from '../../../../api/users/usersApi'
import {
   getUserMessagesByUserId,
   deleteUserMessage,
   updateUserMessage,
} from '../../../../api/userMessages/userMessagesApi'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import UserMessageForm from '../../../../components/user/dashboard/userMessages/UserMessageForm/UserMessageForm'

export default function UserMessages() {
   const queryClient = useQueryClient()

   // #region VARS =========================================================================================================
   const user = useQuery(['user'], fetchUser)

   const users = useQuery({
      queryKey: ['users'],
      enabled: !!user?.data?.token,
      queryFn: () => getUsers(user?.data?.token),
      onError: (err) => {
         console.error(err)
         toast.error('Error fetching list of users for UserMessages', {
            autoClose: 5000,
         })
      },
   })

   const userMessages = useQuery({
      queryKey: ['usermessages'],
      enabled: !!user?.data?.token,
      queryFn: () => getUserMessagesByUserId(user.data._id, user.data.token),
      // onSuccess: (data) => {
      //    console.log('User Messages: ')
      //    console.log(data)
      // },
      onError: (err) => {
         console.error(err)
         toast.error(
            'Error fetching user messages for current user. Check logs',
            { autoClose: 5000 }
         )
      },
   })

   const deleteMessageMutation = useMutation({
      mutationKey: ['usermessages'],
      mutationFn: (vars) => {
         // console.log('[UserMessages.jsx deleteMessageMutation] vars: ')
         // console.log(vars)
         return deleteUserMessage(vars.messageId, vars.userId, vars.token)
      },
      onSuccess: (data) => {
         // console.log(
         //    '[UserMessages deleteMessageMutation] Message deleted successfully!'
         // )
         // console.log(data)
         queryClient.invalidateQueries(['usermessages'])
         toast.success('Message deleted', { autoClose: 1000 })
      },
      onError: (err) => {
         console.error(err)
         toast.error('Error deleting message! Check logs', {
            autoClose: 5000,
         })
      },
   })

   const viewMessageMutation = useMutation({
      mutationKey: ['usermessages'],
      mutationFn: (vars) => updateUserMessage(vars, user?.data?.token),
      onSuccess: (data) => {
         if (data) {
            // console.log('[UserMessages.jsx viewMessageMutation] data: ')
            // console.log(data)
            queryClient.invalidateQueries(['usermessages'])
         }
      },
      onError: (err) => {
         const errMsg = 'Error marking message as viewed'
         console.log(errMsg)
         console.error(err)

         if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data.message
         ) {
            toast.error(err.response.data.message, { autoClose: 5000 })
         } else {
            toast.error(errMsg, { autoClose: 5000 })
         }
      },
   })
   // #endregion

   // #region ACTION HANDLERS ==============================================================================================
   const userIdToUser = (userId) => {
      return users?.data?.find((usr) => usr._id === userId)
   }

   const confirmDeleteMessage = (messageId) => {
      confirmDialog({
         message: 'Do you want to delete this message?',
         header: 'Delete Message',
         icon: 'pi pi-info-circle',
         acceptClassName: 'p-button-danger',
         accept: () =>
            deleteMessageMutation.mutate({
               messageId,
               userId: user?.data?._id,
               token: user?.data?.token,
            }),
         reject: () => {},
      })
   }

   const onMessageViewed = (e, msg) => {
      viewMessageMutation.mutate({
         _id: msg._id,
         messageViewed: true,
         recipientId: msg.recipientId,
         senderId: msg.senderId,
      })
   }

   // #endregion

   return (
      <section>
         <ConfirmDialog />

         <br />

         <UserMessageForm />

         <br />

         <TabView>
            {/* RECEIVED MESSAGES */}
            <TabPanel header="Received">
               <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                  <Accordion
                     onTabOpen={(e) => {
                        user &&
                           user.data &&
                           userMessages &&
                           userMessages.data &&
                           userMessages.data.length > 0 &&
                           userMessages.data.filter(
                              (msg) => msg.recipientId === user.data._id
                           ) &&
                           viewMessageMutation.mutate({
                              _id: userMessages.data.filter(
                                 (msg) => msg.recipientId === user.data._id
                              )[e.index]._id,
                              messageViewed: true,
                              recipientId: userMessages.data.filter(
                                 (msg) => msg.recipientId === user.data._id
                              )[e.index].recipientId,
                              senderId: userMessages.data.filter(
                                 (msg) => msg.recipientId === user.data._id
                              )[e.index].senderId,
                           })
                     }}
                  >
                     {user &&
                     user.data &&
                     userMessages &&
                     userMessages.data &&
                     userMessages.data.length > 0 ? (
                        userMessages.data
                           .filter((msg) => msg.recipientId === user.data._id)

                           .map((msg, idx) => {
                              return (
                                 msg.recipientDeleted === false && (
                                    <AccordionTab
                                       key={idx}
                                       header={
                                          <div>
                                             <div className="flex justify-content-between">
                                                {/* Action buttons */}
                                                <div className="flex gap-2">
                                                   {/* Delete Button */}
                                                   <div>
                                                      <Button
                                                         className="p-button-danger"
                                                         icon="pi pi-trash"
                                                         size="small"
                                                         style={{
                                                            marginRight: '1em',
                                                         }}
                                                         onClick={(e) => {
                                                            e.stopPropagation()
                                                            confirmDeleteMessage(
                                                               msg._id
                                                            )
                                                         }}
                                                      />
                                                   </div>
                                                </div>

                                                {/* Title & Meta */}
                                                <div>
                                                   {/* Title */}
                                                   <div>
                                                      <div
                                                         className={
                                                            msg &&
                                                            msg.messageViewed
                                                               ? styles.msgTitleViewed
                                                               : styles.msgTitleUnviewed
                                                         }
                                                      >
                                                         {msg.title}
                                                      </div>
                                                   </div>

                                                   {/* Meta */}
                                                   <div className="flex justify-space-between">
                                                      {/* From */}
                                                      <div
                                                         className={styles.meta}
                                                      >
                                                         {userIdToUser(
                                                            msg.createdBy
                                                         )
                                                            ? userIdToUser(
                                                                 msg.createdBy
                                                              ).firstName
                                                            : ''}{' '}
                                                         {userIdToUser(
                                                            msg.createdBy
                                                         )
                                                            ? userIdToUser(
                                                                 msg.createdBy
                                                              ).lastName
                                                            : ''}{' '}
                                                         <br />
                                                         {/* Mark Unread */}
                                                         {msg.messageViewed && (
                                                            <div
                                                               className={
                                                                  styles.metaMarkUnread
                                                               }
                                                               onClick={(e) => {
                                                                  e.stopPropagation()
                                                                  viewMessageMutation.mutate(
                                                                     {
                                                                        _id: msg._id,
                                                                        messageViewed: false,
                                                                        recipientId:
                                                                           msg.recipientId,
                                                                        senderId:
                                                                           msg.senderId,
                                                                     }
                                                                  )
                                                               }}
                                                            >
                                                               Mark Unread
                                                            </div>
                                                         )}
                                                      </div>

                                                      {/* Meta date/time */}
                                                      <div
                                                         className={`${styles.meta} ${styles.test}`}
                                                      >
                                                         {dayjs(
                                                            msg.createdAt
                                                         ).format(
                                                            'M/DD/YY @ h:mm a'
                                                         )}
                                                      </div>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       }
                                    >
                                       <div className="flex flex-column gap-2">
                                          <div>
                                             <div
                                                style={{
                                                   whiteSpace: 'pre',
                                                }}
                                             >
                                                {msg.message}
                                             </div>
                                          </div>
                                       </div>
                                    </AccordionTab>
                                 )
                              )
                           })
                     ) : (
                        <div style={{ fontStyle: 'italic' }}>
                           No messages at this time
                        </div>
                     )}
                  </Accordion>
               </div>
            </TabPanel>

            {/* SENT MESSAGES */}
            <TabPanel header="Sent">
               <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                  <Accordion>
                     {user &&
                     user.data &&
                     userMessages &&
                     userMessages.data &&
                     userMessages.data.length > 0 ? (
                        userMessages.data
                           .filter(
                              (msg) =>
                                 msg.senderId === user.data._id &&
                                 !msg.senderDeleted
                           )
                           .map((msg, idx) => {
                              return (
                                 <AccordionTab
                                    key={idx}
                                    header={
                                       <div>
                                          <div className="flex justify-content-between">
                                             {/* Action buttons */}
                                             <div className="flex gap-2">
                                                {/* Delete Button */}
                                                <div>
                                                   <Button
                                                      className="p-button-danger"
                                                      icon="pi pi-trash"
                                                      size="small"
                                                      style={{
                                                         marginRight: '1em',
                                                      }}
                                                      onClick={(e) => {
                                                         e.stopPropagation()
                                                         confirmDeleteMessage(
                                                            msg._id
                                                         )
                                                      }}
                                                   />
                                                </div>
                                             </div>

                                             {/* Title & Meta */}
                                             <div>
                                                {/* Title */}
                                                <div>
                                                   <div
                                                      className={
                                                         styles.msgTitle
                                                      }
                                                   >
                                                      {msg.title}
                                                   </div>
                                                </div>

                                                {/* Meta */}
                                                <div className="flex justify-space-between">
                                                   {/* To */}
                                                   <div className={styles.meta}>
                                                      to{' '}
                                                      {userIdToUser(
                                                         msg.recipientId
                                                      )
                                                         ? userIdToUser(
                                                              msg.recipientId
                                                           ).firstName
                                                         : ''}{' '}
                                                      {userIdToUser(
                                                         msg.recipientId
                                                      )
                                                         ? userIdToUser(
                                                              msg.recipientId
                                                           ).lastName
                                                         : ''}{' '}
                                                   </div>

                                                   {/* Meta date/time */}
                                                   <div
                                                      className={`${styles.meta} ${styles.test}`}
                                                   >
                                                      {dayjs(
                                                         msg.createdAt
                                                      ).format(
                                                         'M/DD/YY @ h:mm a'
                                                      )}
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    }
                                 >
                                    <div className="flex flex-column gap-2">
                                       <div>
                                          <div
                                             style={{
                                                whiteSpace: 'pre',
                                             }}
                                          >
                                             {msg.message}
                                          </div>
                                       </div>
                                    </div>
                                 </AccordionTab>
                              )
                           })
                     ) : (
                        <div style={{ fontStyle: 'italic' }}>
                           No sent messages at this time
                        </div>
                     )}
                  </Accordion>
               </div>
            </TabPanel>
         </TabView>
      </section>
   )
}
