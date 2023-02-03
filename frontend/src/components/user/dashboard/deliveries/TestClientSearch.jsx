import { useState, useRef } from 'react'
import DeliveryForm from './DeliveryForm'
import DeliveryClientForm from './DeliveryClientForm'
import EditDeliveryClientForm from './EditDeliveryClientForm'
// PrimeReact Components
// import { AutoComplete } from 'primereact/autocomplete'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
// Store data
import { fetchUser } from '../../../../api/users/usersApi'
import { getDeliveryClients } from '../../../../api/deliveryClients/deliveryClientsApi'
import { useQuery, useQueryClient } from '@tanstack/react-query'

function TestClientSearch({ onClientSelected, selectedClient }) {
    // #region VARS -------------------------------

    const queryClient = useQueryClient()

    // const [searchInput, setSearchInput] = useState('')
    const [clientTest, setClientTest] = useState(null)
    const [filteredClients, setFilteredClients] = useState([])

    const [filterValue, setFilterValue] = useState('')
    const filterInputRef = useRef()

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
        // console.log(query)
        let filteredClients = deliveryClients.data.filter(
            (client) =>
                client.firstName.toLowerCase().includes(query.toLowerCase()) ||
                client.lastName.toLowerCase().includes(query.toLowerCase()) ||
                `${client.firstName.toLowerCase()} ${client.lastName.toLowerCase()}`.includes(
                    query.toLowerCase()
                ) ||
                client.phone.toLowerCase().includes(query.toLowerCase()) ||
                client.address.toLowerCase().includes(query.toLowerCase()) ||
                client.companyName.toLowerCase().includes(query.toLowerCase())
        )
        setFilteredClients(filteredClients)
    }

    const onChange = (e) => {
        // console.log('[TestClientSearch] Dropdown value changed: ')
        // console.log(e.value)
        setClientTest(e.value)
        onClientSelected(e.value)
    }

    // -----------------------------------------------------------------------------------------------------------------
    const filterTemplate = (options) => {
        let { filterOptions } = options

        return (
            <div className="flex gap-2">
                <InputText
                    value={filterValue}
                    ref={filterInputRef}
                    onChange={(e) => myFilterFunction(e, filterOptions)}
                />
                <Button
                    label="Reset"
                    onClick={() => myResetFunction(filterOptions)}
                />
            </div>
        )
    }

    const myResetFunction = (options) => {
        setFilterValue('')
        options.reset()
        filterInputRef && filterInputRef.current.focus()
    }

    const myFilterFunction = (event, options) => {
        console.log(event)
        let _filterValue = event.target.value
        setFilterValue(_filterValue)
        options.filter(event)
    }
    // -----------------------------------------------------------------------------------------------------------------

    return (
        <div>
            <Dropdown
                value={clientTest}
                options={deliveryClients.data}
                onChange={onChange}
                optionLabel="firstName"
                showClear
                filterBy="firstName,lastName,phone,companyName,address,coordinates"
                placeholder="Choose Client..."
                valueTemplate={selectedDeliveryClientTemplate}
                itemTemplate={deliveryClientTemplate}
                filter
            />

            {!selectedClient && <DeliveryClientForm />}
        </div>
    )
}

export default TestClientSearch
