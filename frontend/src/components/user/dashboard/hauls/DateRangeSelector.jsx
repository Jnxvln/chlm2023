import { useState } from "react";
import { Calendar } from "primereact/calendar";

function DateRangeSelector({ onDateRangeSelected }) {
  const [date, setDate] = useState(new Date());

  const onChange = (e) => {
    setDate(e.value);
    onDateRangeSelected(e);
  };

  return (
    <>
      <Calendar
        value={date}
        onChange={onChange}
        selectionMode="range"
        placeholder="Choose start & end date"
        showButtonBar
        showIcon
      />
    </>
  );
}

export default DateRangeSelector;
