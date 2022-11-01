import { useState, useEffect } from "react";
import FreightRouteForm from "./FreightRouteForm";
import EditFreightRouteForm from "./EditFreightRouteForm";
// PrimeReact Components
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmPopup } from "primereact/confirmpopup"; // To use <ConfirmPopup> tag
import { confirmPopup } from "primereact/confirmpopup"; // To use confirmPopup method
import { Button } from "primereact/button";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
// Store data
import { useDispatch } from "react-redux";
import { deleteFreightRoute } from "../../../../features/freightRoutes/freightRouteSlice";

function FreightRouteDataTable({ vendors, vendorLocations, freightRoutes, freightRoutesLoading }) {
  // #region VARS -------------------------------
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    destination: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [freightRouteRowSelected, setFreightRouteRowSelected] = useState(null);
  const dispatch = useDispatch();
  // #endregion

  // #region TEMPLATES -------------------------------
  const freightRoutesDataTableHeaderTemplate = () => {
    return (
      <div className="flex justify-content-between">
        <div>
          <FreightRouteForm vendors={vendors} vendorLocations={vendorLocations} />
        </div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Destination"
          />
        </span>
      </div>
    );
  };

  const vendorNameTemplate = (rowData) => {
    return <>{vendors.find((v) => v._id === rowData.vendorId).name}</>;
  };

  const vendorLocationTemplate = (rowData) => {
    return <>{vendorLocations.find((loc) => loc._id === rowData.vendorLocationId).name}</>;
  };

  const freightRouteFreightCostTemplate = (rowData) => {
    return <>${parseFloat(rowData.freightCost).toFixed(2)}</>;
  };

  const isActiveRowFilterTemplate = (options) => {
    <TriStateCheckbox
      value={options.value}
      onChange={(e) => options.filterApplyCallback(e.value)}
    />;
  };

  const isActiveTemplate = (rowData) => {
    return <>{rowData.isActive ? <i className="pi pi-check" /> : ""}</>;
  };

  const actionsTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        <EditFreightRouteForm
          vendors={vendors}
          vendorLocations={vendorLocations}
          freightRoute={rowData}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={(e) => onDelete(e, rowData)}
        />
      </div>
    );
  };
  // #endregion

  // #region FILTERS -------------------------------
  // Handle filter change
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // Initialize datatable filters
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      shortName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    setGlobalFilterValue("");
  };
  // #endregion

  // Delete vendor confirmation
  const onDelete = (e, rowData) => {
    confirmPopup({
      target: e.target,
      message: `Delete route ${rowData.destination}?`,
      icon: "pi pi-exclamation-triangle",
      accept: () => dispatch(deleteFreightRoute(rowData._id)),
      reject: () => null,
    });
  };

  // RUN ONCE - INIT FILTERS
  useEffect(() => {
    initFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="datatable-templating-demo">
      <ConfirmPopup />
      <div className="card" style={{ height: "calc(100vh - 145px)" }}>
        <DataTable
          value={freightRoutes}
          loading={freightRoutesLoading}
          header={freightRoutesDataTableHeaderTemplate}
          globalFilterFields={["destination"]}
          size="small"
          scrollable
          scrollHeight="flex"
          sortMode="multiple"
          responsiveLayout="scroll"
          filter="true"
          filters={filters}
          filterfield="name"
          filterDisplay="row"
          onFilter={(e) => setFilters(e.filters)}
          selectionMode="single"
          selection={freightRouteRowSelected}
          onSelectionChange={(e) => setFreightRouteRowSelected(e.value)}
          dataKey="_id"
          stateStorage="session"
          stateKey="dt-freightRoutes-session"
          emptyMessage="No freight routes found"
          stripedRows
        >
          {/* VENDOR NAME */}
          <Column field="vendorId" header="Vendor" body={vendorNameTemplate} sortable />

          {/* VENDOR LOCATION */}
          <Column
            field="vendorLocationId"
            header="Location"
            body={vendorLocationTemplate}
            sortable
          />

          {/* DESTINATION */}
          <Column
            field="destination"
            header="Destination"
            style={{ minWidth: "12em" }}
            sortable
          ></Column>

          {/* FREIGHT COST */}
          <Column
            field="freightCost"
            dataType="number"
            header="Freight Cost"
            body={freightRouteFreightCostTemplate}
            sortable
          ></Column>

          <Column field="notes" header="Notes" />

          {/* IS ACTIVE */}
          <Column
            field="isActive"
            dataType="boolean"
            header="Active"
            filterElement={isActiveRowFilterTemplate}
            body={isActiveTemplate}
            sortable
          ></Column>

          {/* ACTIONS */}
          <Column header="Actions" body={actionsTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default FreightRouteDataTable;
