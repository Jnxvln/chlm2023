import { useState } from "react";
import { Dropdown } from "primereact/dropdown";

function DriverSelector({ drivers, onSelectDriver }) {
  const [selectedDriverId, setSelectedDriverId] = useState(localStorage.getItem("selectedDriverId") || undefined);

  const driverNameTemplate = (driver) => {
    return (
      <>
        {driver.firstName} {driver.lastName}
      </>
    );
  };

  const onChange = (e) => {
    if (!e || !e.value) {
      console.log("[DriverSelector onChange(e)]: No event found OR no value property exists on event");
      return;
    }

    const _driverId = e.value;

    localStorage.setItem("selectedDriverId", _driverId);
    setSelectedDriverId(_driverId);
    onSelectDriver(_driverId);
  };

  return (
    <>
      <Dropdown
        optionLabel={driverNameTemplate}
        optionValue="_id"
        value={selectedDriverId}
        options={drivers ? drivers.filter((d) => d.isActive === true) : []}
        onChange={onChange}
        placeholder="Choose driver..."
      />
    </>
  );
}

export default DriverSelector;
