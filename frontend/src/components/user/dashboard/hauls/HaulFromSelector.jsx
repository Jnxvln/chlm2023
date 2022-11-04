import { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";

function HaulFromSelector({ vendors, onVendorSelected, value }) {
  const [vendorSelected, setVendorSelected] = useState(null);
  const [filteredVendors, setFilteredVendors] = useState([]);

  // #region TEMPLATES -------------------------------------
  const vendorItemTemplate = (option) => {
    return <>{option.name}</>;
  };
  // #endregion

  const searchVendor = (e) => {
    const { query } = e;

    if (vendors && vendors.length > 0) {
      const _filteredVendors = vendors.filter((v) =>
        v.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredVendors(_filteredVendors);
    }
  };

  useEffect(() => {
    if (value) {
      setVendorSelected(value);
    }
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <AutoComplete
        dropdown
        id="haulFromSelector"
        field="name"
        value={vendorSelected}
        suggestions={filteredVendors}
        completeMethod={searchVendor}
        itemTemplate={vendorItemTemplate}
        placeholder="From *"
        onChange={(e) => {
          setVendorSelected(e.value);
          onVendorSelected(e.value);
        }}
        style={{ width: "100%" }}
        required
      />
    </div>
  );
}

export default HaulFromSelector;
