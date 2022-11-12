import { useState } from 'react'
import { Calendar } from 'primereact/calendar'

function DeliveryTimeframeSelector({ onDateRangeSelected }) {
    // Set delivery date range to localStorage values (default to today's date if not)
    const _selectedDeliveriesDateRange = JSON.parse(
        localStorage.getItem('selectedDeliveriesDateRange')
    )

    if (
        _selectedDeliveriesDateRange &&
        _selectedDeliveriesDateRange.length > 0
    ) {
        for (let i = 0; i < _selectedDeliveriesDateRange.length; i++) {
            _selectedDeliveriesDateRange[i] = new Date(
                _selectedDeliveriesDateRange[i]
            )
        }
    }

    const [date, setDate] = useState(_selectedDeliveriesDateRange || new Date())

    const onChange = (e) => {
        if (!e || !e.value) {
            console.log(
                '[DeliveryTimeframeSelector onChange(e)]: No event found OR no value property exists on event'
            )
            setDate(null)
            localStorage.removeItem('selectedDeliveriesDateRange')
            return
        }

        const _dateRangeSelected = e.value

        localStorage.setItem(
            'selectedDeliveriesDateRange',
            JSON.stringify(_dateRangeSelected)
        )
        setDate(_dateRangeSelected)
        onDateRangeSelected(e)
    }

    return (
        <>
            <Calendar
                value={date}
                onChange={onChange}
                selectionMode="range"
                placeholder="Choose start & end date"
                selectOtherMonths
                showButtonBar
                showIcon
            />
        </>
    )
}

export default DeliveryTimeframeSelector
