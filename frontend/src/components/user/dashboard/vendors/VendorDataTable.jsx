import { useState, useEffect } from "react";
import VendorForm from "./VendorForm";
import EditVendorForm from "./EditVendorForm";
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
import { deleteVendor } from "../../../../features/vendors/vendorSlice";

function VendorDataTable({ vendors, vendorsLoading }) {
  // #region VARS -------------------------
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    shortName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [vendorRowSelected, setVendorRowSelected] = useState(null);
  const dispatch = useDispatch();
  // #endregion

  // #region TEMPLATES -------------------------
  const vendorsDataTableHeaderTemplate = () => {
    return (
      <div className="flex justify-content-between">
        <div>
          <VendorForm />
        </div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Name or short name" />
        </span>
      </div>
    );
  };

  const isActiveRowFilterTemplate = (options) => {
    <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />;
  };

  const isActiveTemplate = (rowData) => {
    return <>{rowData.isActive ? <i className="pi pi-check" /> : ""}</>;
  };

  const chtFuelSurchargeTemplate = (rowData) => {
    return <>{parseFloat(rowData.chtFuelSurcharge).toFixed(2)}</>;
  };

  const vendorFuelSurchargeTemplate = (rowData) => {
    return <>{parseFloat(rowData.vendorFuelSurcharge).toFixed(2)}</>;
  };

  const actionsTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        <EditVendorForm vendor={rowData} />
        <Button icon="pi pi-trash" className="p-button-danger" onClick={(e) => onDelete(e, rowData)} />
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
      shortName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    setGlobalFilterValue("");
  };
  // #endregion

  // Delete vendor confirmation
  const onDelete = (e, rowData) => {
    confirmPopup({
      target: e.target,
      message: `Delete vendor ${rowData.name}?`,
      icon: "pi pi-exclamation-triangle",
      accept: () => dispatch(deleteVendor(rowData._id)),
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
          value={vendors}
          loading={vendorsLoading}
          header={vendorsDataTableHeaderTemplate}
          globalFilterFields={["name", "shortName"]}
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
          selection={vendorRowSelected}
          onSelectionChange={(e) => setVendorRowSelected(e.value)}
          dataKey="_id"
          stateStorage="session"
          stateKey="dt-vendors-session"
          emptyMessage="No vendors found"
          stripedRows
        >
          {/* NAME */}
          <Column field="name" header="Name" style={{ minWidth: "12em" }} sortable></Column>

          {/* SHORT NAME */}
          <Column
            field="shortName"
            header="Short Name"
            style={{ minWidth: "12em" }}
            sortable
          ></Column>

          {/* CHT FSC */}
          <Column field="chtFuelSurcharge" dataType="number" header="CHT FSC" style={{ minWidth: "12em" }} sortable body={chtFuelSurchargeTemplate}></Column>

          {/* VENDOR FSC */}
          <Column
            field="vendorFuelSurcharge"
            dataType="number"
            header="Vendor FSC"
            style={{ minWidth: "12em" }}
            sortable
            body={vendorFuelSurchargeTemplate}
          ></Column>

          {/* IS ACTIVE */}
          <Column field="isActive" dataType="boolean" header="Active" filterElement={isActiveRowFilterTemplate} body={isActiveTemplate} sortable></Column>

          {/* ACTIONS */}
          <Column header="Actions" body={actionsTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default VendorDataTable;
