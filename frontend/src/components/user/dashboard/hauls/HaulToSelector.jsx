import { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";

function HaulToSelector({ freightRoutes, vendorLocationSelected, onFreightRouteSelected }) {
  const [freightRouteSelected, setFreightRouteSelected] = useState(null);
  const [filteredFreightRoutes, setFilteredFreightRoutes] = useState([]);

  // #region TEMPLATES -------------------------------------
  const freightRouteItemTemplate = (option) => {
    return <>{option.destination}</>;
  };
  // #endregion

  const searchFreightRoute = (e) => {
    const { query } = e;

    if (freightRoutes && freightRoutes.length > 0) {
      const _filteredFreightRoutes = freightRoutes.filter(
        (route) =>
          route.destination.toLowerCase().includes(query.toLowerCase()) &&
          route.vendorLocationId === vendorLocationSelected._id
      );
      setFilteredFreightRoutes(_filteredFreightRoutes);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <AutoComplete
        dropdown
        id="haulToSelector"
        field="destination"
        value={freightRouteSelected}
        suggestions={filteredFreightRoutes}
        completeMethod={searchFreightRoute}
        itemTemplate={freightRouteItemTemplate}
        placeholder="To *"
        onChange={(e) => {
          setFreightRouteSelected(e.value);
          onFreightRouteSelected(e.value);
        }}
        style={{ width: "100%" }}
        required
      />
    </div>
  );
}

export default HaulToSelector;
