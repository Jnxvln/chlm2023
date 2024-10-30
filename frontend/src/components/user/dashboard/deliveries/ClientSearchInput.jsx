import { useState } from 'react'
import DeliveryForm from './DeliveryForm'
import DeliveryClientForm from './DeliveryClientForm'
import EditDeliveryClientForm from './EditDeliveryClientForm'
// PrimeReact Components
import { AutoComplete } from 'primereact/autocomplete'
import { Dropdown } from 'primereact/dropdown'
// Store data
import { fetchUser } from '../../../../api/users/usersApi'
import { getDeliveryClients } from '../../../../api/deliveryClients/deliveryClientsApi'
import { useQuery, useQueryClient } from '@tanstack/react-query'

function ClientSearchInput({ onClientSelected }) {
    // #region VARS -------------------------------

    const queryClient = useQueryClient()

    const [searchInput, setSearchInput] = useState('')
    const [clientTest, setClientTest] = useState(null)
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
            <div className="flex flex-column gap-2">
                <div>
                    {option.companyName ? (
                        <div>
                            <div>
                                <strong>{option.companyName}</strong>
                            </div>
                            {option.firstName && option.lastName ? (
                                <div>
                                    {option.firstName} {option.lastName}
                                </div>
                            ) : (
                                <div>
                                    <em>(Name missing)</em>
                                </div>
                            )}
                        </div>
                    ) : (
                        <strong>
                            {option.firstName} {option.lastName}
                        </strong>
                    )}
                </div>
                <div style={{ whiteSpace: 'pre' }}>{option.phone}</div>
                <div>
                    <address style={{ whiteSpace: 'pre', fontStyle: 'normal' }}>
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

    const selectedDeliveryClientTemplate = (option, props) => {
        if (option) {
            return (
                <div>
                    <div>
                        {option.firstName} {option.lastName}
                    </div>
                </div>
            )
        }

        return <span>{props.placeholder}</span>
    }

    const deliveryClientTemplate = (option, props) => {
        if (option) {
            return (
                <div>
                    <div>
                        {option.firstName} {option.lastName}
                    </div>
                </div>
            )
        }

        return <span>{props.placeholder}</span>
    }
    // #endregion

    const searchDeliveryClient = (e) => {
        const { query } = e
        let filteredClients = deliveryClients.data.filter(
            (client) =>
                query.toLowerCase().includes(client.firstName.toLowerCase()) ||
                query.toLowerCase().includes(client.lastName.toLowerCase()) || 
                query.toLowerCase().includes(client.firstName.toLowerCase() && client.lastName.toLowerCase()) || 
                query.toLowerCase().includes(client.phone.toLowerCase()) ||
                query.toLowerCase().includes(client.address.toLowerCase()) ||
                query.toLowerCase().includes(client.companyName.toLowerCase())
        )
        setFilteredClients(filteredClients)
    }

    const onChange = (e) => {
        onClientSelected(e.value)
        setSearchInput(e.value)
        setClientTest(e.value)
    }

    return (
        <div>
            <AutoComplete
                dropdown
                value={searchInput}
                field={searchFieldTemplate}
                itemTemplate={searchItemTemplate}
                suggestions={filteredClients}
                completeMethod={searchDeliveryClient}
                onChange={onChange}
                placeholder="Customer search (name, phone, address)"
            />

            {/* <Dropdown
                value={clientTest}
                options={deliveryClients.data}
                onChange={onChange}
                optionLabel="firstName"
                filter
                showClear
                filterBy="firstName"
                placeholder="Select Customer"
                valueTemplate={selectedDeliveryClientTemplate}
                itemTemplate={deliveryClientTemplate}
            /> */}

            {filteredClients.length <= 0 && searchInput.length > 0 ? (
                <DeliveryClientForm clientName={searchInput} />
            ) : null}
        </div>
    )
}

export default ClientSearchInput
