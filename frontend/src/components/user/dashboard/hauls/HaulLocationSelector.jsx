import { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";

function HaulLocationSelector({
  vendorLocations,
  onVendorLocationSelected,
  vendorSelected,
  value,
}) {
  const [vendorLocationSelected, setVendorLocationSelected] = useState(null);
  const [filteredVendorLocations, setFilteredVendorLocations] = useState([]);

  // #region TEMPLATES -------------------------------------
  const vendorLocationItemTemplate = (option) => {
    return <>{option.name}</>;
  };
  // #endregion

  const searchVendorLocation = (e) => {
    const { query } = e;

    if (vendorLocations && vendorLocations.length > 0) {
      const _filteredVendorLocations = vendorLocations.filter(
        (v) =>
          v.name.toLowerCase().includes(query.toLowerCase()) && v.vendorId === vendorSelected._id
      );
      setFilteredVendorLocations(_filteredVendorLocations);
    }
  };

  useEffect(() => {
    if (value) {
      setVendorLocationSelected(value);
    }
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <AutoComplete
        dropdown
        id="haulFromSelector"
        field="name"
        value={vendorLocationSelected}
        suggestions={filteredVendorLocations}
        completeMethod={searchVendorLocation}
        itemTemplate={vendorLocationItemTemplate}
        placeholder="Location *"
        onChange={(e) => {
          setVendorLocationSelected(e.value);
          onVendorLocationSelected(e.value);
        }}
        style={{ width: "100%" }}
        required
      />
    </div>
  );
}

export default HaulLocationSelector;
