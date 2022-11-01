import { useState, useEffect } from "react";
import VendorLocationForm from "./VendorLocationForm";
import EditVendorLocationForm from "./EditVendorLocationForm";
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
import { deleteVendorLocation } from "../../../../features/vendorLocations/vendorLocationSlice";

function VendorLocationDataTable({ vendors, vendorLocations, vendorLocationsLoading }) {
  // #region VARS -------------------------
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [vendorLocationRowSelected, setVendorLocationRowSelected] = useState(null);
  const dispatch = useDispatch();
  // #endregion

  // #region TEMPLATES -------------------------
  const vendorLocationsDataTableHeaderTemplate = () => {
    return (
      <div className="flex justify-content-between">
        <div>
          <VendorLocationForm vendors={vendors} />
        </div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Name" />
        </span>
      </div>
    );
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

  //   const chtFuelSurchargeTemplate = (rowData) => {
  //     return <>{parseFloat(rowData.chtFuelSurcharge).toFixed(2)}</>;
  //   };

  //   const vendorFuelSurchargeTemplate = (rowData) => {
  //     return <>{parseFloat(rowData.vendorFuelSurcharge).toFixed(2)}</>;
  //   };

  const vendorNameTemplate = (rowData) => {
    const vendor = vendors.find((v) => v._id === rowData.vendorId);
    return <>{vendor.name}</>;
  };

  const actionsTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        <EditVendorLocationForm vendors={vendors} vendorLocation={rowData} />
        <Button
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={(e) => onDelete(e, rowData)}
        />
      </div>
    );
  };
  // #endregion

  // #region FILTERS -------------------------
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
    });

    setGlobalFilterValue("");
  };
  // #endregion

  // Delete vendor location confirmation
  const onDelete = (e, rowData) => {
    confirmPopup({
      target: e.target,
      message: `Delete location ${rowData.name}?`,
      icon: "pi pi-exclamation-triangle",
      accept: () => dispatch(deleteVendorLocation(rowData._id)),
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
          value={vendorLocations}
          loading={vendorLocationsLoading}
          header={vendorLocationsDataTableHeaderTemplate}
          globalFilterFields={["name"]}
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
          selection={vendorLocationRowSelected}
          onSelectionChange={(e) => setVendorLocationRowSelected(e.value)}
          dataKey="_id"
          stateStorage="session"
          stateKey="dt-vendorLocations-session"
          emptyMessage="No vendor locations found"
          stripedRows
        >
          {/* VENDOR */}
          <Column field="vendorId" header="Vendor" body={vendorNameTemplate} sortable></Column>

          {/* NAME */}
          <Column field="name" header="Name" sortable></Column>

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

export default VendorLocationDataTable;
