import { useState } from 'react'
import DeliveryForm from './DeliveryForm'
import DeliveryClientForm from './DeliveryClientForm'
import EditDeliveryClientForm from './EditDeliveryClientForm'
// PrimeReact Components
import { AutoComplete } from 'primereact/autocomplete'
// Store data
import { fetchUser } from '../../../../api/users/usersApi'
import { getDeliveryClients } from '../../../../api/deliveryClients/deliveryClientsApi'
import { useQuery, useQueryClient } from '@tanstack/react-query'

function ClientSearchInput({ onClientSelected }) {
    // #region VARS -------------------------------

    const queryClient = useQueryClient()

    const [searchInput, setSearchInput] = useState('')
    const [filteredClients, setFilteredClients] = useState([])

    const user = useQuery(['user'], fetchUser)

    const deliveryClients = useQuery({
        queryKey: ['deliveryClients'],
        queryFn: () => getDeliveryClients(user.data.token),
        onError: (err) => {
            console.log('Error fetching delivery clients: ')
            console.log(err)
        },
    })

    // #endregion

    // #region TEMPLATES -------------------------------
    const searchItemTemplate = (option) => {
        return (
            <div className="flex flex-column gap-2" style={{ width: '100%' }}>
                <div>
                    <strong>
                        {option.firstName} {option.lastName}
                    </strong>
                </div>
                <div style={{ whiteSpace: 'pre' }}>{option.phone}</div>
                <div>
                    <address style={{ whiteSpace: 'pre' }}>
                        {option.address}
                    </address>
                </div>
                <div className="flex gap-2">
                    <DeliveryForm selectedClient={option} iconButton />
                    <EditDeliveryClientForm
                        deliveryClientToEdit={option}
                        iconButton
                    />
                </div>
            </div>
        )
    }

    const searchFieldTemplate = (option) => {
        return `${option.firstName} ${option.lastName}`
    }
    // #endregion

    const searchDeliveryClient = (e) => {
        const { query } = e
        // console.log(query)
        let filteredClients = deliveryClients.data.filter(
            (client) =>
                client.firstName.toLowerCase().includes(query.toLowerCase()) ||
                client.lastName.toLowerCase().includes(query.toLowerCase()) ||
                `${client.firstName.toLowerCase()} ${client.lastName.toLowerCase()}`.includes(
                    query.toLowerCase()
                ) ||
                client.phone.toLowerCase().includes(query.toLowerCase()) ||
                client.address.toLowerCase().includes(query.toLowerCase())
        )
        setFilteredClients(filteredClients)
    }

    const onChange = (e) => {
        onClientSelected(e.value)
        setSearchInput(e.value)
    }

    return (
        <>
            <AutoComplete
                dropdown
                value={searchInput}
                field={searchFieldTemplate}
                itemTemplate={searchItemTemplate}
                suggestions={filteredClients}
                completeMethod={searchDeliveryClient}
                onChange={onChange}
                placeholder="Customer search (name, phone, address)"
                style={{ width: '15vw' }}
            />
            {filteredClients.length <= 0 && searchInput.length > 0 ? (
                <DeliveryClientForm clientName={searchInput} />
            ) : null}
        </>
    )
}

export default ClientSearchInput
