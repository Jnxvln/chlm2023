import { useState } from "react";
import { Dropdown } from "primereact/dropdown";

function DriverSelector({ drivers }) {
  const [driverSelected, setSelectedDriver] = useState(undefined);

  const driverNameTemplate = (driver) => {
    return (
      <>
        {driver.firstName} {driver.lastName}
      </>
    );
  };

  const onChange = (e) => {
    console.log("DRIVER SELECTED: " + e.value);
    setSelectedDriver(e.value);
  };

  return (
    <>
      <Dropdown
        optionLabel={driverNameTemplate}
        optionValue="_id"
        value={driverSelected}
        options={drivers ? drivers.filter((d) => d.isActive === true) : []}
        onChange={onChange}
        placeholder="Choose driver..."
      />
    </>
  );
}

export default DriverSelector;
