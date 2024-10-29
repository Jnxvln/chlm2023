import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { fetchUser } from '../../../api/users/usersApi'

import { getDeliveryClientById } from '../../../api/deliveryClients/deliveryClientsApi'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

function DeliverySummary() {
    // #region VARS ====================================================
    const navigate = useNavigate()

    let [searchParams] = useSearchParams()
    let [delivery, setDelivery] = useState(null)

    const user = useQuery(['user'], fetchUser)

    const userId = user?.data?._id

    const deliveryClient = useQuery({
        queryKey: ['summaryDeliveryClient'],
        queryFn: () =>
            getDeliveryClientById(
                searchParams.get('deliveryClient'),
                user.data.token
            ),
        enabled: !!userId,
        onSuccess: (client) => {
            // console.log('Delivery client loaded...')
            // console.log(client)
        },
        onError: (err) => {
            console.log('Error fetching delivery clients: ')
            console.log(err)
            toast.error('Error loading delivery clients, check logs!', { toastId: 'error-loading-dlv-clients' })
        },
    })
    // #endregion

    // #region ACTION HANDLERS =============================================
    const resolveHasPaid = (val) => {
        if (val === true || val === 'true') {
            return (
                <i
                    className="pi pi-check"
                    style={{
                        fontSize: '1.5em',
                        fontWeight: 'bold',
                        marginLeft: '0.7em',
                    }}
                />
            )
        } else {
            return (
                <i
                    className="pi pi-times"
                    style={{
                        fontSize: '1.5em',
                        fontWeight: 'bold',
                        marginLeft: '0.7em',
                    }}
                />
            )
        }
    }
    // #endregion

    // #region useEffect ===============================================
    useEffect(() => {
        console.log('Search Params: ')
        console.log(searchParams.entries())

        let _delivery = {}

        for (const entry of searchParams.entries()) {
            const [param, value] = entry
            // console.log(param, value)
            _delivery[param] = value
        }

        console.log(_delivery)

        if (delivery === null) {
            setDelivery(_delivery)
        }
    }, [])

    useEffect(() => {
        if (delivery) {
            console.log(delivery)
        }
    }, [delivery])

    // #endregion

    return (
        <div style={{ padding: '0 2em' }}>
            {/* Title & Completed Checkbox */}
            <div style={{ display: 'flex', marginTop: '1em' }}>
                <h1
                    style={{
                        flex: '1',
                        textAlign: 'center',
                        fontSize: '1.5rem',
                    }}
                >
                    C&H Delivery Ticket
                </h1>

                {/* Completed Box */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                    }}
                >
                    <span>Completed</span>
                    <div
                        style={{
                            border: '1px solid black',
                            width: '25px',
                            height: '25px',
                        }}
                    ></div>
                </div>
            </div>

            <br />

            {/* ----------------------------------- */}

            <table border={0} style={{ width: '100%' }}>
                <tbody>
                    {/* Customer Name & Product Info */}
                    <tr>
                        <td>
                            <strong>Customer: </strong>
                            <div
                                style={{
                                    whiteSpace: 'pre',
                                    fontSize: '1.5rem',
                                }}
                            >
                                {deliveryClient && deliveryClient.data ? (
                                    <span>
                                        {deliveryClient.data.firstName}{' '}
                                        {deliveryClient.data.lastName}
                                    </span>
                                ) : (
                                    [Error]
                                )}
                            </div>
                        </td>
                        <td>
                            <strong>Product: </strong>
                            <div
                                style={{
                                    fontSize: '1.5rem',
                                    whiteSpace: 'pre',
                                }}
                            >
                                <table>
                                    <tbody>
                                        <tr>
                                            <td
                                                style={{
                                                    paddingRight: '1.5em',
                                                }}
                                            >
                                                {delivery &&
                                                    delivery.productName}
                                            </td>
                                            <td>
                                                {delivery &&
                                                    delivery.productQuantity}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <br />

                    {/* Phone & Deliver Date */}
                    <tr>
                        <td>
                            <strong>Phone: </strong>
                            {delivery && (
                                <div
                                    style={{
                                        fontSize: '1.5rem',
                                        whiteSpace: 'pre',
                                    }}
                                >
                                    {delivery.contactPhone}
                                </div>
                            )}
                        </td>
                        <td>
                            <strong>Deliver: </strong>
                            <div
                                style={{ whiteSpace: 'pre', fontSize: '1.5em' }}
                            >
                                {delivery &&
                                    dayjs(delivery.deliveryDate).format(
                                        'ddd MM/DD/YY'
                                    )}
                            </div>
                        </td>
                    </tr>

                    <br />

                    {/* Address & Deliver Date */}
                    <tr>
                        <td>
                            <strong>Address: </strong>
                            {delivery && (
                                <div
                                    style={{
                                        fontSize: '1.5em',
                                        whiteSpace: 'pre',
                                    }}
                                >
                                    {delivery.address}
                                </div>
                            )}
                        </td>
                        <td>
                            <strong>Paid: </strong>
                            {delivery && resolveHasPaid(delivery.hasPaid)}
                        </td>
                    </tr>

                    {/* Receipt Stuff */}
                    <tr>
                        <td></td>
                        <td>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '20px',
                                    alignItems: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <span
                                        style={{
                                            marginRight: '1em',
                                            fontSize: '1rem',
                                        }}
                                    >
                                        Give Receipt
                                    </span>
                                    <div
                                        style={{
                                            border: '1px solid black',
                                            width: '20px',
                                            height: '20px',
                                        }}
                                    ></div>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <span
                                        style={{
                                            marginRight: '1em',
                                            fontSize: '1rem',
                                        }}
                                    >
                                        E-mail Receipt
                                    </span>
                                    <div
                                        style={{
                                            border: '1px solid black',
                                            width: '20px',
                                            height: '20px',
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <br />
                </tbody>
            </table>

            {/* ------------------------------------- */}

            <div
                style={{
                    whiteSpace: 'pre',
                    lineHeight: '1.5',
                    padding: '1.5em 1em 1em 0',
                    fontSize: '1.3em',
                }}
            >
                {delivery && delivery.directions}
            </div>
        </div>
    )
}

export default DeliverySummary
