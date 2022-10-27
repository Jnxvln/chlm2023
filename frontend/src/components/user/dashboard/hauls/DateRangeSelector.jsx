import { useState } from "react";
import { Calendar } from "primereact/calendar";

function DateRangeSelector({ onDateRangeSelected }) {
  // Set hauls date range to localStorage values (default to today's date if not)
  const _selectedHaulsDateRange = JSON.parse(localStorage.getItem("selectedHaulsDateRange"));

  if (_selectedHaulsDateRange && _selectedHaulsDateRange.length > 0) {
    for (let i = 0; i < _selectedHaulsDateRange.length; i++) {
      _selectedHaulsDateRange[i] = new Date(_selectedHaulsDateRange[i]);
    }
  }

  const [date, setDate] = useState(_selectedHaulsDateRange || new Date());

  const onChange = (e) => {
    if (!e || !e.value) {
      console.log("[DateRangeSelector onChange(e)]: No event found OR no value property exists on event");
      setDate(null)
      localStorage.removeItem('selectedHaulsDateRange')
      return;
    }

    const _dateRangeSelected = e.value;

    localStorage.setItem("selectedHaulsDateRange", JSON.stringify(_dateRangeSelected));
    setDate(_dateRangeSelected);
    onDateRangeSelected(e);
  };

  return (
    <>
      <Calendar value={date} onChange={onChange} selectionMode="range" placeholder="Choose start & end date" selectOtherMonths showButtonBar showIcon />
    </>
  );
}

export default DateRangeSelector;
